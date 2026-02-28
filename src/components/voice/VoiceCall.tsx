/*
 * @Date: 2026-02-28
 * @Description: Coze WebSocket 实时语音通话组件（基于 @coze/api/ws-tools）
 * 使用方式：<VoiceCall botId="your_bot_id" />
 */
'use client'

import type { WsChatClient } from '@coze/api/ws-tools'
import { useQuery } from '@tanstack/react-query'
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LiveWaveform } from '@/components/ui/live-waveform'
import { MarkdownContent } from '@/components/ui/MarkdownContent'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type CallStatus = 'idle' | 'connecting' | 'connected' | 'speaking' | 'listening' | 'error'

interface Voice {
  voice_id: string
  name: string
  language?: string
}

interface Props {
  botId: string
  className?: string
}

export function VoiceCall({ botId, className }: Props) {
  const [status, setStatus] = useState<CallStatus>('idle')
  const [transcript, setTranscript] = useState('')
  const [reply, setReply] = useState('')
  const [error, setError] = useState('')
  const [muted, setMuted] = useState(false)
  const [colors, setColors] = useState({ vermilion: '#9b8bb4', indigo: '#8a9eaa', ash: '#a0a0a0' })
  const [selectedVoiceId, setSelectedVoiceId] = useState('__default__')
  const clientRef = useRef<WsChatClient | null>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null)

  // 获取音色列表
  const { data: voiceData } = useQuery({
    queryKey: ['voice-list'],
    queryFn: () =>
      fetch('/api/coze/voice-list').then((r) => r.json()) as Promise<{ voices: Voice[] }>,
    staleTime: 1000 * 60 * 10,
  })
  const voices = voiceData?.voices ?? []

  // 挂载后读取 CSS 变量真实颜色值（canvas 不认 CSS 变量）
  useEffect(() => {
    const style = getComputedStyle(document.documentElement)
    const vermilion = style.getPropertyValue('--jp-vermilion').trim()
    const indigo = style.getPropertyValue('--jp-indigo').trim()
    const ash = style.getPropertyValue('--jp-ash').trim()
    if (vermilion) setColors({ vermilion, indigo: indigo || '#8a9eaa', ash: ash || '#a0a0a0' })
  }, [])

  // 开始通话
  const startCall = useCallback(async () => {
    setError('')
    setStatus('connecting')
    try {
      // 动态导入，避免 SSR 时 self is not defined
      const { WsChatClient, WsChatEventNames } = await import('@coze/api/ws-tools')

      // 从后端获取 token，避免前端暴露 PAT
      const tokenRes = await fetch('/api/coze/ws-token')
      if (!tokenRes.ok) throw new Error('获取鉴权 token 失败')
      const { token } = await tokenRes.json()

      const client = new WsChatClient({
        token,
        botId,
        voiceId: selectedVoiceId === '__default__' ? undefined : selectedVoiceId,
        allowPersonalAccessTokenInBrowser: true,
        audioCaptureConfig: { echoCancellation: true, noiseSuppression: true },
      })
      clientRef.current = client

      // 连接状态
      client.on(WsChatEventNames.CONNECTED, () => setStatus('listening'))
      client.on(WsChatEventNames.DISCONNECTED, () => setStatus('idle'))
      client.on(WsChatEventNames.ERROR, (_, data) => {
        setError(String(data ?? '通话出错'))
        setStatus('error')
      })

      // 静音状态同步
      client.on(WsChatEventNames.AUDIO_MUTED, () => setMuted(true))
      client.on(WsChatEventNames.AUDIO_UNMUTED, () => setMuted(false))

      // 用户说话检测
      client.on(WsChatEventNames.INPUT_AUDIO_BUFFER_SPEECH_STARTED, () => setStatus('listening'))
      client.on(WsChatEventNames.INPUT_AUDIO_BUFFER_SPEECH_STOPPED, () => setStatus('connected'))

      // AI 文字回复（流式）
      client.on(WsChatEventNames.CONVERSATION_MESSAGE_DELTA, (_, data) => {
        const content = (data as { data?: { content?: string; role?: string } })?.data
        if (content?.content && content.role === 'assistant') {
          setReply((prev) => prev + content.content)
        }
      })
      client.on(WsChatEventNames.CONVERSATION_MESSAGE_COMPLETED, () => {
        setReply((prev) => (prev ? `${prev}\n` : prev))
      })

      // 用户语音识别字幕
      client.on(WsChatEventNames.CONVERSATION_AUDIO_TRANSCRIPT_UPDATE, (_, data) => {
        const content = (data as { data?: { content?: string } })?.data?.content
        if (content) setTranscript(content)
      })
      client.on(WsChatEventNames.CONVERSATION_AUDIO_TRANSCRIPT_COMPLETED, (_, data) => {
        const content = (data as { data?: { content?: string } })?.data?.content
        if (content) setTranscript(content)
      })

      // AI 语音播放状态
      client.on(WsChatEventNames.AUDIO_SENTENCE_PLAYBACK_START, () => setStatus('speaking'))
      client.on(WsChatEventNames.AUDIO_SENTENCE_PLAYBACK_ENDED, () => setStatus('listening'))

      await client.connect()
    } catch (err) {
      setError(err instanceof Error ? err.message : '通话启动失败')
      setStatus('error')
    }
  }, [botId, selectedVoiceId])

  // 结束通话
  const endCall = useCallback(async () => {
    await clientRef.current?.disconnect()
    clientRef.current = null
    setStatus('idle')
    setMuted(false)
    setError('')
    // 延迟清空字幕，避免退场动画期间布局跳动闪烁
    setTimeout(() => {
      setTranscript('')
      setReply('')
    }, 300)
  }, [])

  // 静音切换
  const toggleMute = useCallback(async () => {
    if (!clientRef.current) return
    const nextMuted = !muted
    try {
      await clientRef.current.setAudioEnable(!nextMuted)
      setMuted(nextMuted)
    } catch (e) {
      console.error('[VoiceCall] setAudioEnable error', e)
    }
  }, [muted])

  // 组件卸载时清理
  useEffect(
    () => () => {
      clientRef.current?.disconnect()
    },
    []
  )

  // 字幕内容更新时自动滚到底部
  useEffect(() => {
    const el = transcriptRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  const isActive = status !== 'idle' && status !== 'error'

  return (
    <motion.div
      drag
      dragMomentum={false}
      className={`flex w-64 flex-col gap-2 ${isActive ? 'items-center' : ''} ${className ?? ''}`}
      style={{ cursor: 'grab' }}
      whileDrag={{ cursor: 'grabbing' }}
      onPointerDown={(e) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY }
        isDragging.current = false
      }}
      onPointerMove={(e) => {
        if (!pointerDownPos.current) return
        const dx = Math.abs(e.clientX - pointerDownPos.current.x)
        const dy = Math.abs(e.clientY - pointerDownPos.current.y)
        if (dx > 4 || dy > 4) isDragging.current = true
      }}
      onPointerUp={() => {
        setTimeout(() => {
          isDragging.current = false
          pointerDownPos.current = null
        }, 50)
      }}
    >
      {/* 实时字幕 */}
      {(transcript || reply) && (
        <div
          ref={transcriptRef}
          className="max-h-40 w-full overflow-y-auto rounded-lg border border-(--jp-mist) bg-(--jp-cream) p-3"
        >
          {reply && (
            <div className="font-(family-name:--font-jp-sans) mt-1 text-(--jp-ink) text-xs">
              <span className="text-(--jp-ash)">AI：</span>
              <MarkdownContent>{reply}</MarkdownContent>
            </div>
          )}
          {transcript && (
            <p className="font-(family-name:--font-jp-sans) text-(--jp-stone) text-xs">
              你：{transcript}
            </p>
          )}
        </div>
      )}

      {/* 错误提示 */}
      {status === 'error' && error && (
        <p className="font-(family-name:--font-jp-sans) text-red-500 text-xs">{error}</p>
      )}

      {/* 声纹波形 + 状态文字 */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="flex w-full flex-col items-center gap-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LiveWaveform
              active={false}
              processing={
                (status === 'listening' && !muted) ||
                status === 'speaking' ||
                status === 'connected'
              }
              mode="static"
              height={48}
              barColor={
                status === 'listening'
                  ? colors.vermilion
                  : status === 'speaking'
                    ? colors.indigo
                    : colors.ash
              }
              sensitivity={1.5}
              className="w-full"
            />
            <span className="font-(family-name:--font-jp-sans) text-(--jp-ash) text-xs">
              {status === 'connecting' && '连接中...'}
              {status === 'connected' && 'AI 思考中'}
              {status === 'listening' && '聆听中'}
              {status === 'speaking' && 'AI 回复中'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 音色选择 + 通话按钮 */}
      <div className="flex gap-2">
        <AnimatePresence mode="wait">
          {!isActive ? (
            <motion.div
              key="start"
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                type="button"
                onClick={() => {
                  if (!isDragging.current) startCall()
                }}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-(--jp-vermilion) text-white shadow-md"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="flex items-center justify-center"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                >
                  <Phone className="h-6 w-6" />
                </motion.span>
              </motion.button>
              {voices.length > 0 && (
                <Select value={selectedVoiceId} onValueChange={setSelectedVoiceId}>
                  <SelectTrigger className="font-(family-name:--font-jp-sans) h-8 flex-1 border-(--jp-mist) bg-(--jp-cream) text-(--jp-ink) text-xs focus:ring-(--jp-vermilion)">
                    <SelectValue placeholder="默认音色" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 border-(--jp-mist) bg-(--jp-cream) text-(--jp-ink) **:data-highlighted:bg-(--jp-mist) **:data-highlighted:text-(--jp-ink)">
                    <SelectItem value="__default__">默认音色</SelectItem>
                    {voices.map((v) => (
                      <SelectItem key={v.voice_id} value={v.voice_id}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="active"
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                onClick={toggleMute}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-(--jp-mist) bg-(--jp-cream) text-(--jp-stone) transition-colors hover:border-(--jp-stone)"
              >
                {muted ? (
                  <MicOff className="h-4 w-4 text-(--jp-ash)" />
                ) : (
                  <Mic className="h-4 w-4 text-(--jp-vermilion)" />
                )}
              </button>
              <button
                type="button"
                onClick={endCall}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
