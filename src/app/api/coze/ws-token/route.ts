/*
 * @Date: 2026-02-28
 * @Description: 下发 Coze WS 鉴权 token，避免前端直接暴露 PAT
 */
import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.COZE_PAT
  if (!token) {
    return NextResponse.json({ error: 'COZE_PAT not configured' }, { status: 500 })
  }
  // 只返回 token，不返回其他敏感信息
  // 生产环境建议换成 OAuth JWT，这里用 PAT 做演示
  return NextResponse.json({ token })
}
