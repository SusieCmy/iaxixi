/**
 * @Date: 2025-07-08 16:41:22
 * @LastEditors: cmy && 1732728869@qq.com
 * @LastEditTime: 2025-07-08 17:22:44
 * @FilePath: \susie-cmy\src\components\ThemeProvider.tsx
 * @Description: 强者都是孤独的
 */

'use client'
import { useEffect } from 'react'
import useThemeStore from '@/store/useThemeStore'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeType } = useThemeStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeType)
  }, [themeType])
  return <>{children}</>
}
