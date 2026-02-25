/*
 * @Date: 2025-12-18
 * @Description: 触发类型选择抽屉
 */
import { Clock, Mail, Mouse, Webhook, X } from 'lucide-react'

interface TriggerType {
  id: string
  name: string
  description: string
  icon: React.ElementType
}

const TRIGGER_TYPES: TriggerType[] = [
  {
    id: 'manual',
    name: '手动触发',
    description: '手动启动工作流',
    icon: Mouse,
  },
  {
    id: 'schedule',
    name: '定时触发',
    description: '按照设定的时间间隔自动触发',
    icon: Clock,
  },
  {
    id: 'webhook',
    name: 'Webhook',
    description: '通过 HTTP 请求触发工作流',
    icon: Webhook,
  },
  {
    id: 'email',
    name: '邮件触发',
    description: '收到特定邮件时触发',
    icon: Mail,
  },
]

interface TriggerTypeDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSelectType: (triggerType: TriggerType) => void
}

export default function TriggerTypeDrawer({
  isOpen,
  onClose,
  onSelectType,
}: TriggerTypeDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-(--jp-mist)/50 bg-(--jp-cream) shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between border-(--jp-mist)/50 border-b px-6 py-4">
          <div>
            <h3 className="font-semibold text-(--jp-ink) text-lg">选择触发类型</h3>
            <p className="text-(--jp-ink)/60 text-sm">选择工作流的启动方式</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-(--jp-ink)/60 transition-colors hover:bg-(--jp-paper) hover:text-(--jp-ink)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 触发类型列表 */}
        <div className="max-h-[60vh] space-y-2 overflow-y-auto p-4">
          {TRIGGER_TYPES.map((triggerType) => {
            const Icon = triggerType.icon
            return (
              <button
                key={triggerType.id}
                onClick={() => {
                  onSelectType(triggerType)
                  onClose()
                }}
                className="flex w-full items-start gap-3 rounded-lg border border-(--jp-mist)/50 bg-(--jp-cream) p-4 text-left transition-all hover:border-(--jp-vermilion)/50 hover:bg-(--jp-vermilion)/5 hover:shadow-md"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-(--jp-vermilion)/10">
                  <Icon className="h-5 w-5 text-(--jp-vermilion)" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 font-medium text-(--jp-ink)">{triggerType.name}</div>
                  <div className="text-(--jp-ink)/60 text-sm">{triggerType.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
