/*
 * @Date: 2025-02-08
 * @Description: 扣子对话 API 路由 (流式)
 */

import { ChatEventType, CozeAPI, RoleType } from '@coze/api'

const coze = new CozeAPI({
  token: process.env.COZE_PAT || '',
  baseURL: 'https://api.coze.cn',
  allowPersonalAccessTokenInBrowser: false,
})

export async function POST(request: Request) {
  try {
    const { bot_id, message, conversation_id } = await request.json()

    if (!bot_id || !message) {
      return new Response(JSON.stringify({ error: '缺少必要参数' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const stream = await coze.chat.stream({
      bot_id,
      user_id: 'web_user',
      conversation_id,
      auto_save_history: true,
      additional_messages: [
        {
          role: RoleType.User,
          content: message,
          content_type: 'text',
        },
      ],
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: 'delta', content: event.data.content })}\n\n`
                )
              )
            } else if (event.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED) {
              if (event.data.type === 'answer') {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: 'completed', content: event.data.content })}\n\n`
                  )
                )
              }
            } else if (event.event === ChatEventType.CONVERSATION_CHAT_COMPLETED) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: 'chat_completed', conversation_id: event.data.conversation_id })}\n\n`
                )
              )
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : '对话失败'
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'error', content: errMsg })}\n\n`)
          )
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Coze Chat API 错误:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : '对话失败' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
