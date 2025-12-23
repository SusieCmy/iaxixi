/*
 * @Date: 2025-07-07 10:29:58
 * @Description: Root layout - 全局布局配置
 */

import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import ThemeProvider from '@/components/theme/ThemeProvider'
import { ENV } from '@/constants/config'
import QueryProvider from '@/providers/query-provider'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.iaxixi.com'),
  openGraph: {
    type: 'website',
    url: 'https://www.iaxixi.com',
    siteName: 'iaxixi - chenmuyu',
    images: [
      {
        url: '/cmy.jpg',
        width: 1200,
        height: 630,
        alt: 'chenmuyu - iaxixi.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/cmy.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: ENV.GOOGLE_SITE_VERIFICATION,
    other: {
      'baidu-site-verification': ENV.BAIDU_SITE_VERIFICATION,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const getBdAnalyticsTag = () => {
    return {
      __html: `
        var _hmt = _hmt || [];
        (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?${ENV.BAIDU_ANALYTICS_ID}";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
      `,
    }
  }

  return (
    <html lang="zh" suppressHydrationWarning>
      <GoogleTagManager gtmId={ENV.GTM_ID} />
      <Script id="baidu-analytics" dangerouslySetInnerHTML={getBdAnalyticsTag()} />
      <body className="font-sans antialiased">
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={ENV.GA_ID} />
    </html>
  )
}
