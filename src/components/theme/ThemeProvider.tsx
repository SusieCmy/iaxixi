/**
 * @Date: 2025-07-08
 * @Description: 主题提供者
 */

'use client'
import { useEffect } from 'react'
import useThemeStore from '@/store/useThemeStore'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeType, colorScheme } = useThemeStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeType)
  }, [themeType])

  useEffect(() => {
    document.documentElement.setAttribute('data-color', colorScheme)
  }, [colorScheme])

  return <>{children}</>
}
