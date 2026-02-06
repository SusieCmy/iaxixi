/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-12-05
 * @Description: AI 对话页面 - 重构优化版本
 */
'use client'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { EmptyState } from '@/components/chat/EmptyState'
import { MessageInput } from '@/components/chat/MessageInput'
import { MessageItem } from '@/components/chat/MessageItem'
import { useSendMessage } from '@/hooks/use-chat'
import { useChatStore } from '@/store/chat-store'
import type { Message } from '@/types/chat'

export default function DialoguePage() {
  const { messages, addMessage, updateMessage, clearMessages } = useChatStore()
  const [input, setInput] = useState('')
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const currentAssistantMessageIdRef = useRef<string>('')

  // 使用 React Query mutation 发送消息
  const sendMessageMutation = useSendMessage({
    onStreamStart: (messageId) => setStreamingMessageId(messageId),
    onStreamContent: (messageId, content) => updateMessage(messageId, content),
    onStreamEnd: (messageId) => {
      setStreamingMessageId(null)
      console.log('消息接收完成:', messageId)
    },
    onError: (error) => {
      setStreamingMessageId(null)
      // 更新已存在的 assistant 消息为错误内容，而不是新增消息
      if (currentAssistantMessageIdRef.current) {
        updateMessage(
          currentAssistantMessageIdRef.current,
          `❌ 错误: ${error.message || '发送失败，请重试'}`
        )
      }
    },
  })

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: messages dependency is intentional for scroll on new messages
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // 发送消息
  const handleSend = useCallback(async () => {
    if (!input.trim() || sendMessageMutation.isPending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    // 保存 assistantMessageId 供 onError 使用
    currentAssistantMessageIdRef.current = assistantMessage.id

    addMessage(userMessage)
    addMessage(assistantMessage)
    setInput('')

    sendMessageMutation.mutate({
      messages: [...messages, userMessage],
      assistantMessageId: assistantMessage.id,
    })
  }, [input, sendMessageMutation, messages, addMessage])

  // 重新生成消息
  const handleRegenerate = useCallback(
    (messageIndex: number) => {
      if (sendMessageMutation.isPending) return

      const messagesToKeep = messages.slice(0, messageIndex)
      const newAssistantMessage: Message = {
        id: `regenerate-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      }

      // 保存 assistantMessageId 供 onError 使用
      currentAssistantMessageIdRef.current = newAssistantMessage.id

      clearMessages()
      messagesToKeep.forEach((msg) => addMessage(msg))
      addMessage(newAssistantMessage)

      sendMessageMutation.mutate({
        messages: messagesToKeep,
        assistantMessageId: newAssistantMessage.id,
      })
    },
    [sendMessageMutation, messages, clearMessages, addMessage]
  )

  // 回车发送
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  // 清空对话
  const handleClear = useCallback(() => {
    clearMessages()
    inputRef.current?.focus()
  }, [clearMessages])

  return (
    <div className="flex h-screen flex-col bg-[var(--jp-cream)]">
      <ChatHeader hasMessages={messages.length > 0} onClear={handleClear} />

      {/* 聊天区域 */}
      <div className="scrollbar-thin flex-1 overflow-y-auto">
        <div className="mx-auto max-w-screen-2xl px-3 py-4 sm:px-4 sm:py-6 md:px-6">
          {messages.length === 0 ? (
            <EmptyState onSelectPrompt={setInput} />
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {messages.map((message, index) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isLoading={sendMessageMutation.isPending && index === messages.length - 1}
                  isStreaming={message.id === streamingMessageId}
                  onRegenerate={
                    message.role === 'assistant' &&
                    index === messages.length - 1 &&
                    !sendMessageMutation.isPending &&
                    message.content
                      ? () => handleRegenerate(index)
                      : undefined
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <MessageInput
        ref={inputRef}
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
        disabled={sendMessageMutation.isPending}
        isLoading={sendMessageMutation.isPending}
      />
    </div>
  )
}
