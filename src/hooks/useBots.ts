/*
 * @Date: 2025-02-08
 * @Description: 扣子智能体列表 Hook
 */

import { useQuery } from '@tanstack/react-query'

export interface BotInfo {
  id: string
  name: string
  icon_url: string
  description: string
  is_published: boolean
  published_at?: number
  updated_at: number
  owner_user_id: string
}

interface BotsResponse {
  total: number
  items: BotInfo[]
}

async function fetchBots(pageNum = 1, pageSize = 20): Promise<BotsResponse> {
  const res = await fetch(`/api/coze/bots?page_num=${pageNum}&page_size=${pageSize}`)
  if (!res.ok) {
    throw new Error('获取智能体列表失败')
  }
  return res.json()
}

export function useBots(pageNum = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['bots', pageNum, pageSize],
    queryFn: () => fetchBots(pageNum, pageSize),
    staleTime: 1000 * 60 * 5,
  })
}
