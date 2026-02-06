/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-12-05
 * @Description: 空状态组件
 */

import { Sparkles } from 'lucide-react'
import { QUICK_PROMPTS } from '@/components/chat/constants'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onSelectPrompt: (text: string) => void
}

export function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center px-4 text-center sm:min-h-[500px]">
      <div className="relative mb-6 sm:mb-8">
        <div className="absolute inset-0 animate-pulse rounded-full bg-[var(--jp-vermilion)]/20 blur-2xl" />
        <div className="relative rounded-3xl border border-[var(--jp-mist)] bg-[var(--jp-cream)] p-4 shadow-xl sm:p-6">
          <div className="rounded-2xl bg-[var(--jp-vermilion)]/10 p-3 sm:p-4">
            <Sparkles
              className="h-8 w-8 text-[var(--jp-vermilion)] sm:h-10 sm:w-10"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>

      <h2 className="mb-3 font-bold text-[var(--jp-ink)] text-xl sm:text-2xl md:text-3xl">
        开始新对话
      </h2>
      <p className="mx-auto mb-8 max-w-md text-[var(--jp-ink)]/60 text-sm sm:text-base">
        探索 AI 的无限可能，从以下话题开始，或输入您感兴趣的任何内容
      </p>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {QUICK_PROMPTS.map((item) => (
          <Button
            key={item.text}
            variant="outline"
            onClick={() => onSelectPrompt(item.text)}
            className="group h-auto justify-start gap-3 p-4 hover:border-[var(--jp-vermilion)]/50 hover:shadow-md"
          >
            <div
              className={`rounded-lg bg-[var(--jp-paper)] p-2 transition-colors group-hover:bg-[var(--jp-vermilion)]/10 ${item.color}`}
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="font-medium text-[var(--jp-ink)] text-xs transition-colors group-hover:text-[var(--jp-vermilion)] sm:text-sm">
              {item.text}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}
