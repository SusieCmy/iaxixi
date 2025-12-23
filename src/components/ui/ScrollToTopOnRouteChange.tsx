'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * 路由切换时自动滚动到顶部
 * 在 Next.js App Router 中，路由切换默认不会自动滚动
 */
export default function ScrollToTopOnRouteChange() {
  const pathname = usePathname()

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname dependency is intentional to trigger scroll on route change
  useEffect(() => {
    // 路由变化时滚动到顶部
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // 使用 instant 而不是 smooth，避免延迟
    })
  }, [pathname])

  return null
}
