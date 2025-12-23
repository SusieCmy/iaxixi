/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-08-08 21:09:39
 * @LastEditors: Susie 1732728869@qq.com
 * @LastEditTime: 2025-08-19 22:17:03
 * @FilePath: \susie-cmy\src\components\Animation\UserTimeline.tsx
 * @Description: 强者都是孤独的
 *
 * Copyright (c) 2025 by 1732728869@qq.com, All Rights Reserved.
 */

'use client'
import { animate, onScroll, utils } from 'animejs'
import { useEffect, useState } from 'react'
export default function UserTimeline() {
  const [prevProgress, setPrevProgress] = useState<number>(0)

  useEffect(() => {
    const containers = utils.$('.cmy-scroll-container')
    const timelines = utils.$('.cmy-timeline')
    const cardsAnimation = animate(timelines, {
      scale: [1, 0.5, 10],
    })

    onScroll({
      target: containers,
      enter: 'top',
      leave: 'bottom',
      // debug: true,
      sync: 0.1,
      onUpdate: (e) => {
        setPrevProgress(e.prevProgress)
      },
    }).link(cardsAnimation)

    return () => {
      cardsAnimation?.pause()
    }
  }, [])
  return (
    <div className="">
      <div className="cmy-scroll-container relative h-[400lvh]">
        <div className="sticky top-1/12 left-0 h-[90lvh]">
          <progress
            className="cmy-progress cmy-progress-accent absolute top-0 left-0 w-[83lvh] origin-left rotate-90 transform"
            value={prevProgress * 100}
            max="100"
          />
        </div>
      </div>
    </div>
  )
}
