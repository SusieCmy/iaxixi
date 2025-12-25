/*
 * @Date: 2025-12-18
 * @Description: 通用工作流节点组件 - 现代化卡片设计，左进右出
 */

import { Handle, Position } from '@xyflow/react'
import { Box, MoreHorizontal, Play, Plus, Trash2 } from 'lucide-react'
import { memo } from 'react'
import { cn } from '@/utils/cn'

interface DefaultNodeProps {
  data: {
    label?: string
    description?: string
    status?: 'idle' | 'running' | 'success' | 'error'
    onAddNode?: () => void
    onDelete?: () => void
    onCopy?: () => void
    // 国际化文本（从父组件传入）
    addNodeTooltip?: string
    deleteNodeTooltip?: string
  }
  selected?: boolean
}

function DefaultNode({ data, selected }: DefaultNodeProps) {
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

        {/* 底部状态栏 */}
        {/* 底部状态栏 - 绝对定位在左下角 */}
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
        className="!h-3.5 !w-3.5 !-left-2 !border-2 !border-primary !bg-base-100 transition-all hover:scale-125"
      />

      {/* 右侧 - 输出 */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3.5 !w-3.5 !-right-2 !border-2 !border-primary !bg-base-100 transition-all hover:scale-125"
      />

      {/* 快捷添加按钮 - 悬停显示 */}
      <div className="-right-3 hover:!opacity-100 absolute bottom-0 opacity-0 transition-all duration-200 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            data.onAddNode?.()
          }}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content/60 shadow-sm hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-content"
          title={data.addNodeTooltip || 'Add Next Node'}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 删除按钮 - 悬停显示 */}
      <div className="-top-3 -right-3 hover:!opacity-100 absolute opacity-0 transition-all duration-200 group-hover:opacity-100">
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
