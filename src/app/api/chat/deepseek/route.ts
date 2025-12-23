/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-12-23
 * @Description: DeepSeek API 路由 - 流式响应
 */

import { type NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// 初始化 OpenAI 客户端（DeepSeek 兼容 OpenAI SDK）
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
})

export const runtime = 'edge'

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface RequestBody {
  messages: Message[]
  model?: string
  temperature?: number
  max_tokens?: number
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json()
    const { messages, model = 'deepseek-chat', temperature = 0.7, max_tokens = 2000 } = body

    // 验证消息格式
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: '消息不能为空' }, { status: 400 })
    }

    // 调用 DeepSeek API（流式响应）
    const stream = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens,
      stream: true,
    })

    // 创建 SSE 流式响应
    const encoder = new TextEncoder()
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              const data = JSON.stringify(chunk)
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }
          // 发送结束标记
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('DeepSeek API 错误:', error)
          controller.error(error)
        }
      },
    })

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('API 路由错误:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    )
  }
}
