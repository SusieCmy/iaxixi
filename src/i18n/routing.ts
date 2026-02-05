import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix: 'as-needed', // 默认语言不显示前缀，对 SEO 更友好
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
