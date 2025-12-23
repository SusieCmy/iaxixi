/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-12-05
 * @Description: AI 对话相关的 API 请求函数
 */

import type { Message } from '@/types/chat'

export interface SendMessageParams {
  messages: Message[]
  model?: string
  temperature?: number
  max_tokens?: number
}

export interface StreamChunk {
  content: string
  done: boolean
}

/**
 * 发送消息到 DeepSeek API（流式响应）
 */
export async function* sendChatMessage(params: SendMessageParams): AsyncGenerator<StreamChunk> {
  const { messages, model = 'deepseek-chat', temperature = 0.7, max_tokens = 2000 } = params

  const response = await fetch('/api/chat/deepseek', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      model,
      temperature,
      max_tokens,
    }),
  })

  if (!response.ok) {
    throw new Error(`API 错误: ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('无法获取响应流')
  }

  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        yield { content: '', done: true }
        break
      }

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter((line) => line.trim() !== '')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            yield { content: '', done: true }
            continue
          }

          try {
            const json = JSON.parse(data)
            const content = json.choices?.[0]?.delta?.content

            if (content) {
              yield { content, done: false }
            }
          } catch (e) {
            console.error('解析 SSE 数据错误:', e)
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
