/*
 * @Date: 2025-02-26
 * @Description: 关于我 - 文章式自述
 */
'use client'

import { User } from 'lucide-react'
import { useEffect } from 'react'
import { animateElements, staggerDelay } from '@/lib/animations'

const paragraphs = [
  {
    id: 'p1',
    text: '我叫 chenmuyu，一个写代码的人',
  },
]

export default function About() {
  useEffect(() => {
    animateElements('.about-item', {
      translateY: [20, 0],
      delay: staggerDelay(0, 0.08),
      duration: 0.6,
      ease: 'easeOut',
    })
  }, [])

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-8">
      {/* 标题 */}
      <div className="about-item mb-12 opacity-0">
        <h1 className="mb-2 flex items-center gap-2 font-(family-name:--font-jp) font-medium text-2xl text-(--jp-ink)">
          <User className="h-6 w-6 text-(--jp-vermilion)" />
          关于我
        </h1>
        <p className="font-(family-name:--font-jp-sans) text-(--jp-ash) text-sm">一个写代码的人</p>
      </div>

      {/* 文章段落 */}
      <div className="space-y-8">
        {paragraphs.map((p) => (
          <p
            key={p.id}
            className="about-item font-(family-name:--font-jp-sans) text-(--jp-ink) text-base leading-loose opacity-0"
          >
            {p.text}
          </p>
        ))}
      </div>

      {/* 落款 */}
      <div className="about-item mt-16 flex items-center gap-3 opacity-0">
        <div className="h-px flex-1 bg-(--jp-mist)" />
        <span className="font-(family-name:--font-jp) text-(--jp-ash) text-sm">
          chenmuyu · {new Date().getFullYear()}
        </span>
        <div className="h-px flex-1 bg-(--jp-mist)" />
      </div>
    </div>
  )
}
