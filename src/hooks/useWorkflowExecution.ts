import type { Edge, Node } from '@xyflow/react'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useToast } from '@/components/toast/ToastContainer'
import type { ExecutionLog } from '@/components/workflow/panels/ExecutionLogPanel'

export function useWorkflowExecution(
  nodes: Node[],
  edges: Edge[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) {
  const [isRunning, setIsRunning] = useState(false)
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([])
  const [showLogPanel, setShowLogPanel] = useState(false)
  const toast = useToast()
  const tToast = useTranslations('toast')

  // 添加日志
  const addLog = useCallback(
    (
      nodeId: string,
      nodeName: string,
      status: 'running' | 'success' | 'error',
      message?: string
    ) => {
      setExecutionLogs((prev) => [
        ...prev,
        {
          id: `${nodeId}-${Date.now()}`,
          timestamp: new Date(),
          nodeId,
          nodeName,
          status,
          message,
        },
      ])
    },
    []
  )

  // 清空日志
  const clearLogs = useCallback(() => {
    setExecutionLogs([])
  }, [])

  // 获取节点名称
  const getNodeName = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId)
      return (node?.data?.label as string) || nodeId
    },
    [nodes]
  )

  // 更新节点状态
  const updateNodeStatus = useCallback(
    (nodeId: string, status: 'idle' | 'running' | 'success' | 'error') => {
      setNodes((nds) =>
        nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, status } } : node))
      )
    },
    [setNodes]
  )

  // 重置所有节点状态
  const resetAllNodeStatus = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { ...node.data, status: 'idle' },
      }))
    )
  }, [setNodes])

  const runWorkflow = useCallback(async () => {
    if (isRunning) return
    setIsRunning(true)
    setShowLogPanel(true)
    clearLogs()

    try {
      console.log('开始运行工作流')
      toast.success(tToast('workflowStarted'))

      // 1. 找到触发器节点
      const triggerNode = nodes.find((n) => n.type === 'trigger')
      if (!triggerNode) {
        toast.error('未找到触发器节点')
        return
      }

      // 重置所有节点和边的状态
      resetAllNodeStatus()
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          data: { ...edge.data, isExecuting: false },
          animated: false,
        }))
      )

      // 2. 实例化引擎
      const { WorkflowEngine } = await import('@/lib/workflow/engine')
      const engine = new WorkflowEngine(nodes, edges, {
        onProgress: (nodeId, status, result) => {
          console.log(`[Workflow] Node ${nodeId} ${status}`, result)
          const nodeName = getNodeName(nodeId)

          if (status === 'running') {
            updateNodeStatus(nodeId, 'running')
            addLog(nodeId, nodeName, 'running', '开始执行...')
          } else if (status === 'completed') {
            updateNodeStatus(nodeId, 'success')
            addLog(nodeId, nodeName, 'success', '执行完成')
            // 节点执行完成，激活其输出边
            setEdges((eds) =>
              eds.map((edge) => {
                if (edge.source === nodeId) {
                  // 只激活成功分支或默认分支
                  if (edge.sourceHandle === 'source-success' || !edge.sourceHandle) {
                    return {
                      ...edge,
                      data: { ...edge.data, isExecuting: true },
                      animated: true,
                    }
                  }
                }
                return edge
              })
            )
          } else if (status === 'failed') {
            updateNodeStatus(nodeId, 'error')
            const errorMsg = result?.error?.message || '执行失败'

            // 检查是否开启了异常处理
            const node = nodes.find((n) => n.id === nodeId)
            if (node?.data?.enableErrorHandling) {
              addLog(nodeId, nodeName, 'error', `${errorMsg} (已捕获)`)
              // 激活失败分支
              setEdges((eds) =>
                eds.map((edge) => {
                  if (edge.source === nodeId && edge.sourceHandle === 'source-failure') {
                    return {
                      ...edge,
                      data: { ...edge.data, isExecuting: true },
                      animated: true,
                    }
                  }
                  return edge
                })
              )
            } else {
              addLog(nodeId, nodeName, 'error', errorMsg)
              toast.error(`节点运行失败: ${nodeName}`)
            }
          }
        },
      })

      // 3. 注册处理器
      engine.registerHandler('trigger', {
        execute: async (data, context) => {
          console.log('执行触发器:', data)
          await new Promise((resolve) => setTimeout(resolve, 500))
          return { message: 'Triggered!' }
        },
      })

      engine.registerHandler('default', {
        execute: async (data, context) => {
          console.log('执行节点:', data)
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // 模拟随机失败 (约 30% 概率)
          if (Math.random() < 0.3) {
            throw new Error('模拟节点执行失败')
          }

          return { processed: true, input: data }
        },
      })

      // 4. 开始运行
      const result = await engine.run(triggerNode.id)
      console.log('工作流运行完成:', result)
      toast.success('工作流运行完成')

      // 运行完成后重置边状态
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          data: { ...edge.data, isExecuting: false },
          animated: false,
        }))
      )
    } catch (error) {
      console.error('工作流运行出错:', error)
      toast.error('工作流运行出错')

      // 失败时也重置边状态
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          data: { ...edge.data, isExecuting: false },
          animated: false,
        }))
      )
    } finally {
      setIsRunning(false)
    }
  }, [
    nodes,
    edges,
    isRunning,
    setEdges,
    toast,
    tToast,
    updateNodeStatus,
    resetAllNodeStatus,
    clearLogs,
    addLog,
    getNodeName,
  ])

  return {
    isRunning,
    runWorkflow,
    executionLogs,
    showLogPanel,
    setShowLogPanel,
    clearLogs,
  }
}
