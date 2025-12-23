'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export default function MobileTOC() {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isVisible, setIsVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // 确保在客户端运行
    if (typeof window === 'undefined') return

    const headings = document.querySelectorAll('article h1, article h2, article h3')
    if (headings.length === 0) return

    const tocItems: TocItem[] = []

    headings.forEach((heading, index) => {
      let id = heading.id
      if (!id) {
        id = `heading-${index}`
        heading.id = id
      }
      tocItems.push({
        id,
        text: heading.textContent || '',
        level: Number.parseInt(heading.tagName.charAt(1)),
      })
    })

    // 使用 requestAnimationFrame 延迟状态更新，避免在 effect 中同步设置状态
    requestAnimationFrame(() => {
      setToc(tocItems)
    })

    // 监听滚动以高亮当前标题
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -80% 0%',
      }
    )

    headings.forEach((heading) => observer.observe(heading))

    // 监听滚动显示/隐藏目录
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsVisible(scrollTop > 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      headings.forEach((heading) => observer.unobserve(heading))
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false) // 点击后收起目录
    }
  }

  if (!isVisible || toc.length === 0) return null

  return (
    <div className="fixed right-4 bottom-20 z-40 block xl:hidden">
      {/* 目录按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn btn-circle shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen ? 'btn-primary' : 'btn-neutral'
        }`}
        title="文章目录"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* 目录面板 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="-z-10 fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="关闭目录"
          />
          {/* 目录内容 */}
          <div className="absolute right-0 bottom-16 max-h-[60vh] w-80 max-w-[90vw] animate-slide-in-up overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-4 shadow-xl">
            <div className="mb-3">
              <h3 className="flex items-center justify-between font-bold text-base-content text-sm">
                文章目录
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn btn-ghost btn-xs btn-circle"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </h3>
            </div>

            <nav className="scrollbar-thin max-h-96 space-y-1 overflow-y-auto">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 hover:bg-base-200 ${
                    activeId === item.id
                      ? 'border-primary border-l-2 bg-primary/10 font-medium text-primary'
                      : 'text-base-content/70 hover:text-base-content'
                  } ${item.level === 2 ? 'pl-5' : item.level === 3 ? 'pl-7' : 'pl-3'}`}
                >
                  <span className="line-clamp-2 leading-relaxed">{item.text}</span>
                </button>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
