/*
 * @Date: 2025-12-18
 * @Description: 通用工作流节点组件 - 现代化卡片设计，左进右出
 */

import { Handle, Position } from '@xyflow/react'
import { Box, MoreHorizontal, Play, Plus, Trash2 } from 'lucide-react'
import { memo, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

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
        ? 'border-[var(--jp-vermilion)] shadow-[var(--jp-vermilion)]/20 shadow-xl ring-1 ring-[var(--jp-vermilion)]/50'
        : 'border-[var(--jp-vermilion)]/60 shadow-lg shadow-[var(--jp-vermilion)]/5 hover:border-[var(--jp-vermilion)] hover:shadow-[var(--jp-vermilion)]/10 hover:shadow-xl',
      bg: 'bg-[var(--jp-cream)]',
    },
    running: {
      border:
        'border-[var(--jp-vermilion)] shadow-[var(--jp-vermilion)]/30 shadow-xl ring-2 ring-[var(--jp-vermilion)]/50 animate-pulse',
      bg: 'bg-[var(--jp-cream)]',
    },
    success: {
      border:
        'border-[var(--jp-success)] shadow-[var(--jp-success)]/20 shadow-xl ring-1 ring-[var(--jp-success)]/50',
      bg: 'bg-[var(--jp-success)]/5',
    },
    error: {
      border:
        'border-[var(--jp-error)] shadow-[var(--jp-error)]/20 shadow-xl ring-1 ring-[var(--jp-error)]/50',
      bg: 'bg-[var(--jp-error)]/10',
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
            'flex items-center gap-2 border-[var(--jp-mist)] border-b px-3 py-2.5',
            data.status === 'error' ? 'bg-[var(--jp-error)]/5' : 'bg-[var(--jp-paper)]/50'
          )}
        >
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              data.status === 'error'
                ? 'bg-[var(--jp-error)]/20 text-[var(--jp-error)]'
                : 'bg-[var(--jp-vermilion)]/10 text-[var(--jp-vermilion)]'
            )}
          >
            <Box className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-[var(--jp-ink)] text-sm">
              {data.label || '未命名节点'}
            </div>
          </div>
          {/* 更多操作 */}
          <button className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--jp-ink)]/40 hover:bg-[var(--jp-paper)] hover:text-[var(--jp-ink)]">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-3">
          <div className="line-clamp-2 min-h-[1.5em] text-[var(--jp-ink)]/60 text-xs">
            {data.description || '暂无描述信息...'}
          </div>
        </div>

        {/* 异常处理模式下的输出标签 */}
        {/* {data.enableErrorHandling && (
          <div className="flex flex-col gap-3 border-[var(--jp-mist)] border-t bg-[var(--jp-paper)]/30 p-3">
            <div className="flex items-center justify-end gap-2 text-xs font-medium text-[var(--jp-ink)]/70">
              <span>执行成功</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-xs font-medium text-[var(--jp-ink)]/70">
              <span>执行失败</span>
            </div>
          </div>
        )} */}
      </div>

      {/* 底部状态栏 - 绝对定位在左下角 */}
      {data.status && data.status !== 'idle' && (
        <div
          className={cn(
            '-bottom-2 -left-2 absolute flex items-center gap-1.5 rounded-lg border px-2 py-1 font-medium text-xs shadow-sm backdrop-blur-md transition-all',
            data.status === 'running'
              ? 'border-[var(--jp-vermilion)]/20 bg-[var(--jp-vermilion)]/5 text-[var(--jp-vermilion)]'
              : data.status === 'success'
                ? 'border-[var(--jp-success)]/20 bg-[var(--jp-success)]/5 text-[var(--jp-success)]'
                : 'border-[var(--jp-error)]/20 bg-[var(--jp-error)]/5 text-[var(--jp-error)]'
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
        className="-left-2! h-3.5! w-3.5! border-2! border-[var(--jp-vermilion)]! bg-[var(--jp-cream)]! transition-all hover:scale-125"
      />

      {/* 右侧 - 输出（始终渲染所有 Handle，通过 CSS 控制可见性） */}
      {/* 默认输出 Handle（无 id）- 仅在非异常处理模式下可见 */}
      <Handle
        type="source"
        position={Position.Right}
        id="source-default"
        className={cn(
          '-right-2! h-3.5! w-3.5! border-2! border-[var(--jp-vermilion)]! bg-[var(--jp-cream)]! transition-all hover:scale-125',
          data.enableErrorHandling && 'pointer-events-none! opacity-0!'
        )}
      />
      {/* 成功分支 Handle - 仅在异常处理模式下可见 */}
      <Handle
        type="source"
        position={Position.Right}
        id="source-success"
        className={cn(
          '-right-2! top-[40%]! h-3.5! w-3.5! border-2! border-[var(--jp-success)]! bg-[var(--jp-cream)]! transition-all hover:scale-125',
          !data.enableErrorHandling && 'pointer-events-none! opacity-0!'
        )}
      />
      {/* 失败分支 Handle - 仅在异常处理模式下可见 */}
      <Handle
        type="source"
        position={Position.Right}
        id="source-failure"
        className={cn(
          '-right-2! top-[70%]! h-3.5! w-3.5! border-2! border-[var(--jp-error)]! bg-[var(--jp-cream)]! transition-all hover:scale-125',
          !data.enableErrorHandling && 'pointer-events-none! opacity-0!'
        )}
      />

      {/* 快捷添加按钮 - 悬停显示 */}
      <div
        ref={selectorRef}
        className={cn(
          '-right-3 absolute bottom-0 z-20 transition-all duration-200',
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
            'flex h-6 w-6 items-center justify-center rounded-full border border-[var(--jp-mist)] bg-[var(--jp-cream)] text-[var(--jp-ink)]/60 shadow-sm transition-all hover:scale-110 hover:border-[var(--jp-vermilion)] hover:bg-[var(--jp-vermilion)] hover:text-[var(--jp-vermilion)]-content',
            showBranchSelector &&
              'scale-110 border-[var(--jp-vermilion)] bg-[var(--jp-vermilion)] text-[var(--jp-vermilion)]-content'
          )}
          title={data.addNodeTooltip || 'Add Next Node'}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>

        {/* 分支选择菜单 (仅在异常处理模式下显示) */}
        {showBranchSelector && data.enableErrorHandling && (
          <div className="fade-in zoom-in-95 absolute right-0 bottom-full mb-2 w-32 animate-in overflow-hidden rounded-lg border border-[var(--jp-mist)] bg-[var(--jp-cream)] shadow-xl duration-200">
            <div className="p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddClick('source-success')
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-[var(--jp-paper)]"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--jp-success)]" />
                执行成功
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddClick('source-failure')
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-[var(--jp-paper)]"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--jp-error)]" />
                执行失败
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 删除按钮 - 悬停显示 */}
      <div className="-top-3 -right-3 absolute opacity-0 transition-all duration-200 hover:opacity-100! group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            data.onDelete?.()
          }}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--jp-mist)] bg-[var(--jp-cream)] text-[var(--jp-ink)]/40 shadow-sm transition-all hover:scale-110 hover:border-[var(--jp-error)] hover:bg-[var(--jp-error)] hover:text-white"
          title={data.deleteNodeTooltip || 'Delete Node'}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export default memo(DefaultNode)
