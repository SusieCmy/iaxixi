export interface ExecutionContext {
  variables: Record<string, any>
  history: ExecutionHistoryItem[]
}

export interface ExecutionHistoryItem {
  nodeId: string
  status: 'success' | 'failed'
  output: any
  timestamp: number
  duration: number
}

export interface NodeHandler {
  execute(data: any, context: ExecutionContext): Promise<any>
}

export type WorkflowStatus = 'idle' | 'running' | 'completed' | 'failed'

export interface WorkflowEngineOptions {
  onProgress?: (nodeId: string, status: 'running' | 'completed' | 'failed', result?: any) => void
}
