/*
 * @Date: 2025-02-08
 * @Description: 扣子智能体列表页面
 */
'use client'

import { Bot, RefreshCw, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { type BotInfo, useBots } from '@/hooks/useBots'
import useChatStore from '@/store/useChatStore'

function BotCard({ bot }: { bot: BotInfo }) {
  const openChat = useChatStore((s) => s.openChat)

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-colors hover:border-[var(--jp-stone)]"
      onClick={() => openChat(bot.id, bot.name, bot.icon_url || '', bot.description || '')}
    >
      <div className="flex gap-4 p-5">
        {bot.icon_url ? (
          <Image
            src={bot.icon_url}
            alt={bot.name}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--jp-paper)]">
            <Sparkles className="h-6 w-6 text-[var(--jp-vermilion)]" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-[family-name:var(--font-jp-sans)] font-medium text-[var(--jp-ink)]">
              {bot.name}
            </h3>
            {bot.is_published && (
              <Badge variant="outline" className="shrink-0 text-[10px]">
                已发布
              </Badge>
            )}
          </div>
          {bot.description && (
            <p className="mt-1 line-clamp-2 text-[var(--jp-ash)] text-xs leading-relaxed">
              {bot.description}
            </p>
          )}
          <p className="mt-2 text-[10px] text-[var(--jp-mist)]">
            更新于 {new Date(bot.updated_at * 1000).toLocaleDateString('zh-CN')}
          </p>
        </div>
      </div>
    </Card>
  )
}

function SkeletonCard() {
  return (
    <Card>
      <div className="flex gap-4 p-5">
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-[var(--jp-mist)]" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 animate-pulse rounded bg-[var(--jp-mist)]" />
          <div className="h-3.5 w-48 animate-pulse rounded bg-[var(--jp-mist)]" />
          <div className="h-3 w-20 animate-pulse rounded bg-[var(--jp-mist)]" />
        </div>
      </div>
    </Card>
  )
}

export default function DialoguePage() {
  const t = useTranslations('common')
  const { data, isLoading, error, refetch, isRefetching } = useBots()

  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-jp)] font-medium text-2xl text-[var(--jp-ink)]">
            智能体
          </h1>
          <p className="mt-1 font-[family-name:var(--font-jp-sans)] text-[var(--jp-ash)] text-sm">
            我的扣子智能体列表
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
          {t('retry')}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-[var(--jp-error)]/30 bg-[var(--jp-error)]/5 p-4 text-center">
          <p className="text-[var(--jp-error)] text-sm">{error.message || '加载失败'}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            {t('retry')}
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, item) => (
            <SkeletonCard key={`skeleton-${item}`} />
          ))}
        </div>
      )}

      {data && !error && (
        <>
          <p className="mb-4 text-[var(--jp-ash)] text-xs">共 {data.total} 个智能体</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((bot) => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
          {data.items.length === 0 && (
            <div className="py-20 text-center">
              <Bot className="mx-auto h-12 w-12 text-[var(--jp-mist)]" />
              <p className="mt-4 text-[var(--jp-ash)] text-sm">暂无智能体</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
