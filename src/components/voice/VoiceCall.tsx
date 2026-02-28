/*
 * @Date: 2026-02-28
 * @Description: Coze WebSocket 实时语音通话组件（基于 @coze/api/ws-tools）
 * 使用方式：<VoiceCall botId="your_bot_id" />
 */
'use client'

import type { WsChatClient } from '@coze/api/ws-tools'
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LiveWaveform } from '@/components/ui/live-waveform'
import { MarkdownContent } from '@/components/ui/MarkdownContent'

type CallStatus = 'idle' | 'connecting' | 'connected' | 'speaking' | 'listening' | 'error'

interface Props {
  botId: string
  voiceId?: string
  className?: string
}

export function VoiceCall({ botId, voiceId, className }: Props) {
  const [status, setStatus] = useState<CallStatus>('idle')
  const [transcript, setTranscript] = useState('')
  const [reply, setReply] = useState('')
  const [error, setError] = useState('')
  const [muted, setMuted] = useState(false)
  const [colors, setColors] = useState({ vermilion: '#9b8bb4', indigo: '#8a9eaa', ash: '#a0a0a0' })
  const clientRef = useRef<WsChatClient | null>(null)

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
      // const client = {}
      const client = new WsChatClient({
        token,
        botId,
        voiceId,
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

      // AI 文字回复（流式），data 就是事件对象，data.data.content 是文字
      client.on(WsChatEventNames.CONVERSATION_MESSAGE_DELTA, (_, data) => {
        const content = (data as { data?: { content?: string; role?: string } })?.data
        // 只取 assistant 的回复，过滤掉 tool_response 等
        if (content?.content && content.role === 'assistant') {
          setReply((prev) => prev + content.content)
        }
      })
      client.on(WsChatEventNames.CONVERSATION_MESSAGE_COMPLETED, () => {
        // 每轮回复完成后加换行，保留历史
        setReply((prev) => (prev ? `${prev}\n` : prev))
      })

      // 用户语音识别字幕，累加不清空
      client.on(WsChatEventNames.CONVERSATION_AUDIO_TRANSCRIPT_UPDATE, (_, data) => {
        const content = (data as { data?: { content?: string } })?.data?.content
        if (content) setTranscript(content)
      })
      // completed 时把最终识别结果追加到历史，不清空
      client.on(WsChatEventNames.CONVERSATION_AUDIO_TRANSCRIPT_COMPLETED, (_, data) => {
        const content = (data as { data?: { content?: string } })?.data?.content
        if (content) setTranscript(content)
      })

      // AI 语音播放状态（AUDIO_DELTA 不对外 emit，用播放句子事件）
      client.on(WsChatEventNames.AUDIO_SENTENCE_PLAYBACK_START, () => setStatus('speaking'))
      client.on(WsChatEventNames.AUDIO_SENTENCE_PLAYBACK_ENDED, () => setStatus('listening'))

      await client.connect()
    } catch (err) {
      setError(err instanceof Error ? err.message : '通话启动失败')
      setStatus('error')
    }
  }, [botId, voiceId])

  // 结束通话
  const endCall = useCallback(async () => {
    await clientRef.current?.disconnect()
    clientRef.current = null
    setStatus('idle')
    setTranscript('')
    setReply('')
    setError('')
    setMuted(false)
  }, [])

  // 静音切换：enable=false 关麦，enable=true 开麦
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

  const isActive = status !== 'idle' && status !== 'error'

  return (
    <div
      className={`flex w-64 flex-col ${isActive ? 'items-center' : ''} gap-2 ${className ?? ''}`}
    >
      {/* 实时字幕 */}
      {(transcript || reply) && (
        <div className="w-full max-w-sm rounded-lg border border-(--jp-mist) bg-(--jp-cream) p-3">
          {transcript && (
            <p className="font-(family-name:--font-jp-sans) text-(--jp-stone) text-xs">
              你：{transcript}
            </p>
          )}
          {reply && (
            <div className="font-(family-name:--font-jp-sans) mt-1 text-(--jp-ink) text-xs">
              <span className="text-(--jp-ash)">AI：</span>
              <MarkdownContent>{reply}</MarkdownContent>
            </div>
          )}
        </div>
      )}
      {/* 声纹波形 + 状态文字 */}
      <div className="flex w-full max-w-sm flex-col items-center gap-0">
        {isActive && (
          <LiveWaveform
            active={false}
            processing={
              (status === 'listening' && !muted) || status === 'speaking' || status === 'connected'
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
        )}
        <span className="font-(family-name:--font-jp-sans) text-(--jp-ash) text-xs">
          {/* {status === 'idle' && '点击开始通话'} */}
          {status === 'connecting' && '连接中...'}
          {status === 'connected' && 'AI 思考中'}
          {status === 'listening' && '聆听中'}
          {status === 'speaking' && 'AI 回复中'}
          {status === 'error' && <span className="text-red-500">{error}</span>}
        </span>
      </div>

      {/* 通话按钮 */}
      <div className="flex items-center gap-3">
        <AnimatePresence mode="wait">
          {!isActive ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                type="button"
                onClick={startCall}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-(--jp-vermilion) text-white shadow-md"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="h-6 w-6" />
              </motion.button>
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
    </div>
  )
}
