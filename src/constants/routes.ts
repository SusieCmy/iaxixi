/**
 * 应用路由常量
 * 集中管理所有路由路径，避免硬编码
 */

export const ROUTES = {
  // 主要页面
  INDEX: '/',
  HOME: '/home',
  ABOUT: '/about',
  CONTACT: '/contact',
  PROJECTS: '/projects',

  // 博客相关
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,

  // 功能页面
  DASHBOARD: '/dashboard',
  DIALOGUE: '/dialogue',
  DIALOGUE_WORKFLOW: (workflowId: string) => `/dialogue/${workflowId}`,

  // AIGC 相关
  AIGC: '/aigc',
  AIGC_WORKFLOW: (workflowId: string) => `/aigc/${workflowId}`,

  // API 端点
  API: {
    CHAT_DEEPSEEK: '/api/chat/deepseek',
    JUEJIN_QUERY: '/api/juejin/query_list',
  },
}

/**
 * 外部链接
 */
export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com/SusieCmy',
  EMAIL: 'mailto:1732728869@qq.com',
  ICP: 'https://beian.miit.gov.cn/',
}

/**
 * 导航菜单配置
 */
export const NAV_ITEMS = [
  { label: '首页', href: ROUTES.HOME },
  { label: '关于', href: ROUTES.ABOUT },
  { label: '博客', href: ROUTES.BLOG },
  { label: '项目', href: ROUTES.PROJECTS },
  { label: '联系', href: ROUTES.CONTACT },
]
