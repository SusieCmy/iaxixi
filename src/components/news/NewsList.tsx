/*
 * @Date: 2025-02-25
 * @Description: 新闻列表组件
 */
'use client'

import { ExternalLink, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNews } from '@/hooks/useNews'

const NEWS_SOURCES = [
  { id: 'zaobao', label: '早报' },
  { id: 'weibo', label: '微博' },
  { id: 'douyin', label: '抖音' },
  { id: 'toutiao', label: '头条' },
]

interface NewsItem {
  id: string
  title: string
  url: string
  pubDate?: string
  mobileUrl?: string
  extra?: {
    icon?: string | { url: string; scale?: number }
  }
}

function formatTime(pubDate: string) {
  const date = new Date(pubDate)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

export default function NewsList() {
  const t = useTranslations('news')
  const [sourceId, setSourceId] = useState('zaobao')
  const { data, isLoading, error, refetch, isRefetching } = useNews(sourceId)

  const items: NewsItem[] = data?.items || []

  return (
    <div className="mx-auto max-w-screen-2xl py-8 sm:py-12">
      {/* 标题栏 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-jp)] font-medium text-2xl text-[var(--jp-ink)]">
          {t('title')}
        </h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="h-8 w-8 rounded-full"
          aria-label={t('refresh')}
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* 新闻源切换 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {NEWS_SOURCES.map((source) => (
          <Badge
            key={source.id}
            variant={sourceId === source.id ? 'default' : 'outline'}
            className={`cursor-pointer px-3 py-1.5 font-[family-name:var(--font-jp-sans)] transition-colors ${
              sourceId === source.id
                ? 'bg-[var(--jp-vermilion)] text-white hover:bg-[var(--jp-vermilion)]/90'
                : 'hover:border-[var(--jp-stone)]'
            }`}
            onClick={() => setSourceId(source.id)}
          >
            {source.label}
          </Badge>
        ))}
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-[var(--jp-mist)] bg-[var(--jp-cream)] p-4"
            >
              <div className="h-4 w-6 animate-pulse rounded bg-[var(--jp-mist)]" />
              <div className="h-4 flex-1 animate-pulse rounded bg-[var(--jp-mist)]" />
            </div>
          ))}
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="py-12 text-center">
          <p className="mb-2 text-[var(--jp-ash)]">{t('loadFailed')}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {t('retry')}
          </Button>
        </div>
      )}

      {/* 新闻列表 */}
      {!isLoading && !error && items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-lg border border-[var(--jp-mist)] bg-[var(--jp-cream)] p-4 transition-colors hover:border-[var(--jp-stone)]"
            >
              {/* 序号 */}
              <span
                className={`shrink-0 font-[family-name:var(--font-jp)] font-medium text-sm ${
                  index < 3 ? 'text-[var(--jp-vermilion)]' : 'text-[var(--jp-ash)]'
                }`}
              >
                {index + 1}
              </span>

              {/* 标题 */}
              <span className="flex-1 font-[family-name:var(--font-jp-sans)] text-[var(--jp-ink)] text-sm leading-relaxed group-hover:text-[var(--jp-vermilion)]">
                {item.title}
              </span>

              {/* 时间 / 外链图标 */}
              <span className="flex shrink-0 items-center gap-2">
                {item.pubDate && (
                  <span className="font-[family-name:var(--font-jp-sans)] text-[var(--jp-ash)] text-xs">
                    {formatTime(item.pubDate)}
                  </span>
                )}
                <ExternalLink className="h-3.5 w-3.5 text-[var(--jp-ash)] opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
