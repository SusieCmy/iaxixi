'use client'

import { List, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

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
      <Button
        variant={isOpen ? 'default' : 'outline'}
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 rounded-full shadow-sm"
        title="文章目录"
        aria-label="打开文章目录"
        aria-expanded={isOpen}
      >
        <List className="h-5 w-5" />
      </Button>

      {/* 目录面板 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <button
            className="-z-10 fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setIsOpen(false)
              }
            }}
            aria-label="关闭目录"
            tabIndex={-1}
          />
          {/* 目录内容 */}
          <div className="absolute right-0 bottom-14 max-h-[60vh] w-72 max-w-[90vw] overflow-hidden rounded-md border border-(--jp-mist) bg-(--jp-cream) p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-(family-name:--font-jp-sans) font-medium text-(--jp-ink) text-sm">
                文章目录
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6"
                aria-label="关闭文章目录"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <nav className="scrollbar-thin max-h-80 space-y-0.5 overflow-y-auto">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={`block w-full rounded px-3 py-1.5 text-left font-(family-name:--font-jp-sans) text-sm transition-colors ${
                    activeId === item.id
                      ? 'border-(--jp-vermilion) border-l-2 bg-(--jp-paper) text-(--jp-ink)'
                      : 'text-(--jp-ash) hover:bg-(--jp-paper) hover:text-(--jp-ink)'
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
