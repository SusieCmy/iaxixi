/**
 * @Date: 2025-07-08
 * @Description: 主题提供者
 */

'use client'
import { useEffect, useRef } from 'react'
import useThemeStore from '@/store/useThemeStore'

function applyWithTransition(apply: () => void) {
  if (!document.startViewTransition) {
    apply()
    return
  }
  document.startViewTransition(apply)
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeType, colorScheme } = useThemeStore()
  const isInitial = useRef(true)

  useEffect(() => {
    if (isInitial.current) {
      document.documentElement.setAttribute('data-theme', themeType)
      return
    }
    applyWithTransition(() => {
      document.documentElement.setAttribute('data-theme', themeType)
    })
  }, [themeType])

  useEffect(() => {
    if (isInitial.current) {
      document.documentElement.setAttribute('data-color', colorScheme)
      isInitial.current = false
      return
    }
    applyWithTransition(() => {
      document.documentElement.setAttribute('data-color', colorScheme)
    })
  }, [colorScheme])

  return <>{children}</>
}
