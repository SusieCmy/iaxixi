/*
 * @Date: 2025-07-08 14:46:31
 * @LastEditors: cmy && 1732728869@qq.com
 * @LastEditTime: 2025-07-09 10:42:11
 * @FilePath: \susie-cmy\src\store\useThemeStore.ts
 * @Description: 强者都是孤独的
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeStore = {
  themeType: string
  setThemeType: (themeType: string) => void
}

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      // themeType: 'light',
      themeType: 'dark',
      setThemeType: (themeType) => set({ themeType }),
    }),
    { name: 'themeType-storage' }
  )
)

export default useThemeStore
