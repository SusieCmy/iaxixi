/*
 * @Date: 2025-12-17
 * @Description: Locale layout - 支持国际化的布局文件
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
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
      <header className="sticky top-2 z-50">
        <StructuredData />
        <HideInAigc>
          <Header />
        </HideInAigc>
      </header>
      <main className="">{children}</main>
      <HideInAigc>
        <footer className="cmy-footer cmy-footer-horizontal cmy-footer-center rounded bg-base-200 p-10 text-base-content">
          <nav className="grid grid-flow-col gap-4">
            <Link href={`/${locale}/blog`} className="cursor-target">
              {t('blog')}
            </Link>
            <Link href={`/${locale}/projects`} className="cursor-target">
              {t('projects')}
            </Link>
            <Link href={`/${locale}/about`} className="cursor-target">
              {t('about')}
            </Link>
            <Link href={`/${locale}/contact`} className="cursor-target">
              {t('contact')}
            </Link>
          </nav>
          <nav>
            <div className="grid grid-flow-col gap-4">
              {/* biome-ignore lint/a11y/useValidAnchor: Social media placeholder links */}
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              {/* biome-ignore lint/a11y/useValidAnchor: Social media placeholder links */}
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
              {/* biome-ignore lint/a11y/useValidAnchor: Social media placeholder links */}
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </nav>
          <aside>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
              <p>Copyright © {new Date().getFullYear()} 湘ICP备2023003507号</p>
            </a>
          </aside>
        </footer>
      </HideInAigc>
    </NextIntlClientProvider>
  )
}
