'use client'
import { useEffect } from 'react'

export default function ScreenAdapter() {
  useEffect(() => {
    const style = document.documentElement.style

    const refreshRem = () => {
      const width = document.documentElement.clientWidth
      // Assume design width is 1920px, base font size is 16px
      // 1rem = 16px at 1920px width
      const rem = (width / 1920) * 16
      style.fontSize = `${rem}px`
    }

    refreshRem()

    window.addEventListener('resize', refreshRem)

    return () => {
      window.removeEventListener('resize', refreshRem)
      // Optional: Reset to default on unmount if needed, but usually fine to leave
      // style.fontSize = '16px';
    }
  }, [])

  return null
}
