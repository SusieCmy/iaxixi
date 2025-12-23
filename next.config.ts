/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-07-19 19:16:04
 * @LastEditors: Susie 1732728869@qq.com
 * @LastEditTime: 2025-12-17
 * @FilePath: \susie-cmy\next.config.ts
 * @Description: Next.js 配置 - 集成国际化
 *
 * Copyright (c) 2025 by 1732728869@qq.com, All Rights Reserved.
 */
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // // 静态导出配置
  // output: 'export',

  // // 图片优化配置（静态导出必需）
  // images: {
  //   unoptimized: true,
  // },

  // Turbopack 配置
  turbopack: {
    root: __dirname,
  },

  // 实验性配置
  experimental: {
    // 静态生成优化
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 1, // 降低并发数避免 Windows spawn 错误
    staticGenerationMinPagesPerWorker: 25,
  },

  // 构建ID配置（使用版本号以便更好地利用缓存）
  generateBuildId: async () => {
    return 'v0.1.0'
  },

  // 编译配置
  compiler: {
    // 移除 console.log（生产环境）
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default withNextIntl(nextConfig)
