/*
 * @Date: 2025-12-18
 * @Description: 工作流触发节点组件
 */

import { Handle, Position } from '@xyflow/react'
import { Clock, Mail, Mouse, Plus, Webhook, Zap } from 'lucide-react'
import { memo } from 'react'

interface TriggerNodeProps {
  data: {
    label?: string
    triggerType?: string
    icon?: string
    hasConnectedNode?: boolean
    onAddNode?: () => void
    defaultLabel?: string
    addNodeTooltip?: string
  }
}

// 触发类型图标映射
const TRIGGER_ICONS: Record<string, React.ElementType> = {
  manual: Mouse,
  schedule: Clock,
  webhook: Webhook,
  email: Mail,
  default: Zap,
}

function TriggerNode({ data }: TriggerNodeProps) {
  const Icon = TRIGGER_ICONS[data.triggerType || 'default'] || Zap
  const hasConnectedNode = data.hasConnectedNode || false

  return (
    <div className="group relative">
      {/* 节点主体 - 圆形设计 */}
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--jp-vermilion)] bg-gradient-to-br from-[var(--jp-vermilion)]/10 to-[var(--jp-vermilion)]/5 shadow-[var(--jp-vermilion)]/20 shadow-lg transition-all hover:scale-105 hover:border-[var(--jp-vermilion)]/80 hover:shadow-[var(--jp-vermilion)]/30 hover:shadow-xl">
        {/* 图标 */}
        <Icon className="h-8 w-8 text-[var(--jp-vermilion)]" />

        {/* 输出连接点 */}
        <Handle
          type="source"
          position={Position.Right}
          className="-right-2! h-3.5! w-3.5! border-2! border-[var(--jp-vermilion)]! bg-[var(--jp-cream)]! transition-all hover:scale-125!"
        />
      </div>

      {/* 标签提示 - 始终显示在底部 */}
      <div className="-bottom-10 -translate-x-1/2 absolute left-1/2 whitespace-nowrap rounded-lg border border-[var(--jp-mist)] bg-[var(--jp-cream)] px-3 py-1.5 font-medium text-[var(--jp-ink)] text-xs shadow-sm">
        {data.label || data.defaultLabel || 'Select Trigger'}
      </div>

      {/* 添加节点按钮 - 仅在没有连接节点时显示 */}
      {!hasConnectedNode && (
        <div className="-right-4 absolute bottom-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              data.onAddNode?.()
            }}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--jp-mist)] bg-[var(--jp-cream)] text-[var(--jp-ink)]/60 shadow-sm transition-all hover:scale-110 hover:border-[var(--jp-vermilion)] hover:bg-[var(--jp-vermilion)] hover:text-white"
            title={data.addNodeTooltip || 'Add Next Node'}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default memo(TriggerNode)
