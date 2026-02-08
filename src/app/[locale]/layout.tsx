/*
 * @Date: 2025-12-17
 * @Description: Locale layout - 支持国际化的布局文件
 */

import { Github as GithubIcon, Twitter as TwitterIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import ChatPopup from '@/components/chat/ChatPopup'
import Header from '@/components/layout/Header'
import HideInAigc from '@/components/layout/HideInAigc'
import StructuredData from '@/components/seo/StructuredData'
import ToastContainer from '@/components/toast/ToastContainer'
import ScrollToTopOnRouteChange from '@/components/ui/ScrollToTopOnRouteChange'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: {
      default: t('siteTitle'),
      template: `%s | ${t('siteTitle')}`,
    },
    description: t('siteDescription'),
    keywords: t('keywords'),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // 验证 locale 是否有效
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // 获取翻译消息和翻译函数
  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'footer' })

  return (
    <NextIntlClientProvider messages={messages}>
      <ScrollToTopOnRouteChange />
      <ToastContainer />
      <header className="sticky top-0 z-50">
        <StructuredData />
        <HideInAigc>
          <Header />
        </HideInAigc>
      </header>
      <main className="relative z-10">{children}</main>
      <HideInAigc>
        <footer className="relative z-10 border-[var(--jp-mist)] border-t bg-[var(--jp-cream)] py-12">
          <div className="mx-auto max-w-screen-2xl px-6">
            <nav className="mb-8 flex justify-center gap-8">
              <Link
                href={`/${locale}/blog`}
                className="font-[family-name:var(--font-jp-sans)] text-[var(--jp-ash)] text-sm transition-colors hover:text-[var(--jp-ink)]"
              >
                {t('blog')}
              </Link>
              <Link
                href={`/${locale}/projects`}
                className="font-[family-name:var(--font-jp-sans)] text-[var(--jp-ash)] text-sm transition-colors hover:text-[var(--jp-ink)]"
              >
                {t('projects')}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="font-[family-name:var(--font-jp-sans)] text-[var(--jp-ash)] text-sm transition-colors hover:text-[var(--jp-ink)]"
              >
                {t('about')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="font-[family-name:var(--font-jp-sans)] text-[var(--jp-ash)] text-sm transition-colors hover:text-[var(--jp-ink)]"
              >
                {t('contact')}
              </Link>
            </nav>
            <div className="flex justify-center gap-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-[var(--jp-ash)] transition-colors hover:text-[var(--jp-ink)]"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-[var(--jp-ash)] transition-colors hover:text-[var(--jp-ink)]"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-8 text-center font-[family-name:var(--font-jp-sans)] text-[var(--jp-ash)] text-xs">
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[var(--jp-ink)]"
              >
                湘ICP备2023003507号
              </a>
              <span className="mx-2">·</span>© {new Date().getFullYear()} 陈慕宇
            </p>
          </div>
        </footer>
      </HideInAigc>
      <ChatPopup />
    </NextIntlClientProvider>
  )
}
