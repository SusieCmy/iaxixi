/*
 * @Date: 2026-01-05
 * @Description: 分支节点组件 - 1进3出，带分支选择菜单
 */

import { Handle, Position } from '@xyflow/react'
import { GitBranch, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { memo, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface SwitchNodeProps {
  data: {
    label?: string
    description?: string
    status?: 'idle' | 'running' | 'success' | 'error'
    onDelete?: () => void
    onAddNode?: (handleId?: string) => void
    deleteNodeTooltip?: string
    addNodeTooltip?: string
  }
  selected?: boolean
}

function SwitchNode({ data, selected }: SwitchNodeProps) {
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
        ? 'border-[var(--jp-warning)] shadow-[var(--jp-warning)]/20 shadow-xl ring-1 ring-[var(--jp-warning)]/50'
        : 'border-[var(--jp-warning)]/60 shadow-lg shadow-[var(--jp-warning)]/5 hover:border-[var(--jp-warning)] hover:shadow-[var(--jp-warning)]/10 hover:shadow-xl',
      bg: 'bg-[var(--jp-cream)]',
    },
    running: {
      border:
        'border-[var(--jp-warning)] shadow-[var(--jp-warning)]/30 shadow-xl ring-2 ring-[var(--jp-warning)]/50 animate-pulse',
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

  const handleAddClick = (handleId: string) => {
    data.onAddNode?.(handleId)
    setShowBranchSelector(false)
  }

  return (
    <div className="group relative">
      {/* 节点主体 */}
      <div
        className={cn(
          'relative min-h-[160px] w-[160px] overflow-hidden rounded-xl border-2 transition-all duration-200',
          statusStyles.border,
          statusStyles.bg
        )}
      >
        {/* 标题栏 */}
        <div
          className={cn(
            'flex items-center justify-between border-[var(--jp-mist)] border-b px-3 py-2.5',
            data.status === 'error' ? 'bg-[var(--jp-error)]/5' : 'bg-[var(--jp-warning)]/10'
          )}
        >
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              data.status === 'error'
                ? 'bg-[var(--jp-error)]/20 text-[var(--jp-error)]'
                : 'bg-[var(--jp-warning)]/20 text-[var(--jp-ink)]'
            )}
          >
            <GitBranch className="h-4 w-4" />
          </div>
          {/* 更多操作 */}
          <button className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--jp-ink)]/40 hover:bg-[var(--jp-paper)] hover:text-[var(--jp-ink)]">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* 内容区域 - 输出标签 */}
        <div className="flex flex-col justify-between gap-6 p-3 pt-4">
          <div className="flex items-center justify-end font-medium text-[var(--jp-ink)]/70 text-xs">
            <span>分支 1</span>
          </div>
          <div className="flex items-center justify-end font-medium text-[var(--jp-ink)]/70 text-xs">
            <span>分支 2</span>
          </div>
          <div className="flex items-center justify-end font-medium text-[var(--jp-ink)]/70 text-xs">
            <span>默认</span>
          </div>
        </div>
      </div>

      {/* 左侧 - 输入 (1个) */}
      <Handle
        type="target"
        position={Position.Left}
        className="-left-2! h-3.5! w-3.5! border-2! border-[var(--jp-warning)]! bg-[var(--jp-cream)]! transition-all hover:scale-125"
      />

      {/* 右侧 - 输出 (3个) */}
      {/* 分支 1 */}
      <Handle
        type="source"
        position={Position.Right}
        id="case-1"
        className="-right-2! top-[70px]! h-3.5! w-3.5! border-2! border-[var(--jp-warning)]! bg-[var(--jp-cream)]! transition-all hover:scale-125"
      />
      {/* 分支 2 */}
      <Handle
        type="source"
        position={Position.Right}
        id="case-2"
        className="-right-2! top-[110px]! h-3.5! w-3.5! border-2! border-[var(--jp-warning)]! bg-[var(--jp-cream)]! transition-all hover:scale-125"
      />
      {/* 默认分支 */}
      <Handle
        type="source"
        position={Position.Right}
        id="default"
        className="-right-2! top-[150px]! h-3.5! w-3.5! border-2! border-[var(--jp-warning)]! bg-[var(--jp-cream)]! transition-all hover:scale-125"
      />

      {/* 快捷添加按钮 - 悬停显示 */}
      <div
        ref={selectorRef}
        className={cn(
          '-right-3 -bottom-2 absolute z-20 transition-all duration-200',
          showBranchSelector ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowBranchSelector(!showBranchSelector)
          }}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full border border-[var(--jp-mist)] bg-[var(--jp-cream)] text-[var(--jp-ink)]/60 shadow-sm transition-all hover:scale-110 hover:border-[var(--jp-warning)] hover:bg-[var(--jp-warning)] hover:text-white',
            showBranchSelector &&
              'scale-110 border-[var(--jp-warning)] bg-[var(--jp-warning)] text-white'
          )}
          title={data.addNodeTooltip || 'Add Next Node'}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>

        {/* 分支选择菜单 */}
        {showBranchSelector && (
          <div className="fade-in zoom-in-95 absolute right-0 bottom-full mb-2 w-32 animate-in overflow-hidden rounded-lg border border-[var(--jp-mist)] bg-[var(--jp-cream)] shadow-xl duration-200">
            <div className="p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddClick('case-1')
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-[var(--jp-paper)]"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--jp-warning)]" />
                分支 1
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddClick('case-2')
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-[var(--jp-paper)]"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--jp-warning)]" />
                分支 2
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddClick('default')
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-[var(--jp-paper)]"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--jp-ash)]" />
                默认分支
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

export default memo(SwitchNode)
