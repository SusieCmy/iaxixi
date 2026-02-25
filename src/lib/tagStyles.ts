/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-08-20 20:25:12
 * @LastEditors: Susie 1732728869@qq.com
 * @LastEditTime: 2025-08-20 20:35:03
 * @FilePath: \susie-cmy\src\lib\tagStyles.ts
 * @Description: 强者都是孤独的
 *
 * Copyright (c) 2025 by 1732728869@qq.com, All Rights Reserved.
 */
// Tag样式枚举 - 使用DaisyUI语义化颜色
export const getTagStyle = (tag: string): string => {
  const tagLower = tag.toLowerCase()

  const tagStyles: Record<string, string> = {
    javascript: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    js: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    typescript: 'bg-blue-100 text-blue-800 border border-blue-200',
    ts: 'bg-blue-100 text-blue-800 border border-blue-200',
    react: 'bg-cyan-100 text-cyan-800 border border-cyan-200',
    vue: 'bg-green-100 text-green-800 border border-green-200',
    angular: 'bg-red-100 text-red-800 border border-red-200',
    'next.js': 'bg-gray-100 text-gray-800 border border-gray-200',
    nextjs: 'bg-gray-100 text-gray-800 border border-gray-200',
    'nest.js': 'bg-red-100 text-red-800 border border-red-200',
    nestjs: 'bg-red-100 text-red-800 border border-red-200',
    'node.js': 'bg-green-100 text-green-800 border border-green-200',
    nodejs: 'bg-green-100 text-green-800 border border-green-200',
    express: 'bg-gray-100 text-gray-800 border border-gray-200',
    hook: 'bg-purple-100 text-purple-800 border border-purple-200',
    hooks: 'bg-purple-100 text-purple-800 border border-purple-200',
    css: 'bg-blue-100 text-blue-800 border border-blue-200',
    html: 'bg-orange-100 text-orange-800 border border-orange-200',
    sass: 'bg-pink-100 text-pink-800 border border-pink-200',
    less: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    tailwindcss: 'bg-teal-100 text-teal-800 border border-teal-200',
    webpack: 'bg-blue-100 text-blue-800 border border-blue-200',
    vite: 'bg-purple-100 text-purple-800 border border-purple-200',
    git: 'bg-orange-100 text-orange-800 border border-orange-200',
    docker: 'bg-blue-100 text-blue-800 border border-blue-200',
    mongodb: 'bg-green-100 text-green-800 border border-green-200',
    mysql: 'bg-blue-100 text-blue-800 border border-blue-200',
    redis: 'bg-red-100 text-red-800 border border-red-200',
    graphql: 'bg-pink-100 text-pink-800 border border-pink-200',
    restapi: 'bg-green-100 text-green-800 border border-green-200',
    api: 'bg-green-100 text-green-800 border border-green-200',
    pwa: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    electron: 'bg-gray-100 text-gray-800 border border-gray-200',
    flutter: 'bg-blue-100 text-blue-800 border border-blue-200',
    reactnative: 'bg-cyan-100 text-cyan-800 border border-cyan-200',
    jest: 'bg-orange-100 text-orange-800 border border-orange-200',
    testing: 'bg-green-100 text-green-800 border border-green-200',
    performance: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    性能优化: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    tutorial: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    教程: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  }

  return tagStyles[tagLower] || 'bg-(--jp-mist)/50 text-(--jp-ink)/70 border border-(--jp-mist)'
}
