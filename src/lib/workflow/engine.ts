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
          const nextNodes = this.findNextNodes(nodeId)
          queue.push(...nextNodes)
        } catch (error) {
          console.error(`Error executing node ${nodeId}:`, error)
          this.options.onProgress?.(nodeId, 'failed', error)
          throw error
        }
      }
    } catch (error) {
      console.error('Workflow execution failed:', error)
      throw error
    }

    return context
  }

  private findNextNodes(nodeId: string): string[] {
    return this.edges.filter((edge) => edge.source === nodeId).map((edge) => edge.target)
  }
}
