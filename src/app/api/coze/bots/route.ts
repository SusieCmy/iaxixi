/*
 * @Date: 2025-02-08
 * @Description: 扣子智能体列表 API 路由
 */

import { CozeAPI } from '@coze/api'
import { NextResponse } from 'next/server'

const coze = new CozeAPI({
  token: process.env.COZE_PAT || '',
  baseURL: 'https://api.coze.cn',
  allowPersonalAccessTokenInBrowser: false,
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page_num = Number(searchParams.get('page_num')) || 1
    const page_size = Number(searchParams.get('page_size')) || 20
    const workspace_id = '7485282841065095203'

    const data = await coze.bots.listNew({
      workspace_id,
      page_num,
      page_size,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Coze API 错误:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取智能体列表失败' },
      { status: 500 }
    )
  }
}
