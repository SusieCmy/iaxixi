/*
 * @Date: 2025-12-11
 * @Description: 工作流本地存储工具
 */

import type { UserWorkflow } from '@/types/workflow'

const STORAGE_KEY = 'user_workflows'

export const workflowStorage = {
  // 获取所有工作流
  getAll: (): UserWorkflow[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  // 获取单个工作流
  getById: (id: string): UserWorkflow | null => {
    const workflows = workflowStorage.getAll()
    return workflows.find((w) => w.id === id) || null
  },

  // 保存工作流
  save: (workflow: UserWorkflow): void => {
    const workflows = workflowStorage.getAll()
    const index = workflows.findIndex((w) => w.id === workflow.id)

    if (index >= 0) {
      workflows[index] = { ...workflow, updatedAt: Date.now() }
    } else {
      workflows.push(workflow)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows))
  },

  // 删除工作流
  delete: (id: string): void => {
    const workflows = workflowStorage.getAll().filter((w) => w.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows))
  },
}
