/*
 * @Date: 2025-12-23
 * @Description: 工作流执行日志面板 - 右侧滑入式面板
 */

import { CheckCircle, Loader2, Play, X, XCircle } from 'lucide-react'
import { memo } from 'react'

export interface ExecutionLog {
  id: string
  timestamp: Date
  nodeId: string
  nodeName: string
  status: 'running' | 'success' | 'error'
  message?: string
}

interface ExecutionLogPanelProps {
  isOpen: boolean
  onClose: () => void
  logs: ExecutionLog[]
  isRunning: boolean
}

function ExecutionLogPanel({ isOpen, onClose, logs, isRunning }: ExecutionLogPanelProps) {
  if (!isOpen) return null

  const statusConfig = {
    running: {
      icon: Loader2,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      label: '运行中',
    },
    success: {
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20',
      label: '成功',
    },
    error: {
      icon: XCircle,
      color: 'text-error',
      bg: 'bg-error/10',
      border: 'border-error/20',
      label: '失败',
    },
  }

  return (
    <div className="fixed top-0 right-0 z-50 flex h-full w-80 flex-col border-base-300 border-l bg-base-100 shadow-2xl">
      {/* 头部 */}
      <div className="flex items-center justify-between border-base-300 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-base-content">执行日志</h3>
          {isRunning && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">
              <Loader2 className="h-3 w-3 animate-spin" />
              运行中
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-base-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 日志列表 */}
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {logs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-base-content/50">
            <Play className="mb-2 h-8 w-8" />
            <p className="text-sm">暂无执行日志</p>
          </div>
        ) : (
          logs.map((log) => {
            const config = statusConfig[log.status]
            const Icon = config.icon

            return (
              <div
                key={log.id}
                className={`rounded-lg border ${config.border} ${config.bg} p-3 transition-all`}
              >
                <div className="flex items-start gap-2">
                  <Icon
                    className={`mt-0.5 h-4 w-4 ${config.color} ${log.status === 'running' ? 'animate-spin' : ''
                      }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium text-base-content text-sm">
                        {log.nodeName}
                      </span>
                      <span className={`text-xs ${config.color}`}>{config.label}</span>
                    </div>
                    {log.message && (
                      <p className="mt-1 text-base-content/60 text-xs">{log.message}</p>
                    )}
                    <p className="mt-1 text-base-content/40 text-xs">
                      {log.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 底部统计 */}
      {logs.length > 0 && (
        <div className="flex items-center justify-between border-base-300 border-t px-4 py-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-success">
              ✓ {logs.filter((l) => l.status === 'success').length}
            </span>
            <span className="text-error">✕ {logs.filter((l) => l.status === 'error').length}</span>
          </div>
          <span className="text-base-content/50">共 {logs.length} 条</span>
        </div>
      )}
    </div>
  )
}

export default memo(ExecutionLogPanel)
