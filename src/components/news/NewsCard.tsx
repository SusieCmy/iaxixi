/*
 * @Date: 2025-01-07
 * @Description: 新闻列表卡片 - 玻璃拟态设计
 */
'use client'
import { ChevronDown, ExternalLink, Loader2, Newspaper, RefreshCcw } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import { cn } from '@/utils/cn'

interface NewsItem {
  id: string
  title: string
  url: string
  pubDate: string
}

interface NewsData {
  status: string
  id: string
  updatedTime: number
  items: NewsItem[]
}

const NEWS_SOURCES = [
  { id: 'zaobao', name: '联合早报' },
  { id: '36kr', name: '36氪' },
  { id: 'sspai', name: '少数派' },
  { id: 'zhihu', name: '知乎日报' },
]

function NewsCard() {
  const [data, setData] = useState<NewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sourceId, setSourceId] = useState('zaobao')
  const [showSources, setShowSources] = useState(false)
  const [_refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/news?id=${sourceId}`)
        if (!res.ok) {
          throw new Error('Failed to fetch news')
        }
        const newsData = await res.json()
        setData(newsData)
      } catch (err) {
        console.error(err)
        setError('Failed to load news')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [sourceId])

  const handleSourceChange = (id: string) => {
    setSourceId(id)
    setShowSources(false)
  }

  if (loading && !data) {
    return (
      <div className="flex h-[400px] w-80 items-center justify-center rounded-3xl bg-base-200 shadow-xl">
        <Loader2 className="h-8 w-8 animate-spin text-base-content/30" />
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="flex h-[400px] w-80 flex-col items-center justify-center gap-2 rounded-3xl bg-base-200 text-base-content/50 shadow-xl">
        <Newspaper className="h-10 w-10" />
        <p>{error}</p>
        <button
          onClick={() => setRefreshTrigger((prev) => prev + 1)}
          className="mt-2 rounded-full bg-base-300 px-4 py-1.5 font-medium text-xs transition-colors hover:bg-base-300/80"
        >
          Retry
        </button>
      </div>
    )
  }

  const currentSource = NEWS_SOURCES.find((s) => s.id === sourceId)

  return (
    <div className="group relative h-[400px] w-80 overflow-hidden rounded-3xl bg-base-100 shadow-2xl transition-all hover:scale-[1.02] hover:shadow-3xl">
      {/* 顶部装饰背景 */}
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-br from-rose-500 to-pink-600 transition-all duration-500 group-hover:h-36" />

      {/* 装饰性光晕 */}
      <div className="-right-4 -top-4 absolute h-24 w-24 rounded-full bg-white/20 blur-2xl" />

      {/* 内容层 */}
      <div className="relative flex h-full flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 text-white">
          <div className="relative">
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-white/30"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded bg-white/20">
                <Newspaper className="h-3 w-3" />
              </div>
              <span className="font-semibold text-sm tracking-wide">{currentSource?.name}</span>
              <ChevronDown
                className={cn('h-3 w-3 transition-transform', showSources && 'rotate-180')}
              />
            </button>

            {/* 下拉菜单 */}
            {showSources && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setShowSources(false)}
                  aria-label="关闭下拉菜单"
                />
                <div className="absolute top-full left-0 z-20 mt-2 w-40 overflow-hidden rounded-xl bg-white/90 p-1 shadow-xl backdrop-blur-xl dark:bg-slate-800/90">
                  {NEWS_SOURCES.map((source) => (
                    <button
                      key={source.id}
                      onClick={() => handleSourceChange(source.id)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10',
                        sourceId === source.id
                          ? 'bg-rose-500 text-white hover:bg-rose-600'
                          : 'text-slate-700 dark:text-slate-200'
                      )}
                    >
                      {source.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            disabled={loading}
            className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20 disabled:opacity-50"
          >
            <RefreshCcw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </button>
        </div>

        {/* 新闻列表容器 - 卡片式叠加 */}
        <div className="flex-1 overflow-hidden rounded-t-3xl bg-base-100/95 backdrop-blur-xl">
          <div className="scrollbar-hide h-full overflow-y-auto p-4">
            <div className="space-y-3">
              {data?.items.map((item, index) => (
                <a
                  key={item.id || index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:-translate-y-0.5 block rounded-xl border border-base-200 bg-base-50/50 p-3 transition-all hover:border-rose-200 hover:bg-rose-50 hover:shadow-md dark:hover:border-rose-900/30 dark:hover:bg-rose-900/10"
                >
                  <h4 className="line-clamp-2 font-medium text-base-content text-sm leading-snug">
                    {item.title}
                  </h4>
                  <div className="mt-2 flex items-center justify-between text-base-content/40 text-xs">
                    <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(NewsCard)
