/**
 * classnames 工具函数
 * 用于条件性地组合 className
 */

import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 Tailwind CSS 类名
 * 自动处理冲突的类名（如 px-2 和 px-4）
 *
 * @example
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500') // 根据条件返回
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
