/*
 * @Date: 2025-12-18
 * @Description: 创建工作流弹窗组件
 */
'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CreateWorkflowModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: { name: string; description: string; group: string }) => void
}

// 预设分组选项
const GROUP_OPTIONS = [
  { value: '', label: '未分组' },
  { value: 'automation', label: '自动化流程' },
  { value: 'content', label: '内容生成' },
  { value: 'analysis', label: '数据分析' },
  { value: 'customer', label: '客户服务' },
  { value: 'other', label: '其他' },
]

export default function CreateWorkflowModal({
  isOpen,
  onClose,
  onConfirm,
}: CreateWorkflowModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [group, setGroup] = useState('')

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // 重置表单
  const resetForm = () => {
    setName('')
    setDescription('')
    setGroup('')
  }

  // 关闭弹窗
  const handleClose = () => {
    resetForm()
    onClose()
  }

  // 确认创建
  const handleConfirm = () => {
    if (!name.trim()) {
      return
    }
    onConfirm({
      name: name.trim(),
      description: description.trim(),
      group,
    })
    resetForm()
  }

  if (!isOpen) return null

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Escape' && handleClose()}
        role="button"
        tabIndex={0}
        aria-label="关闭弹窗"
      >
        {/* 弹窗主体 - 阻止点击事件冒泡 */}
        <div
          className="relative w-full max-w-lg rounded-2xl border border-base-300/50 bg-base-100 shadow-2xl transition-all"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="dialog"
          tabIndex={-1}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between border-base-300 border-b p-6">
            <h2 className="font-bold text-xl">创建工作流</h2>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-base-200"
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 内容区域 */}
          <div className="scrollbar-thin max-h-[60vh] overflow-y-auto p-6">
            <div className="space-y-6">
              {/* 工作流名称 */}
              <div>
                <label htmlFor="workflow-name" className="mb-2 block font-medium text-sm">
                  工作流名称 <span className="text-error">*</span>
                </label>
                <input
                  id="workflow-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-base-300 bg-base-100 px-4 py-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="请输入工作流名称"
                />
              </div>

              {/* 工作流描述 */}
              <div>
                <label htmlFor="workflow-description" className="mb-2 block font-medium text-sm">
                  描述信息
                </label>
                <textarea
                  id="workflow-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-base-300 bg-base-100 px-4 py-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="请输入工作流描述（可选）"
                />
              </div>

              {/* 分组选择 */}
              <div>
                <label htmlFor="workflow-group" className="mb-2 block font-medium text-sm">
                  分组
                </label>
                <select
                  id="workflow-group"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full rounded-lg border border-base-300 bg-base-100 px-4 py-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {GROUP_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 提示信息 */}
              <div className="rounded-lg bg-info/10 p-4">
                <p className="text-info text-sm">
                  💡 提示：创建后您可以在画布上拖拽节点，构建您的 AI 工作流程。
                </p>
              </div>
            </div>
          </div>

          {/* 底部操作栏 */}
          <div className="flex items-center gap-3 border-base-300 border-t p-6">
            <button
              onClick={handleClose}
              className="flex-1 rounded-lg border border-base-300 px-4 py-3 transition-all hover:bg-base-200"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={!name.trim()}
              className="flex-1 rounded-lg bg-primary px-4 py-3 font-medium text-primary-content transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              创建工作流
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
