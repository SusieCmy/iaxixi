/*
 * @Date: 2025-12-15
 * @Description: 全局动画工具库 - 基于 Anime.js
 */

import { animate, utils } from 'animejs'

/**
 * Anime.js 动画配置类型
 * 支持常用的动画属性和配置
 */
export interface AnimationConfig {
  /** 透明度动画 [起始值, 结束值] */
  opacity?: [number, number]

  /** Y轴位移动画 [起始值, 结束值] */
  translateY?: [number, number]

  /** X轴位移动画 [起始值, 结束值] */
  translateX?: [number, number]

  /** 缩放动画 [起始值, 结束值] */
  scale?: [number, number]

  /** 旋转动画 [起始值, 结束值]，单位：度 */
  rotate?: [number, number]

  /**
   * 延迟时间（毫秒）
   * 可以是固定值或基于索引的函数
   */
  delay?: number | ((target: any, index: number) => number)

  /** 动画持续时间（毫秒） */
  duration?: number

  /**
   * 缓动函数
   * 可选值：'linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad',
   *        'easeInCubic', 'easeOutCubic', 'easeInOutCubic',
   *        'easeInQuart', 'easeOutQuart', 'easeInOutQuart',
   *        'easeInQuint', 'easeOutQuint', 'easeInOutQuint',
   *        'easeInExpo', 'easeOutExpo', 'easeInOutExpo',
   *        'easeInCirc', 'easeOutCirc', 'easeInOutCirc',
   *        'easeInBack', 'easeOutBack', 'easeInOutBack',
   *        'easeInElastic', 'easeOutElastic', 'easeInOutElastic',
   *        'easeInBounce', 'easeOutBounce', 'easeInOutBounce',
   *        'spring(mass, stiffness, damping, velocity)'
   */
  ease?: string

  /** 循环次数 */
  loop?: number | boolean

  /** 动画方向：'normal' | 'reverse' | 'alternate' */
  direction?: 'normal' | 'reverse' | 'alternate'

  /** 自动播放 */
  autoplay?: boolean
}

/**
 * 通用元素动画函数
 *
 * @param selector - CSS选择器字符串
 * @param config - 动画配置对象
 *
 * @example
 * ```tsx
 * // 基础用法
 * animateElements('.card', {
 *   translateY: [20, 0],
 *   duration: 600,
 *   ease: 'outExpo'
 * })
 *
 * // 使用索引延迟
 * animateElements('.item', {
 *   scale: [0.8, 1],
 *   delay: (_, i) => i * 100,
 *   duration: 500,
 *   ease: 'outBack'
 * })
 *
 * // 弹簧动画
 * animateElements('.menu-item', {
 *   translateY: [20, 0],
 *   ease: 'spring(1, 80, 10, 0)',
 *   duration: 700
 * })
 * ```
 */
export const animateElements = (selector: string, config: AnimationConfig): void => {
  const elements = utils.$(selector)

  if (!elements || elements.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[animateElements] No elements found for selector: ${selector}`)
    }
    return
  }

  // 默认配置
  const defaultConfig = {
    opacity: [0, 1] as [number, number],
  }

  // 合并配置
  const finalConfig = {
    ...defaultConfig,
    ...config,
  }

  // 执行动画
  animate(elements, finalConfig as any)
}

/**
 * 预设动画配置
 * 提供常用的动画效果配置
 */
export const AnimationPresets = {
  /** 淡入 + 上滑 */
  fadeInUp: (delay = 0): AnimationConfig => ({
    translateY: [40, 0],
    delay,
    duration: 800,
    ease: 'outExpo',
  }),

  /** 淡入 + 下滑 */
  fadeInDown: (delay = 0): AnimationConfig => ({
    translateY: [-40, 0],
    delay,
    duration: 800,
    ease: 'outExpo',
  }),

  /** 淡入 + 左滑 */
  fadeInLeft: (delay = 0): AnimationConfig => ({
    translateX: [-40, 0],
    delay,
    duration: 800,
    ease: 'outExpo',
  }),

  /** 淡入 + 右滑 */
  fadeInRight: (delay = 0): AnimationConfig => ({
    translateX: [40, 0],
    delay,
    duration: 800,
    ease: 'outExpo',
  }),

  /** 淡入 + 缩放 */
  fadeInScale: (delay = 0): AnimationConfig => ({
    scale: [0.8, 1],
    delay,
    duration: 600,
    ease: 'outBack',
  }),

  /** 弹跳进入 */
  bounceIn: (delay = 0): AnimationConfig => ({
    translateY: [20, 0],
    delay,
    duration: 700,
    ease: 'spring(1, 80, 10, 0)',
  }),

  /** 弹性缩放 */
  elasticScale: (delay = 0): AnimationConfig => ({
    scale: [0, 1],
    delay,
    duration: 800,
    ease: 'easeOutElastic',
  }),

  /** 旋转淡入 */
  rotateIn: (delay = 0): AnimationConfig => ({
    rotate: [-180, 0],
    scale: [0.5, 1],
    delay,
    duration: 600,
    ease: 'outBack',
  }),
}

/**
 * 批量延迟动画辅助函数
 *
 * @param baseDelay - 基础延迟时间（毫秒）
 * @param step - 每个元素递增的延迟时间（毫秒）
 * @returns 延迟函数
 *
 * @example
 * ```tsx
 * animateElements('.item', {
 *   ...AnimationPresets.fadeInUp(),
 *   delay: staggerDelay(0, 100) // 0ms, 100ms, 200ms, 300ms...
 * })
 * ```
 */
export const staggerDelay = (baseDelay: number, step: number) => {
  return (_: Element, index: number) => baseDelay + index * step
}

/**
 * 创建序列动画
 * 按顺序执行多个动画
 *
 * @param animations - 动画配置数组
 *
 * @example
 * ```tsx
 * createSequence([
 *   { selector: '.header', config: AnimationPresets.fadeInDown() },
 *   { selector: '.content', config: AnimationPresets.fadeInUp(200) },
 *   { selector: '.footer', config: AnimationPresets.fadeInScale(400) },
 * ])
 * ```
 */
export const createSequence = (
  animations: Array<{ selector: string; config: AnimationConfig }>
): void => {
  animations.forEach(({ selector, config }) => {
    animateElements(selector, config)
  })
}
