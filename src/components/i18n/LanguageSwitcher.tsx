/*
 * @Date: 2025-12-17
 * @Description: 语言切换器组件 - 日系简约风格
 */

'use client'

import { Check, Globe, Loader2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return

    startTransition(() => {
      const pathnameWithoutLocale = pathname.replace(`/${locale}`, '')
      const newPath = `/${newLocale}${pathnameWithoutLocale || ''}`
      router.push(newPath)
    })
  }

  const languages = [
    { code: 'zh', name: '中文', desc: 'Chinese' },
    { code: 'en', name: 'English', desc: '英语' },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-(family-name:--font-jp-sans) gap-1.5"
          aria-label="切换语言 / Switch Language"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
          <span className="hidden uppercase sm:inline">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            disabled={isPending}
            className={`font-(family-name:--font-jp-sans) ${
              locale === lang.code ? 'bg-(--jp-paper)' : ''
            }`}
          >
            <div className="flex w-full items-center gap-3">
              <div className="flex-1">
                <div className="font-medium">{lang.name}</div>
                <div className="text-xs opacity-60">{lang.desc}</div>
              </div>
              {locale === lang.code && <Check className="h-4 w-4 text-(--jp-vermilion)" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
