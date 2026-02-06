/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-12-05
 * @Description: 消息项组件
 */

import { Bot, Loader2, RotateCcw, User } from 'lucide-react'
import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Message } from '@/types/chat'

interface MessageItemProps {
  message: Message
  onRegenerate?: () => void
  isLoading?: boolean
  isStreaming?: boolean
}

export const MessageItem = memo(
  ({ message, onRegenerate, isLoading, isStreaming }: MessageItemProps) => {
    const showLoading = message.role === 'assistant' && !message.content && isLoading

    return (
      <div
        className={`flex gap-2 sm:gap-3 md:gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* 头像 */}
        <div className="mt-1 flex-shrink-0">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full sm:h-9 sm:w-9 md:h-10 md:w-10 ${
              message.role === 'user' ? 'bg-[var(--jp-vermilion)]' : 'bg-[var(--jp-indigo)]'
            }`}
          >
            {message.role === 'user' ? (
              <User className="h-4 w-4 text-white sm:h-5 sm:w-5" strokeWidth={2.5} />
            ) : (
              <Bot className="h-4 w-4 text-white sm:h-5 sm:w-5" strokeWidth={2.5} />
            )}
          </div>
        </div>

        {/* 消息内容 */}
        <div
          className={`max-w-full flex-1 sm:max-w-3xl ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}
        >
          <div
            className={`mb-1 flex items-center gap-1.5 sm:mb-2 sm:gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <span className="font-semibold text-[var(--jp-ink)] text-xs sm:text-sm">
              {message.role === 'user' ? '你' : 'AI'}
            </span>
            <span className="text-[10px] text-[var(--jp-ink)]/50 sm:text-xs">
              {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div
            className={`rounded-xl px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3 md:px-5 md:py-3.5 ${
              message.role === 'user'
                ? 'rounded-tr-sm bg-[var(--jp-vermilion)] text-white'
                : 'rounded-tl-sm bg-[var(--jp-paper)] text-[var(--jp-ink)]'
            }`}
          >
            {showLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[var(--jp-vermilion)]" />
                <span className="text-[var(--jp-ink)]/60 text-xs sm:text-sm">思考中...</span>
              </div>
            ) : message.role === 'assistant' && message.content ? (
              <div className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="!my-2 sm:!my-3 rounded-lg text-xs sm:rounded-xl sm:text-sm"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="rounded bg-[var(--jp-mist)] px-1 py-0.5 text-[0.85em] text-[var(--jp-vermilion)] sm:px-1.5 sm:text-[0.9em]"
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-xs leading-relaxed sm:text-sm">
                {message.content}
              </p>
            )}
          </div>

          {/* AI 消息操作按钮 */}
          {message.role === 'assistant' && onRegenerate && message.content && !isStreaming && (
            <button
              onClick={onRegenerate}
              className="mt-2 flex items-center gap-1 text-[var(--jp-ink)]/50 text-xs transition-colors hover:text-[var(--jp-vermilion)]"
            >
              <RotateCcw className="h-3 w-3" />
              <span>重新生成</span>
            </button>
          )}
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.content === nextProps.message.content &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.isStreaming === nextProps.isStreaming
    )
  }
)

MessageItem.displayName = 'MessageItem'
