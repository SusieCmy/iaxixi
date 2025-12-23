/*
 * @Date: 2025-12-17
 * @Description: 根页面 - 重定向到默认语言
 */
import { redirect } from 'next/navigation'

export default function RootPage() {
  // 重定向到默认语言(中文)
  redirect('/zh')
}
