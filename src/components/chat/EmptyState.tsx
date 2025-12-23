/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-12-05
 * @Description: 空状态组件
 */

import { Sparkles } from 'lucide-react'
import { QUICK_PROMPTS } from '@/components/chat/constants'

interface EmptyStateProps {
  onSelectPrompt: (text: string) => void
}

export function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center px-4 text-center sm:min-h-[500px]">
      <div className="relative mb-6 sm:mb-8">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-2xl" />
        <div className="relative rounded-3xl border border-base-200 bg-base-100 p-4 shadow-xl sm:p-6">
          <div className="rounded-2xl bg-primary/10 p-3 sm:p-4">
            <Sparkles className="h-8 w-8 text-primary sm:h-10 sm:w-10" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <h2 className="mb-3 font-bold text-base-content text-xl sm:text-2xl md:text-3xl">
        开始新对话
      </h2>
      <p className="mx-auto mb-8 max-w-md text-base-content/60 text-sm sm:text-base">
        探索 AI 的无限可能，从以下话题开始，或输入您感兴趣的任何内容
      </p>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {QUICK_PROMPTS.map((item) => (
          <button
            key={item.text}
            onClick={() => onSelectPrompt(item.text)}
            className="group flex items-center gap-3 rounded-xl border border-base-200 bg-base-100 p-4 text-left transition-all duration-200 hover:border-primary/50 hover:shadow-md"
          >
            <div
              className={`rounded-lg bg-base-200 p-2 transition-colors group-hover:bg-primary/10 ${item.color}`}
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="font-medium text-base-content text-xs transition-colors group-hover:text-primary sm:text-sm">
              {item.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
