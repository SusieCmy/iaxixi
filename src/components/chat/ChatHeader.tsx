/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-12-05
 * @Description: 对话页面头部组件
 */

import { Sparkles, Trash2 } from 'lucide-react'

interface ChatHeaderProps {
  hasMessages: boolean
  onClear: () => void
}

export function ChatHeader({ hasMessages, onClear }: ChatHeaderProps) {
  return (
    <div className="flex-none border-base-300 border-b bg-base-100">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-3 py-3 sm:px-4 sm:py-4 md:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-lg bg-primary p-2">
            <Sparkles className="h-4 w-4 text-primary-content sm:h-5 sm:w-5" strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-bold text-base text-base-content sm:text-lg md:text-xl">AI 助手</h1>
            <p className="text-[10px] text-base-content/60 sm:text-xs">DeepSeek AI</p>
          </div>
        </div>
        {hasMessages && (
          <button
            onClick={onClear}
            className="cmy-btn cmy-btn-ghost cmy-btn-sm gap-1 text-xs sm:gap-2 sm:text-sm"
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">清空</span>
          </button>
        )}
      </div>
    </div>
  )
}
