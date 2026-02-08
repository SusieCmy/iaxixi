/*
 * @Date: 2025-02-08
 * @Description: 右下角弹窗聊天组件
 */
'use client'

import { useMutation } from '@tanstack/react-query'
import { Keyboard, Mic, Minus, Send, Sparkles, Square, Trash2, User, X } from 'lucide-react'
import Image from 'next/image'
import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { type ChatMessage, useCozeChat } from '@/hooks/useCozeChat'
import useChatStore from '@/store/useChatStore'

function MessageBubble({ message, botIcon }: { message: ChatMessage; botIcon?: string }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {isUser ? (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--jp-vermilion)] text-white">
          <User className="h-3.5 w-3.5" />
        </div>
      ) : botIcon ? (
        <Image
          src={botIcon}
          alt="bot"
          width={28}
          height={28}
          className="h-7 w-7 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--jp-paper)] text-[var(--jp-vermilion)]">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? 'bg-[var(--jp-vermilion)] text-white'
            : 'bg-[var(--jp-paper)] text-[var(--jp-ink)]'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">
          {message.isThinking ? (
            <span className="inline-flex items-center gap-1 text-[var(--jp-ash)]">
              <span className="animate-pulse">检索中</span>
              <span className="inline-flex gap-0.5">
                <span className="h-1 w-1 animate-bounce rounded-full bg-[var(--jp-ash)] [animation-delay:0ms]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-[var(--jp-ash)] [animation-delay:150ms]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-[var(--jp-ash)] [animation-delay:300ms]" />
              </span>
            </span>
          ) : (
            <>
              {message.content}
              {message.isStreaming && (
                <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-current align-middle" />
              )}
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default function ChatPopup() {
  const { isOpen, botId, botName, botIcon, botDescription, closeChat } = useChatStore()
  const [input, setInput] = useState('')
  const [minimized, setMinimized] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const { messages, isLoading, sendMessage, stopGeneration, clearMessages } = useCozeChat(botId)

  const transcribeMutation = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      const formData = new FormData()
      const ext = audioBlob.type.includes('ogg') ? 'ogg' : 'webm'
      formData.append('file', audioBlob, `audio.${ext}`)
      const res = await fetch('/api/coze/audio', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('语音识别失败')
      const { text } = await res.json()
      return text as string
    },
    onSuccess: (text) => {
      if (text?.trim()) sendMessage(text.trim())
    },
  })

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return
      sendMessage(input)
      setInput('')
    },
    [input, isLoading, sendMessage]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e)
      }
    },
    [handleSubmit]
  )

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/ogg; codecs=opus')
        ? 'audio/ogg; codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm; codecs=opus')
          ? 'audio/webm; codecs=opus'
          : 'audio/webm'
      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch {
      console.error('无法获取麦克风权限')
    }
  }, [])

  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === 'inactive') return

    setIsRecording(false)

    const audioBlob = await new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        resolve(new Blob(chunksRef.current, { type: recorder.mimeType }))
      }
      recorder.stop()
    })

    recorder.stream.getTracks().forEach((t) => t.stop())
    mediaRecorderRef.current = null

    if (audioBlob.size === 0 || isLoading) return

    transcribeMutation.mutate(audioBlob)
  }, [isLoading, transcribeMutation])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  if (!isOpen) return null

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--jp-vermilion)] shadow-lg transition-transform hover:scale-105"
      >
        {botIcon ? (
          <Image
            src={botIcon}
            alt={botName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <Sparkles className="h-5 w-5 text-white" />
        )}
      </button>
    )
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-[var(--jp-mist)] bg-[var(--jp-cream)] shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 border-[var(--jp-mist)] border-b px-4 py-2.5">
        {botIcon && (
          <Image
            src={botIcon}
            alt={botName}
            width={24}
            height={24}
            className="h-6 w-6 rounded-full object-cover"
          />
        )}
        <span className="flex-1 truncate font-medium text-[var(--jp-ink)] text-sm">{botName}</span>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            className="h-7 w-7 p-0 text-[var(--jp-ash)] hover:text-[var(--jp-error)]"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMinimized(true)}
          className="h-7 w-7 p-0 text-[var(--jp-ash)]"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={closeChat}
          className="h-7 w-7 p-0 text-[var(--jp-ash)]"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              {botIcon ? (
                <Image
                  src={botIcon}
                  alt={botName}
                  width={40}
                  height={40}
                  className="mx-auto h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <Sparkles className="mx-auto h-10 w-10 text-[var(--jp-mist)]" />
              )}
              <p className="mt-3 text-[var(--jp-ash)] text-xs">{botDescription || '开始对话吧'}</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} botIcon={botIcon} />)
        )}
      </div>

      {/* Input */}
      <div className="border-[var(--jp-mist)] border-t px-3 py-2">
        <div className="flex items-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setVoiceMode(!voiceMode)}
            className="h-8 w-8 shrink-0 p-0 text-[var(--jp-ash)]"
          >
            {voiceMode ? <Keyboard className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {voiceMode ? (
            <button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={transcribeMutation.isPending}
              className={`flex h-8 flex-1 items-center justify-center rounded-lg border text-sm transition-colors ${
                isRecording
                  ? 'border-[var(--jp-vermilion)] bg-[var(--jp-vermilion)]/10 text-[var(--jp-vermilion)]'
                  : transcribeMutation.isPending
                    ? 'border-[var(--jp-mist)] text-[var(--jp-ash)] opacity-60'
                    : 'border-[var(--jp-mist)] text-[var(--jp-ash)]'
              }`}
            >
              {transcribeMutation.isPending ? '识别中...' : isRecording ? '松开发送' : '按住说话'}
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-1 items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入消息..."
                rows={1}
                className="max-h-20 min-h-[32px] flex-1 resize-none rounded-lg border border-[var(--jp-mist)] bg-transparent px-2.5 py-1.5 text-[var(--jp-ink)] text-sm placeholder:text-[var(--jp-ash)] focus:outline-none focus:ring-1 focus:ring-[var(--jp-vermilion)]"
              />
              {isLoading ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={stopGeneration}
                  className="h-8 w-8 shrink-0 rounded-lg bg-[var(--jp-ash)] p-0 hover:bg-[var(--jp-stone)]"
                >
                  <Square className="h-3 w-3 text-white" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim()}
                  className="h-8 w-8 shrink-0 rounded-lg bg-[var(--jp-vermilion)] p-0 hover:bg-[var(--jp-vermilion)]/90 disabled:opacity-40"
                >
                  <Send className="h-3 w-3 text-white" />
                </Button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
