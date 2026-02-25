/*
 * @Date: 2025-02-25
 * @Description: 新闻列表 Hook
 */

import { useQuery } from '@tanstack/react-query'

async function fetchNews(id = 'zaobao') {
  const res = await fetch(`/api/news?id=${id}`)
  if (!res.ok) {
    throw new Error('获取新闻列表失败')
  }
  return res.json()
}

export function useNews(id = 'zaobao') {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => fetchNews(id),
    staleTime: 1000 * 60 * 5,
  })
}
