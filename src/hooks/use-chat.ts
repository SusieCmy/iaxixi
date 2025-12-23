/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-12-05
 * @Description: AI 对话相关的 React Query hooks - 性能优化版本
 */

import { useMutation } from '@tanstack/react-query'
import { type SendMessageParams, sendChatMessage } from '@/lib/api/chat'

interface UseSendMessageOptions {
  onStreamStart?: (messageId: string) => void
  onStreamContent?: (messageId: string, content: string) => void
  onStreamEnd?: (messageId: string) => void
  onError?: (error: Error) => void
}

/**
 * 发送聊天消息的 Hook - 优化版本
 * 使用 requestAnimationFrame 批量更新，减少重渲染
 */
export function useSendMessage(options: UseSendMessageOptions = {}) {
  return useMutation({
    mutationFn: async (params: SendMessageParams & { assistantMessageId: string }) => {
      const { assistantMessageId, ...apiParams } = params
      let fullContent = ''
      let rafId: number | null = null
      let pendingContent = ''
      let hasUpdated = false

      options.onStreamStart?.(assistantMessageId)

      // 使用 requestAnimationFrame 批量更新
      const scheduleUpdate = () => {
        if (rafId !== null) return // 已经有待处理的更新

        rafId = requestAnimationFrame(() => {
          if (pendingContent) {
            options.onStreamContent?.(assistantMessageId, pendingContent)
            hasUpdated = true
          }
          rafId = null
        })
      }

      try {
        for await (const chunk of sendChatMessage(apiParams)) {
          if (chunk.done) {
            break
          }
          fullContent += chunk.content
          pendingContent = fullContent
          scheduleUpdate()
        }

        // 确保最后的内容被更新
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
        }
        if (pendingContent && !hasUpdated) {
          options.onStreamContent?.(assistantMessageId, pendingContent)
        }

        options.onStreamEnd?.(assistantMessageId)

        return { content: fullContent, messageId: assistantMessageId }
      } catch (error) {
        // 清理待处理的更新
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
        }
        throw error
      }
    },
    onError: (error: Error) => {
      options.onError?.(error)
    },
  })
}

/**
 * 重新生成消息的 Hook
 */
export function useRegenerateMessage(options: UseSendMessageOptions = {}) {
  return useSendMessage(options)
}
