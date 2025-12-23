/*
 * @Date: 2025-12-09
 * @Description: 导航菜单组件 - 支持响应式、主题切换和国际化
 */

'use client'

import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Home,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Sparkles,
  Sun,
  User,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import { animateElements, staggerDelay } from '@/lib/animations'
import useThemeStore from '@/store/useThemeStore'

// 菜单配置接口
interface MenuConfig {
  path: string
  icon: LucideIcon
  labelKey: string
  descKey: string
}

// 菜单配置 (仅包含路径和翻译键)
const menuConfig: MenuConfig[] = [
  {
    path: '/',
    icon: Home,
    labelKey: 'home',
    descKey: 'homeDesc',
  },
  {
    path: '/blog',
    icon: BookOpen,
    labelKey: 'blog',
    descKey: 'blogDesc',
  },
  {
    path: '/aigc',
    icon: Sparkles,
    labelKey: 'aigc',
    descKey: 'aigcDesc',
  },
  {
    path: '/dialogue',
    icon: MessageCircle,
    labelKey: 'dialogue',
    descKey: 'dialogueDesc',
  },
  {
    path: '/dashboard',
    icon: BarChart3,
    labelKey: 'dashboard',
    descKey: 'dashboardDesc',
  },
  {
    path: '/projects',
    icon: Briefcase,
    labelKey: 'projects',
    descKey: 'projectsDesc',
  },
  {
    path: '/about',
    icon: User,
    labelKey: 'about',
    descKey: 'aboutDesc',
  },
  {
    path: '/contact',
    icon: Mail,
    labelKey: 'contact',
    descKey: 'contactDesc',
  },
]

export default function Navigation() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { setThemeType, themeType } = useThemeStore()

  // 生成国际化菜单项
  const menuItems = menuConfig.map((item) => ({
    path: item.path,
    icon: item.icon,
    label: t(item.labelKey),
    description: t(item.descKey),
  }))

  // 检查路由是否激活
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '/home'
    }
    return pathname.startsWith(path)
  }

  // 主题切换
  const handleThemeToggle = () => {
    setThemeType(themeType === 'light' ? 'dark' : 'light')
  }

  // 移动菜单切换
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // 关闭移动菜单
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // 菜单项入场动画 - 渐变显示
  useEffect(() => {
    animateElements('.nav-menu-item', {
      opacity: [0, 1],
      delay: staggerDelay(0, 60),
      duration: 700,
      ease: 'easeOutCubic',
    })
  }, [])

  // 移动菜单动画 - 渐变显示
  useEffect(() => {
    if (isMobileMenuOpen) {
      animateElements('.mobile-nav-item', {
        opacity: [0, 1],
        delay: staggerDelay(0, 50),
        duration: 600,
        ease: 'easeOutCubic',
      })
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* 桌面端导航 */}
      <nav className="hidden items-center gap-2 md:flex lg:gap-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-menu-item group relative flex cursor-target items-center gap-2 rounded-lg px-3 py-2 transition-all duration-300 ${
                active
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
              } `}
              title={item.description}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{item.label}</span>

              {/* 激活指示器 */}
              {active && (
                <span className="-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-1/2 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}

        {/* 主题切换按钮 */}
        <button
          onClick={handleThemeToggle}
          className="nav-menu-item ml-2 cursor-target rounded-lg p-2 transition-all duration-300 hover:bg-base-200"
          title={t(themeType === 'light' ? 'toggleToDark' : 'toggleToLight')}
        >
          {themeType === 'light' ? (
            <Moon className="h-4 w-4 text-base-content/70 hover:text-base-content" />
          ) : (
            <Sun className="h-4 w-4 text-base-content/70 hover:text-base-content" />
          )}
        </button>

        {/* 语言切换器 */}
        <LanguageSwitcher />
      </nav>

      {/* 移动端菜单按钮 */}
      <div className="flex items-center gap-2 md:hidden">
        {/* 语言切换 */}
        <LanguageSwitcher />

        {/* 主题切换 */}
        <button
          onClick={handleThemeToggle}
          className="rounded-lg p-2 transition-all duration-300 hover:bg-base-200"
          title={t(themeType === 'light' ? 'toggleToDark' : 'toggleToLight')}
        >
          {themeType === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        {/* 汉堡菜单 */}
        <button
          onClick={toggleMobileMenu}
          className="rounded-lg p-2 transition-all duration-300 hover:bg-base-200"
          aria-label={t('toggleMenu')}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* 移动端下拉菜单 */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 left-0 mt-2 overflow-hidden rounded-2xl border-2 border-base-300 bg-base-100 shadow-xl backdrop-blur-md md:hidden">
          <nav className="space-y-2 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={closeMobileMenu}
                  className={`mobile-nav-item flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                    active
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                  } `}
                  style={{ opacity: 0 }}
                >
                  <Icon className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-60">{item.description}</div>
                  </div>
                  {active && <div className="h-2 w-2 rounded-full bg-primary" />}
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      {/* 移动端遮罩层 */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[-1] bg-black/20 backdrop-blur-sm md:hidden"
          onClick={closeMobileMenu}
          onKeyDown={(e) => e.key === 'Escape' && closeMobileMenu()}
          role="button"
          tabIndex={0}
          aria-label={t('closeMenu')}
        />
      )}
    </>
  )
}
