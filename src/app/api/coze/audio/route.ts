/*
 * @Date: 2025-02-08
 * @Description: 扣子语音转文字 API 路由
 */

import axios from 'axios'
import FormData from 'form-data'
import { Readable } from 'stream'

export async function POST(request: Request) {
  try {
    const reqFormData = await request.formData()
    const file = reqFormData.get('file')

    if (!file || !(file instanceof Blob)) {
      return new Response(JSON.stringify({ error: '缺少音频文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const stream = Readable.from(buffer)

    const form = new FormData()
    form.append('file', stream, {
      filename: 'audio.ogg',
      contentType: file.type || 'audio/ogg',
    })

    const res = await axios.post('https://api.coze.cn/v1/audio/transcriptions', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${process.env.COZE_PAT}`,
      },
    })
    console.log('Coze Audio API 响应:', res.data)
    return new Response(JSON.stringify({ text: res.data?.data?.text }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Coze Audio API 错误:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : '语音识别失败',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
