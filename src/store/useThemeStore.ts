/*
 * @Date: 2025-07-08
 * @Description: 主题状态管理
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ColorScheme = 'fuji' | 'matcha' | 'latte'

type ThemeType = 'light' | 'dark'

type ThemeStore = {
  themeType: ThemeType
  setThemeType: (themeType: ThemeType) => void
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

export type { ColorScheme, ThemeType }

export default useThemeStore
