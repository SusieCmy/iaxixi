/*
 * @Date: 2025-12-18
 * @Description: Toast 通知组件 - 基于 DaisyUI
 */
'use client'

import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import useToastStore from '@/store/useToastStore'

// Toast 图标映射
const toastIcons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

// Toast 自定义样式映射（优化配色）
const toastStyles = {
  success:
    'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
  error:
    'bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200',
  warning:
    'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
  info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
}

// Toast 图标颜色
const iconStyles = {
  success: 'text-emerald-600 dark:text-emerald-400',
  error: 'text-rose-600 dark:text-rose-400',
  warning: 'text-amber-600 dark:text-amber-400',
  info: 'text-blue-600 dark:text-blue-400',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="cmy-toast cmy-toast-bottom cmy-toast-end z-[9999]">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type]
        const bgClass = toastStyles[toast.type]
        const iconClass = iconStyles[toast.type]

        return (
          <div
            key={toast.id}
            className={`flex min-w-[320px] max-w-md items-center gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-sm transition-all ${bgClass}`}
            role="alert"
          >
            <Icon className={`h-5 w-5 flex-shrink-0 ${iconClass}`} />
            <span className="flex-1 font-medium text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 rounded-full p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

// 便捷的 Toast Hook
export function useToast() {
  const { addToast } = useToastStore()

  return {
    success: (message: string, duration?: number) => addToast(message, 'success', duration),
    error: (message: string, duration?: number) => addToast(message, 'error', duration),
    warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
    info: (message: string, duration?: number) => addToast(message, 'info', duration),
  }
}
