/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-12-05
 * @Description: React Query Provider 配置
 */
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // 为每个客户端创建独立的 QueryClient 实例
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 默认配置
            staleTime: 60 * 1000, // 数据保持新鲜的时间：1分钟
            gcTime: 5 * 60 * 1000, // 垃圾回收时间：5分钟（原 cacheTime）
            refetchOnWindowFocus: false, // 窗口聚焦时不自动重新获取
            retry: 1, // 失败重试次数
          },
          mutations: {
            retry: 1, // Mutation 失败重试次数
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 开发环境显示 DevTools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
