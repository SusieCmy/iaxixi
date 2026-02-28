/*
 * @Date: 2025-12-18
 * @Description: 创建工作流弹窗组件
 */
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>创建工作流</DialogTitle>
          <DialogDescription>
            💡 提示：创建后您可以在画布上拖拽节点，构建您的 AI 工作流程。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 工作流名称 */}
          <div className="space-y-2">
            <label htmlFor="workflow-name" className="font-medium text-sm">
              工作流名称 <span className="text-(--jp-error)">*</span>
            </label>
            <Input
              id="workflow-name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入工作流名称"
              autoComplete="off"
            />
          </div>

          {/* 工作流描述 */}
          <div className="space-y-2">
            <label htmlFor="workflow-description" className="font-medium text-sm">
              描述信息
            </label>
            <textarea
              id="workflow-description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-(--jp-mist) bg-(--jp-cream) px-3 py-2 text-sm transition-all focus:border-(--jp-vermilion) focus:outline-none focus:ring-(--jp-vermilion) focus:ring-1"
              placeholder="请输入工作流描述（可选）"
            />
          </div>

          {/* 分组选择 */}
          <div className="space-y-2">
            <label htmlFor="workflow-group" className="font-medium text-sm">
              分组
            </label>
            <select
              id="workflow-group"
              name="group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full rounded-lg border border-(--jp-mist) bg-(--jp-cream) px-3 py-2 text-sm transition-all focus:border-(--jp-vermilion) focus:outline-none focus:ring-(--jp-vermilion) focus:ring-1"
            >
              {GROUP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button onClick={handleConfirm} disabled={!name.trim()}>
            创建工作流
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
