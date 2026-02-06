/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-12-05
 * @Description: 消息输入框组件
 */

import { Loader2, Send } from 'lucide-react'
import type React from 'react'
import { forwardRef } from 'react'
import { Button } from '@/components/ui/button'

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  disabled: boolean
  isLoading: boolean
}

export const MessageInput = forwardRef<HTMLTextAreaElement, MessageInputProps>(
  ({ value, onChange, onSend, onKeyDown, disabled, isLoading }, ref) => {
    return (
      <div className="safe-bottom flex-none border-[var(--jp-mist)] border-t bg-[var(--jp-cream)]">
        <div className="mx-auto max-w-screen-2xl px-3 py-3 sm:px-4 sm:py-4 md:px-6">
          <div className="flex gap-2 rounded-xl border-2 border-[var(--jp-mist)] bg-[var(--jp-paper)] p-2 transition-colors duration-200 focus-within:border-[var(--jp-vermilion)] sm:gap-3 sm:p-3">
            <textarea
              ref={ref}
              name="message"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="输入消息..."
              className="max-h-32 min-h-[2.5rem] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-[var(--jp-ink)] text-xs outline-none placeholder:text-[var(--jp-ash)] focus:outline-none sm:min-h-[3rem] sm:text-sm md:text-base"
              rows={1}
              disabled={disabled}
              autoComplete="off"
            />
            <Button
              onClick={onSend}
              disabled={!value.trim() || isLoading}
              className="h-10 min-h-[2.5rem] self-end sm:h-12 sm:min-h-[3rem]"
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
              ) : (
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }
)

MessageInput.displayName = 'MessageInput'
