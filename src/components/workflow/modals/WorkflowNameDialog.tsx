/*
 * @Date: 2025-12-12
 * @Description: 工作流命名对话框组件
 */
'use client'

interface WorkflowNameDialogProps {
  isOpen: boolean
  isNew: boolean
  name: string
  description: string
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string) => void
  onConfirm: () => void
  onCancel?: () => void
}

export default function WorkflowNameDialog({
  isOpen,
  isNew,
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onConfirm,
  onCancel,
}: WorkflowNameDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-xl bg-base-100 p-6 shadow-xl">
        <h2 className="mb-4 font-bold text-xl">{isNew ? '创建工作流' : '编辑工作流信息'}</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="workflow-name" className="mb-2 block font-medium text-sm">
              工作流名称
            </label>
            <input
              id="workflow-name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full rounded-lg border border-base-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="请输入工作流名称"
            />
          </div>

          <div>
            <label htmlFor="workflow-description" className="mb-2 block font-medium text-sm">
              描述（可选）
            </label>
            <textarea
              id="workflow-description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-base-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="请输入工作流描述"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {!isNew && onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 rounded-lg border border-base-300 px-4 py-2 transition-colors hover:bg-base-200"
            >
              取消
            </button>
          )}
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-primary-content transition-colors hover:bg-primary/90"
          >
            {isNew ? '创建' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}
