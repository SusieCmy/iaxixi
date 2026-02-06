/*
 * @Date: 2025-07-08
 * @Description: 主题状态管理
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ColorScheme = 'fuji' | 'matcha' | 'latte'

type ThemeStore = {
  themeType: string
  setThemeType: (themeType: string) => void
  colorScheme: ColorScheme
  setColorScheme: (colorScheme: ColorScheme) => void
}

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeType: 'dark',
      setThemeType: (themeType) => set({ themeType }),
      colorScheme: 'fuji',
      setColorScheme: (colorScheme) => set({ colorScheme }),
    }),
    { name: 'themeType-storage' }
  )
)

export type { ColorScheme }

export default useThemeStore
