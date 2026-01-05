import type { Edge, Node } from '@xyflow/react'
import type { ExecutionContext, NodeHandler, WorkflowEngineOptions } from './types'

export class WorkflowEngine {
  private nodes: Map<string, Node>
  private edges: Edge[]
  private handlers: Map<string, NodeHandler>
  private options: WorkflowEngineOptions

  constructor(nodes: Node[], edges: Edge[], options: WorkflowEngineOptions = {}) {
    this.nodes = new Map(nodes.map((n) => [n.id, n]))
    this.edges = edges
    this.handlers = new Map()
    this.options = options
  }

  registerHandler(type: string, handler: NodeHandler) {
    this.handlers.set(type, handler)
  }

  async run(startNodeId: string) {
    const context: ExecutionContext = { variables: {}, history: [] }
    const queue = [startNodeId]
    const visited = new Set<string>()

    try {
      while (queue.length > 0) {
        const nodeId = queue.shift()!
        if (visited.has(nodeId)) continue // 防止简单环路死循环
        visited.add(nodeId)

        const node = this.nodes.get(nodeId)
        if (!node) continue

        // 通知 UI：节点开始运行
        this.options.onProgress?.(nodeId, 'running')

        const startTime = Date.now()
        let result: any

        try {
          const handler = this.handlers.get(node.type || 'default')
          if (!handler) {
            console.warn(`No handler found for node type: ${node.type}`)
            result = { error: 'No handler found' }
          } else {
            result = await handler.execute(node.data, context)
          }

          // 记录执行历史
          context.history.push({
            nodeId,
            status: 'success',
            output: result,
            timestamp: Date.now(),
            duration: Date.now() - startTime,
          })
          context.variables[nodeId] = result

          // 通知 UI：节点运行完成
          this.options.onProgress?.(nodeId, 'completed', result)

          // 查找并加入下一个节点
          const nextNodes = this.findNextNodes(nodeId, 'success')
          queue.push(...nextNodes)
        } catch (error) {
          console.error(`Error executing node ${nodeId}:`, error)
          this.options.onProgress?.(nodeId, 'failed', error)
          
          // 检查是否开启了异常处理
          if (node.data?.enableErrorHandling) {
            const failureNodes = this.findNextNodes(nodeId, 'error')
            if (failureNodes.length > 0) {
              // 如果有失败分支，继续执行
              queue.push(...failureNodes)
              continue
            }
          }
          
          throw error
        }
      }
    } catch (error) {
      console.error('Workflow execution failed:', error)
      throw error
    }

    return context
  }

  private findNextNodes(nodeId: string, status: 'success' | 'error'): string[] {
    const node = this.nodes.get(nodeId)
    if (!node) return []

    return this.edges
      .filter((edge) => {
        if (edge.source !== nodeId) return false

        // 如果开启了异常处理
        if (node.data?.enableErrorHandling) {
          if (status === 'success') {
            // 成功状态：只走 source-success 或默认（无 handleId）
            return edge.sourceHandle === 'source-success' || !edge.sourceHandle
          } else {
            // 失败状态：只走 source-failure
            return edge.sourceHandle === 'source-failure'
          }
        }

        // 未开启异常处理：只在成功时走默认路径
        return status === 'success'
      })
      .map((edge) => edge.target)
  }
}
