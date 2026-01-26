/*
 * @Date: 2026-01-05
 * @Description: 分支节点组件 - 1进3出，带分支选择菜单
 */

import { Handle, Position } from '@xyflow/react'
import { GitBranch, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { memo, useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'

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
        ? 'border-warning shadow-warning/20 shadow-xl ring-1 ring-warning/50'
        : 'border-warning/60 shadow-lg shadow-warning/5 hover:border-warning hover:shadow-warning/10 hover:shadow-xl',
      bg: 'bg-base-100',
    },
    running: {
      border: 'border-warning shadow-warning/30 shadow-xl ring-2 ring-warning/50 animate-pulse',
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
            'flex items-center justify-between border-base-200 border-b px-3 py-2.5',
            data.status === 'error' ? 'bg-error/5' : 'bg-warning/10'
          )}
        >
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              data.status === 'error'
                ? 'bg-error/20 text-error'
                : 'bg-warning/20 text-warning-content'
            )}
          >
            <GitBranch className="h-4 w-4" />
          </div>
          {/* 更多操作 */}
          <button className="flex h-6 w-6 items-center justify-center rounded-md text-base-content/40 hover:bg-base-200 hover:text-base-content">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* 内容区域 - 输出标签 */}
        <div className="flex flex-col justify-between gap-6 p-3 pt-4">
          <div className="flex items-center justify-end font-medium text-base-content/70 text-xs">
            <span>分支 1</span>
          </div>
          <div className="flex items-center justify-end font-medium text-base-content/70 text-xs">
            <span>分支 2</span>
          </div>
          <div className="flex items-center justify-end font-medium text-base-content/70 text-xs">
            <span>默认</span>
          </div>
        </div>
      </div>

      {/* 左侧 - 输入 (1个) */}
      <Handle
        type="target"
        position={Position.Left}
        className="-left-2! h-3.5! w-3.5! border-2! border-warning! bg-base-100! transition-all hover:scale-125"
      />

      {/* 右侧 - 输出 (3个) */}
      {/* 分支 1 */}
      <Handle
        type="source"
        position={Position.Right}
        id="case-1"
        className="-right-2! top-[70px]! h-3.5! w-3.5! border-2! border-warning! bg-base-100! transition-all hover:scale-125"
      />
      {/* 分支 2 */}
      <Handle
        type="source"
        position={Position.Right}
        id="case-2"
        className="-right-2! top-[110px]! h-3.5! w-3.5! border-2! border-warning! bg-base-100! transition-all hover:scale-125"
      />
      {/* 默认分支 */}
      <Handle
        type="source"
        position={Position.Right}
        id="default"
        className="-right-2! top-[150px]! h-3.5! w-3.5! border-2! border-warning! bg-base-100! transition-all hover:scale-125"
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
            'flex h-6 w-6 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content/60 shadow-sm transition-all hover:scale-110 hover:border-warning hover:bg-warning hover:text-warning-content',
            showBranchSelector && 'scale-110 border-warning bg-warning text-warning-content'
          )}
          title={data.addNodeTooltip || 'Add Next Node'}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>

        {/* 分支选择菜单 */}
        {showBranchSelector && (
          <div className="fade-in zoom-in-95 absolute right-0 bottom-full mb-2 w-32 animate-in overflow-hidden rounded-lg border border-base-200 bg-base-100 shadow-xl duration-200">
            <div className="p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddClick('case-1')
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-blue-300"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-warning " />
                分支 1
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddClick('case-2')
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-blue-300"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-warning" />
                分支 2
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddClick('default')
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-blue-300"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-base-content/30 " />
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
          className="flex h-6 w-6 items-center justify-center rounded-full border border-base-200 bg-base-100 text-base-content/40 shadow-sm transition-all hover:scale-110 hover:border-error hover:bg-error hover:text-error-content"
          title={data.deleteNodeTooltip || 'Delete Node'}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export default memo(SwitchNode)
