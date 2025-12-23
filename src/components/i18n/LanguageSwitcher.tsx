/*
 * @Date: 2025-12-17
 * @Description: 语言切换器组件 - 使用 DaisyUI Dropdown
 */

'use client'

import { Check, Globe, Loader2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useTransition } from 'react'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  // 切换语言
  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return

    startTransition(() => {
      // 移除路径中的当前 locale
      const pathnameWithoutLocale = pathname.replace(`/${locale}`, '')
      // 构建新的路径
      const newPath = `/${newLocale}${pathnameWithoutLocale || ''}`
      router.push(newPath)
    })
  }

  const languages = [
    { code: 'zh', name: '中文', flag: '🇨🇳', desc: 'Chinese' },
    { code: 'en', name: 'English', flag: '🇬🇧', desc: '英语' },
  ]

  return (
    <div className="cmy-dropdown cmy-dropdown-end">
      {/* 触发按钮 */}
      <div
        tabIndex={0}
        role="button"
        className="cmy-btn cmy-btn-ghost cmy-btn-sm gap-1.5 rounded-lg"
        aria-label="切换语言 / Switch Language"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
        <span className="hidden font-medium text-xs uppercase sm:inline">{locale}</span>
      </div>

      {/* 下拉菜单 */}
      <ul className="cmy-menu cmy-dropdown-content z-[1] mt-3 w-52 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              onClick={() => handleLanguageChange(lang.code)}
              disabled={isPending}
              className={`flex items-center gap-3 ${
                locale === lang.code ? 'active bg-primary/10 text-primary' : ''
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <div className="flex-1">
                <div className="font-medium">{lang.name}</div>
                <div className="text-[10px] opacity-60">{lang.desc}</div>
              </div>
              {locale === lang.code && <Check className="h-4 w-4" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
