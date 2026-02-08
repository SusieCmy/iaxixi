/*
 * @Date: 2025-02-08
 * @Description: 扣子对话 Hook
 */

import { useCallback, useRef, useState } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  isThinking?: boolean
}

export function useCozeChat(botId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const conversationIdRef = useRef<string | undefined>(undefined)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        isStreaming: true,
        isThinking: true,
      }

      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setIsLoading(true)

      abortRef.current = new AbortController()

      try {
        const res = await fetch('/api/coze/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bot_id: botId,
            message: content.trim(),
            conversation_id: conversationIdRef.current,
          }),
          signal: abortRef.current.signal,
        })

        if (!res.ok) throw new Error('请求失败')

        const reader = res.body?.getReader()
        if (!reader) throw new Error('无法读取响应')

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6)
            if (raw === '[DONE]') break

            try {
              const data = JSON.parse(raw)
              if (data.type === 'delta') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsg.id
                      ? {
                          ...m,
                          content: m.content + data.content,
                          isThinking: data.content ? false : m.isThinking,
                        }
                      : m
                  )
                )
              } else if (data.type === 'chat_completed' && data.conversation_id) {
                conversationIdRef.current = data.conversation_id
              } else if (data.type === 'error') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsg.id
                      ? { ...m, content: data.content, isStreaming: false }
                      : m
                  )
                )
              }
            } catch {
              // skip invalid JSON
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsg.id ? { ...m, isStreaming: false } : m))
        )
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: '对话出错，请重试', isStreaming: false }
                : m
            )
          )
        }
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [botId, isLoading]
  )

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
    setMessages((prev) => prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)))
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    conversationIdRef.current = undefined
  }, [])

  return { messages, isLoading, sendMessage, stopGeneration, clearMessages }
}
