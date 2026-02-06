'use client'

import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) return null

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className="fixed right-8 bottom-8 z-40 h-12 w-12 rounded-full shadow-sm transition-all hover:scale-110 hover:shadow-md xl:bottom-32"
      title="回到顶部"
      aria-label="回到顶部"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}
