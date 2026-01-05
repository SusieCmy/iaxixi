/*
 * @Date: 2025-12-18
 * @Description: 通用工作流节点组件 - 现代化卡片设计，左进右出
 */

import { Handle, Position } from '@xyflow/react'
import { Box, MoreHorizontal, Play, Plus, Trash2 } from 'lucide-react'
import { memo, useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'

interface DefaultNodeProps {
  data: {
    label?: string
    description?: string
    status?: 'idle' | 'running' | 'success' | 'error'
    enableErrorHandling?: boolean
    onAddNode?: (handleId?: string) => void
    onDelete?: () => void
    onCopy?: () => void
    // 国际化文本（从父组件传入）
    addNodeTooltip?: string
    deleteNodeTooltip?: string
  }
  selected?: boolean
}

function DefaultNode({ data, selected }: DefaultNodeProps) {
  const [showBranchSelector, setShowBranchSelector] = useState(false)
  const selectorRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setShowBranchSelector(false)
      }
    }

    if (showBranchSelector) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showBranchSelector])

  const statusStyles = {
    idle: {
      border: selected
        ? 'border-primary shadow-primary/20 shadow-xl ring-1 ring-primary/50'
        : 'border-primary/60 shadow-lg shadow-primary/5 hover:border-primary hover:shadow-primary/10 hover:shadow-xl',
      bg: 'bg-base-100',
    },
    running: {
      border: 'border-primary shadow-primary/30 shadow-xl ring-2 ring-primary/50 animate-pulse',
      bg: 'bg-base-100',
    },
    success: {
      border: 'border-success shadow-success/20 shadow-xl ring-1 ring-success/50',
      bg: 'bg-success/5',
    },
    error: {
      border: 'border-error shadow-error/20 shadow-xl ring-1 ring-error/50',
      bg: 'bg-error/10',
    },
  }[data.status || 'idle']

  const handleAddClick = (handleId?: string) => {
    data.onAddNode?.(handleId)
    setShowBranchSelector(false)
  }

  return (
    <div className="group relative">
      {/* 节点主体 */}
      <div
        className={cn(
          'relative min-w-[240px] overflow-hidden rounded-xl border-2 transition-all duration-200',
          statusStyles.border,
          statusStyles.bg
        )}
      >
        {/* 标题栏 */}
        <div
          className={cn(
            'flex items-center gap-2 border-base-200 border-b px-3 py-2.5',
            data.status === 'error' ? 'bg-error/5' : 'bg-base-50/50'
          )}
        >
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              data.status === 'error' ? 'bg-error/20 text-error' : 'bg-primary/10 text-primary'
            )}
          >
            <Box className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-base-content text-sm">
              {data.label || '未命名节点'}
            </div>
          </div>
          {/* 更多操作 */}
          <button className="flex h-6 w-6 items-center justify-center rounded-md text-base-content/40 hover:bg-base-200 hover:text-base-content">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-3">
          <div className="line-clamp-2 min-h-[1.5em] text-base-content/60 text-xs">
            {data.description || '暂无描述信息...'}
          </div>
        </div>

        {/* 异常处理模式下的输出标签 */}
        {/* {data.enableErrorHandling && (
          <div className="flex flex-col gap-3 border-base-200 border-t bg-base-50/30 p-3">
            <div className="flex items-center justify-end gap-2 text-xs font-medium text-base-content/70">
              <span>执行成功</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-xs font-medium text-base-content/70">
              <span>执行失败</span>
            </div>
          </div>
        )} */}
      </div>

      {/* 底部状态栏 - 绝对定位在左下角 */}
      {data.status && data.status !== 'idle' && (
        <div
          className={cn(
            'absolute -bottom-2 -left-2 flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-medium shadow-sm backdrop-blur-md transition-all',
            data.status === 'running'
              ? 'border-primary/20 bg-primary/5 text-primary'
              : data.status === 'success'
                ? 'border-success/20 bg-success/5 text-success'
                : 'border-error/20 bg-error/5 text-error'
          )}
        >
          {data.status === 'running' && <Play className="h-3 w-3 animate-spin" />}
          <span>
            {data.status === 'running'
              ? '运行中...'
              : data.status === 'success'
                ? '执行成功'
                : '执行失败'}
          </span>
        </div>
      )}

      {/* 左侧 - 输入 */}
      <Handle
        type="target"
        position={Position.Left}
        className="h-3.5! w-3.5! -left-2! border-2! border-primary! bg-base-100! transition-all hover:scale-125"
      />

      {/* 右侧 - 输出（始终渲染所有 Handle，通过 CSS 控制可见性） */}
      {/* 默认输出 Handle（无 id）- 仅在非异常处理模式下可见 */}
      <Handle
        type="source"
        position={Position.Right}
        id="source-default"
        className={cn(
          'h-3.5! w-3.5! -right-2! border-2! border-primary! bg-base-100! transition-all hover:scale-125',
          data.enableErrorHandling && 'opacity-0! pointer-events-none!'
        )}
      />
      {/* 成功分支 Handle - 仅在异常处理模式下可见 */}
      <Handle
        type="source"
        position={Position.Right}
        id="source-success"
        className={cn(
          'top-[40%]! h-3.5! w-3.5! -right-2! border-2! border-success! bg-base-100! transition-all hover:scale-125',
          !data.enableErrorHandling && 'opacity-0! pointer-events-none!'
        )}
      />
      {/* 失败分支 Handle - 仅在异常处理模式下可见 */}
      <Handle
        type="source"
        position={Position.Right}
        id="source-failure"
        className={cn(
          'top-[70%]! h-3.5! w-3.5! -right-2! border-2! border-error! bg-base-100! transition-all hover:scale-125',
          !data.enableErrorHandling && 'opacity-0! pointer-events-none!'
        )}
      />

      {/* 快捷添加按钮 - 悬停显示 */}
      <div
        ref={selectorRef}
        className={cn(
          'absolute -right-3 bottom-0 z-20 transition-all duration-200',
          showBranchSelector ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (data.enableErrorHandling) {
              setShowBranchSelector(!showBranchSelector)
            } else {
              handleAddClick()
            }
          }}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content/60 shadow-sm transition-all hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-content',
            showBranchSelector && 'border-primary bg-primary text-primary-content scale-110'
          )}
          title={data.addNodeTooltip || 'Add Next Node'}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>

        {/* 分支选择菜单 (仅在异常处理模式下显示) */}
        {showBranchSelector && data.enableErrorHandling && (
          <div className="absolute bottom-full right-0 mb-2 w-32 overflow-hidden rounded-lg border border-base-200 bg-base-100 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddClick('source-success')
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-base-200"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-success" />
                执行成功
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddClick('source-failure')
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-base-200"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-error" />
                执行失败
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 删除按钮 - 悬停显示 */}
      <div className="-top-3 -right-3 hover:opacity-100! absolute opacity-0 transition-all duration-200 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            data.onDelete?.()
          }}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-base-200 bg-base-100 text-base-content/40 shadow-sm transition-all hover:scale-110 hover:border-error hover:bg-error hover:text-error-content"
          title={data.deleteNodeTooltip || 'Delete Node'}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export default memo(DefaultNode)
