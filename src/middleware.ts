import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // 匹配所有路径除了 api, _next, _vercel 和静态文件
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
