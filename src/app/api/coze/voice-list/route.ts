import { CozeAPI } from '@coze/api'
import { NextResponse } from 'next/server'

const client = new CozeAPI({
  token: process.env.COZE_PAT || '',
  baseURL: 'https://api.coze.cn',
})

export async function GET() {
  try {
    const res = await client.audio.voices.list({
      model_type: 'small',
    })
    return NextResponse.json({ voices: res.voice_list ?? [] })
  } catch (err) {
    console.error('[voice-list]', err)
    return NextResponse.json({ error: '获取音色列表失败' }, { status: 500 })
  }
}
