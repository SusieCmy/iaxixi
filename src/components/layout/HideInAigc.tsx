/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-11-19 21:36:57
 * @LastEditors: cmy && 1732728869@qq.com
 * @LastEditTime: 2025-12-18
 * @FilePath: \chenmuyu\src\components\Layout\HideInAigc\index.tsx
 * @Description: 路由条件渲染组件 - 支持国际化路由
 *
 * Copyright (c) 2025 by 1732728869@qq.com, All Rights Reserved.
 */
'use client'

import type React from 'react'
import { usePathname } from '@/i18n/routing'

/**
 * 在特定路由下隐藏子组件（如 Header、Footer）
 * 使用 next-intl 的 usePathname，自动处理 locale 前缀
 *
 * 隐藏规则：
 * - /aigc/* - AIGC 子路由（不包括主页 /aigc）
 * - /dashboard - Dashboard 及其所有子路由
 * - /dialogue - Dialogue 及其所有子路由
 */
export default function HideInAigc({ children }: { children: React.ReactNode }) {
  // next-intl 的 usePathname 已自动移除 locale 前缀
  const pathname = usePathname()

  if (!pathname) return children

  // 隐藏规则：只隐藏子路由，保留主页
  const shouldHide =
    pathname.startsWith('/aigc/') || // /aigc/new, /aigc/{id}
    pathname.startsWith('/dashboard') || // /dashboard/*
    pathname.startsWith('/dialogue') // /dialogue/*

  return shouldHide ? null : children
}
