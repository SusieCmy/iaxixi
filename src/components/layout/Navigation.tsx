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
  Check,
  Home,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Newspaper,
  Palette,
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
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
    path: '/news',
    icon: Newspaper,
    labelKey: 'news',
    descKey: 'newsDesc',
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

// 配色方案配置
const colorSchemes = [
  { value: 'fuji' as const, label: '藤花雨', color: '#9b8bb4' },
  { value: 'matcha' as const, label: '京都抹茶', color: '#7d8c6c' },
  { value: 'latte' as const, label: '焦糖拿铁', color: '#b58563' },
]

export default function Navigation() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { setThemeType, themeType, colorScheme, setColorScheme } = useThemeStore()

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
      delay: staggerDelay(0, 0.06),
      duration: 0.7,
      ease: 'easeOut',
    })
  }, [])

  // 移动菜单动画 - 渐变显示
  useEffect(() => {
    if (isMobileMenuOpen) {
      animateElements('.mobile-nav-item', {
        opacity: [0, 1],
        delay: staggerDelay(0, 0.05),
        duration: 0.6,
        ease: 'easeOut',
      })
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* 桌面端导航 */}
      <nav className="hidden items-center gap-6 md:flex">
        {menuItems.map((item) => {
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-menu-item relative px-1 py-2 font-(family-name:--font-jp-sans) text-sm transition-colors duration-300 ${
                active ? 'font-medium text-(--jp-ink)' : 'text-(--jp-ash) hover:text-(--jp-ink)'
              }`}
              title={item.description}
            >
              <span>{item.label}</span>
              {active && (
                <span className="absolute bottom-0 left-0 h-px w-full bg-(--jp-vermilion)" />
              )}
            </Link>
          )
        })}

        {/* 主题配色切换 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="nav-menu-item ml-4 h-8 w-8 text-(--jp-ash) hover:text-(--jp-ink)"
              aria-label={t('toggleTheme')}
            >
              <Palette className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {colorSchemes.map((scheme) => (
              <DropdownMenuItem
                key={scheme.value}
                onClick={() => setColorScheme(scheme.value)}
                className="cursor-pointer gap-2 font-(family-name:--font-jp-sans)"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: scheme.color }}
                />
                <span className="flex-1">{scheme.label}</span>
                {colorScheme === scheme.value && (
                  <Check className="h-3.5 w-3.5 text-(--jp-vermilion)" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleThemeToggle}
              className="cursor-pointer gap-2 font-(family-name:--font-jp-sans)"
            >
              {themeType === 'light' ? (
                <Moon className="h-3.5 w-3.5" />
              ) : (
                <Sun className="h-3.5 w-3.5" />
              )}
              <span>{t(themeType === 'light' ? 'toggleToDark' : 'toggleToLight')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 语言切换器 */}
        <LanguageSwitcher />
      </nav>

      {/* 移动端菜单按钮 */}
      <div className="flex items-center gap-2 md:hidden">
        {/* 语言切换 */}
        <LanguageSwitcher />

        {/* 主题配色切换 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-(--jp-ash) hover:text-(--jp-ink)"
              aria-label={t('toggleTheme')}
            >
              <Palette className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {colorSchemes.map((scheme) => (
              <DropdownMenuItem
                key={scheme.value}
                onClick={() => setColorScheme(scheme.value)}
                className="cursor-pointer gap-2 font-(family-name:--font-jp-sans)"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: scheme.color }}
                />
                <span className="flex-1">{scheme.label}</span>
                {colorScheme === scheme.value && (
                  <Check className="h-3.5 w-3.5 text-(--jp-vermilion)" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleThemeToggle}
              className="cursor-pointer gap-2 font-(family-name:--font-jp-sans)"
            >
              {themeType === 'light' ? (
                <Moon className="h-3.5 w-3.5" />
              ) : (
                <Sun className="h-3.5 w-3.5" />
              )}
              <span>{t(themeType === 'light' ? 'toggleToDark' : 'toggleToLight')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 汉堡菜单 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="h-9 w-9 text-(--jp-ash) hover:text-(--jp-ink)"
          aria-label={t('toggleMenu')}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* 移动端下拉菜单 */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 border-(--jp-mist) border-b bg-(--jp-cream) shadow-sm md:hidden">
          <nav className="space-y-1 p-4">
            {menuItems.map((item) => {
              const active = isActive(item.path)

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={closeMobileMenu}
                  className={`mobile-nav-item block px-4 py-3 font-(family-name:--font-jp-sans) transition-colors ${
                    active
                      ? 'border-(--jp-vermilion) border-l-2 bg-(--jp-paper) font-medium text-(--jp-ink)'
                      : 'text-(--jp-ash) hover:bg-(--jp-paper) hover:text-(--jp-ink)'
                  }`}
                  style={{ opacity: 0 }}
                >
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-60">{item.description}</div>
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      {/* 移动端遮罩层 */}
      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 top-14 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={closeMobileMenu}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
              e.preventDefault()
              closeMobileMenu()
            }
          }}
          aria-label={t('closeMenu')}
        />
      )}
    </>
  )
}
