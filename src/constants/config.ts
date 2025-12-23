/**
 * 应用全局配置
 */

export const APP_CONFIG = {
  // 网站信息
  SITE_NAME: 'chenmuyu - iaxixi.com',
  SITE_URL: 'https://www.iaxixi.com',
  SITE_DESCRIPTION: 'chenmuyu的个人网站，分享技术、生活和个人见解',
  AUTHOR: 'chenmuyu',
  AUTHOR_EMAIL: '1732728869@qq.com',

  // 备案信息
  ICP_NUMBER: '湘ICP备2023003507号',

  // 社交链接
  SOCIAL: {
    GITHUB: 'https://github.com/SusieCmy',
    EMAIL: 'mailto:1732728869@qq.com',
  },

  // 分页配置
  PAGINATION: {
    POSTS_PER_PAGE: 10,
    PROJECTS_PER_PAGE: 9,
  },

  // 动画配置
  ANIMATION: {
    TYPING_SPEED: 50,
    SCROLL_THRESHOLD: 0.1,
  },

  // 主题配置
  THEME: {
    DEFAULT: 'light',
    STORAGE_KEY: 'theme-preference',
  },
}

/**
 * 环境变量配置
 */
export const ENV = {
  GA_ID: process.env.NEXT_PUBLIC_GA_ID || '',
  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || '',
  BAIDU_ANALYTICS_ID: process.env.NEXT_PUBLIC_BAIDU_ANALYTICS_ID || '',
  GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  BAIDU_SITE_VERIFICATION: process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION || '',
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
}

/**
 * API 配置
 */
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 秒
  RETRY_TIMES: 3,
  DEEPSEEK: {
    MODEL: 'deepseek-chat',
    MAX_TOKENS: 2000,
  },
}
