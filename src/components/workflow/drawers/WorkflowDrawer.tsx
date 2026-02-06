/*
 * @Date: 2025-12-18
 * @Description: 工作流抽屉式表单组件
 */
'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface WorkflowDrawerProps {
  isOpen: boolean
  isNew: boolean
  name: string
  description: string
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string) => void
  onConfirm: () => void
  onCancel?: () => void
}

export default function WorkflowDrawer({
  isOpen,
  isNew,
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onConfirm,
  onCancel,
}: WorkflowDrawerProps) {
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

  if (!isOpen) return null

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
        onKeyDown={(e) => e.key === 'Escape' && onCancel?.()}
        role="button"
        tabIndex={0}
        aria-label="关闭弹窗"
      >
        {/* 弹窗主体 - 阻止点击事件冒泡 */}
        <div
          className="relative w-full max-w-lg rounded-2xl border border-[var(--jp-mist)]/50 bg-[var(--jp-cream)] shadow-2xl transition-all"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="dialog"
          tabIndex={-1}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between border-[var(--jp-mist)] border-b p-6">
            <h2 className="font-bold text-xl">{isNew ? '创建工作流' : '编辑工作流信息'}</h2>
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--jp-paper)]"
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* 内容区域 */}
          <div className="scrollbar-thin max-h-[60vh] overflow-y-auto p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="workflow-name" className="mb-2 block font-medium text-sm">
                  工作流名称 <span className="text-error">*</span>
                </label>
                <input
                  id="workflow-name"
                  type="text"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  className="w-full rounded-lg border border-[var(--jp-mist)] bg-[var(--jp-cream)] px-4 py-3 transition-all focus:border-[var(--jp-vermilion)] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="请输入工作流名称"
                />
              </div>

              <div>
                <label htmlFor="workflow-description" className="mb-2 block font-medium text-sm">
                  描述信息
                </label>
                <textarea
                  id="workflow-description"
                  value={description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-[var(--jp-mist)] bg-[var(--jp-cream)] px-4 py-3 transition-all focus:border-[var(--jp-vermilion)] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="请输入工作流描述（可选）"
                />
              </div>

              {isNew && (
                <div className="rounded-lg bg-info/10 p-4">
                  <p className="text-info text-sm">
                    💡 提示：创建后您可以在画布上拖拽节点，构建您的 AI 工作流程。
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 底部操作栏 */}
          <div className="flex items-center gap-3 border-[var(--jp-mist)] border-t p-6">
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 rounded-lg border border-[var(--jp-mist)] px-4 py-3 transition-all hover:bg-[var(--jp-paper)]"
              >
                取消
              </button>
            )}
            <button
              onClick={onConfirm}
              className="flex-1 rounded-lg bg-[var(--jp-vermilion)] px-4 py-3 font-medium text-[var(--jp-vermilion)]-content transition-all hover:bg-[var(--jp-vermilion)]/90"
            >
              {isNew ? '开始创建' : '保存修改'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
