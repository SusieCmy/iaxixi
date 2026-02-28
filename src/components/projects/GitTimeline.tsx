/*
 * @Date: 2026-02-26
 * @Description: Git 时间线客户端组件
 */
'use client'

import { GitBranch } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import type { GitCommit } from '@/app/api/git-log/route'
import { animateElements, staggerDelay } from '@/lib/animations'

interface Props {
  commits: GitCommit[]
}

// 按日期分组
function groupByDate(commits: GitCommit[]) {
  const map = new Map<string, GitCommit[]>()
  for (const c of commits) {
    const key = c.date.slice(0, 7) // YYYY-MM
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(c)
  }
  return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
}

// 根据 commit subject 前缀判断类型
function getCommitType(subject: string): { label: string; color: string } {
  const s = subject.toLowerCase()
  if (s.startsWith('feat')) return { label: 'feat', color: 'bg-(--jp-vermilion)' }
  if (s.startsWith('fix')) return { label: 'fix', color: 'bg-(--jp-indigo)' }
  if (s.startsWith('refactor')) return { label: 'refactor', color: 'bg-(--jp-moss)' }
  if (s.startsWith('perf')) return { label: 'perf', color: 'bg-(--jp-moss)' }
  if (s.startsWith('style')) return { label: 'style', color: 'bg-(--jp-stone)' }
  if (s.startsWith('chore') || s.startsWith('build'))
    return { label: 'chore', color: 'bg-(--jp-ash)' }
  if (s.startsWith('docs')) return { label: 'docs', color: 'bg-(--jp-stone)' }
  return { label: 'other', color: 'bg-(--jp-mist)' }
}

export function GitTimeline({ commits }: Props) {
  const grouped = useMemo(() => groupByDate(commits), [commits])

  useEffect(() => {
    animateElements('.tl-group', {
      translateY: [30, 0],
      delay: staggerDelay(0, 0.08),
      duration: 0.6,
      ease: 'easeOut',
    })
  }, [])

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-8">
      {/* 页面标题 */}
      <div className="mb-10">
        <h1 className="font-(family-name:--font-jp) mb-2 flex items-center gap-2 font-medium text-(--jp-ink) text-2xl">
          <GitBranch className="h-6 w-6 text-(--jp-vermilion)" />
          历程
        </h1>
        <p className="font-(family-name:--font-jp-sans) text-(--jp-ash) text-sm">
          通过 git 提交记录，看看这个网站一步步长成什么样子
        </p>
      </div>

      {commits.length === 0 ? (
        <div className="tl-group flex flex-col items-center gap-3 py-24 text-(--jp-ash) opacity-0">
          <span className="font-(family-name:--font-jp-sans) text-sm">暂无提交记录</span>
        </div>
      ) : (
        <div className="relative">
          {/* 竖线 */}
          <div className="absolute top-0 left-22 h-full w-px bg-(--jp-mist) sm:left-24" />

          <div className="space-y-10">
            {grouped.map(([month, items]) => {
              const [year, mon] = month.split('-')
              const visibleItems = items.filter((c) => getCommitType(c.subject).label !== 'other')
              if (visibleItems.length === 0) return null
              return (
                <div key={month} className="tl-group relative flex gap-6 opacity-0 sm:gap-8">
                  {/* 月份 */}
                  <div className="w-20 shrink-0 pt-1 text-right sm:w-24">
                    <span className="font-(family-name:--font-jp) font-medium text-(--jp-ink) text-base">
                      {year}
                    </span>
                    <span className="font-(family-name:--font-jp-sans) block text-(--jp-ash) text-xs">
                      {mon}月
                    </span>
                  </div>

                  {/* 节点 */}
                  <div className="relative flex shrink-0 flex-col items-center">
                    <div className="mt-2 h-2 w-2 rounded-full bg-(--jp-vermilion)" />
                  </div>

                  {/* 提交列表 */}
                  <div className="flex-1 divide-y divide-(--jp-mist) pb-2">
                    {visibleItems.map((commit) => {
                      const { label, color } = getCommitType(commit.subject)
                      return (
                        <div key={commit.hash} className="py-2.5 first:pt-0">
                          <div className="flex items-start gap-2">
                            {label !== 'other' && (
                              <span
                                className={`font-(family-name:--font-jp-sans) mt-0.5 shrink-0 rounded-sm px-1.5 py-0.5 text-white text-xs ${color}`}
                              >
                                {label}
                              </span>
                            )}
                            <span className="font-(family-name:--font-jp-sans) text-(--jp-ink) text-sm leading-relaxed">
                              {commit.subject.replace(
                                /^(feat|fix|refactor|perf|style|chore|build|docs)(\(.+?\))?:\s*/i,
                                ''
                              )}
                            </span>
                          </div>
                          {commit.body && (
                            <p className="font-(family-name:--font-jp-sans) mt-1 pl-10 text-(--jp-stone) text-xs leading-relaxed">
                              {commit.body}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 落款 */}
      <div className="tl-group mt-20 flex items-center gap-3 opacity-0">
        <div className="h-px flex-1 bg-(--jp-mist)" />
        <span className="font-(family-name:--font-jp) text-(--jp-ash) text-sm">
          {commits.length} 次提交
        </span>
        <div className="h-px flex-1 bg-(--jp-mist)" />
      </div>
    </div>
  )
}
