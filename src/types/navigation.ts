/*
 * @Date: 2025-12-09
 * @Description: 导航菜单类型定义
 */

import type { LucideIcon } from 'lucide-react'

export interface MenuItem {
  path: string
  label: string
  icon: LucideIcon
  description: string
  badge?: string | number
  external?: boolean
}

export interface NavigationProps {
  className?: string
}
