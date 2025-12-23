/*
 * @Date: 2025-12-18
 * @Description: 节点配置抽屉组件
 */
'use client'

import type { Node } from '@xyflow/react'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface NodeConfigDrawerProps {
  isOpen: boolean
  node: Node | null
  onClose: () => void
  onSave: (nodeData: { label: string; description: string }) => void
}

export default function NodeConfigDrawer({ isOpen, node, onClose, onSave }: NodeConfigDrawerProps) {
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')

  // 当节点变化时更新表单
  useEffect(() => {
    if (node) {
      setLabel((node.data?.label as string) || '')
      setDescription((node.data?.description as string) || '')
    }
  }, [node])

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

  const handleSave = () => {
    if (!label.trim()) {
      return
    }
    onSave({ label: label.trim(), description: description.trim() })
    onClose()
  }

  if (!isOpen || !node) return null

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
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
            <div>
              <h2 className="font-bold text-xl">配置节点</h2>
              <p className="text-base-content/60 text-sm">ID: {node.id}</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-base-200"
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 内容区域 */}
          <div className="scrollbar-thin max-h-[60vh] overflow-y-auto p-6">
            <div className="space-y-6">
              {/* 节点名称 */}
              <div>
                <label htmlFor="node-label" className="mb-2 block font-medium text-sm">
                  节点名称 <span className="text-error">*</span>
                </label>
                <input
                  id="node-label"
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full rounded-lg border border-base-300 bg-base-100 px-4 py-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="请输入节点名称"
                />
              </div>

              {/* 节点描述 */}
              <div>
                <label htmlFor="node-description" className="mb-2 block font-medium text-sm">
                  节点描述
                </label>
                <textarea
                  id="node-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-base-300 bg-base-100 px-4 py-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="描述这个节点的功能（可选）"
                />
              </div>

              {/* 节点类型选择（预留） */}
              <div>
                <label className="mb-2 block font-medium text-sm">节点类型</label>
                <select
                  className="w-full rounded-lg border border-base-300 bg-base-100 px-4 py-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  defaultValue="default"
                >
                  <option value="default">默认节点</option>
                  <option value="input">输入节点</option>
                  <option value="output">输出节点</option>
                  <option value="ai">AI 处理节点</option>
                </select>
              </div>

              {/* 提示信息 */}
              <div className="rounded-lg bg-info/10 p-4">
                <p className="text-info text-sm">
                  💡 提示：配置完成后，节点将在画布上显示新的名称。您可以随时点击节点重新编辑。
                </p>
              </div>
            </div>
          </div>

          {/* 底部操作栏 */}
          <div className="flex items-center gap-3 border-base-300 border-t p-6">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-base-300 px-4 py-3 transition-all hover:bg-base-200"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex-1 rounded-lg bg-primary px-4 py-3 font-medium text-primary-content transition-all hover:bg-primary/90"
            >
              保存配置
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
