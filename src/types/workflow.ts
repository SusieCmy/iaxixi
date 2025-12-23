/*
 * @Date: 2025-12-11
 * @Description: 用户工作流类型定义
 */

export interface UserWorkflow {
  id: string
  name: string
  description: string
  group?: string // 工作流分组
  nodes: any[] // ReactFlow nodes
  edges: any[] // ReactFlow edges
  createdAt: number
  updatedAt: number
}

export interface WorkflowCardData {
  id: string
  name: string
  description: string
  updatedAt: number
}
