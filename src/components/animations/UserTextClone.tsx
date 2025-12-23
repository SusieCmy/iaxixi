/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-08-19 21:50:13
 * @LastEditors: Susie 1732728869@qq.com
 * @LastEditTime: 2025-08-19 22:16:26
 * @FilePath: \susie-cmy\src\components\Animation\UserTextClone.tsx
 * @Description: 强者都是孤独的
 *
 * Copyright (c) 2025 by 1732728869@qq.com, All Rights Reserved.
 */
'use client'
import { createTimeline, splitText, stagger } from 'animejs'
import { useEffect, useId, useRef } from 'react'

export default function UserTextClone({ propsText }: { propsText: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const uniqueId = useId().replace(/:/g, '-')

  // biome-ignore lint/correctness/useExhaustiveDependencies: propsText dependency is intentional to re-run animation on text change
  useEffect(() => {
    const selector = `#text-${uniqueId}`
    const { chars } = splitText(selector, {
      chars: {
        wrap: 'clip',
        clone: 'bottom',
      },
    })

    const timeline = createTimeline().add(
      chars,
      {
        y: '-100%',
        loop: true,
        loopDelay: 350,
        duration: 750,
        ease: 'inOut(2)',
      },
      stagger(150, { from: 'center' })
    )

    return () => {
      timeline.pause()
    }
  }, [propsText, uniqueId])

  return (
    <div ref={containerRef}>
      <div className="large centered row">
        <p id={`text-${uniqueId}`} className="textp">
          {propsText}
        </p>
      </div>
      <div className="small row" />
    </div>
  )
}
