/*
 * @Date: 2026-02-05
 * @Description: 全局动画工具库 - 基于 Framer Motion
 */

import { animate } from 'motion'

/**
 * Motion 动画配置类型
 * 支持常用的动画属性和配置
 */
export interface AnimationConfig {
  /** 透明度动画 [起始值, 结束值] */
  opacity?: [number, number]

  /** Y轴位移动画 [起始值, 结束值] */
  translateY?: [number | string, number | string]

  /** X轴位移动画 [起始值, 结束值] */
  translateX?: [number | string, number | string]

  /** 缩放动画 [起始值, 结束值] */
  scale?: [number, number]

  /** 旋转动画 [起始值, 结束值]，单位：度 */
  rotate?: [number | string, number | string]

  /**
   * 延迟时间（秒）
   * 可以是固定值或基于索引的函数
   */
  delay?: number | ((target: Element, index: number) => number)

  /** 动画持续时间（秒） */
  duration?: number

  /**
   * 缓动函数
   * Motion 支持的缓动函数或自定义贝塞尔曲线
   */
  ease?: string | number[]

  /** 循环次数 */
  loop?: number | boolean

  /** 动画方向 */
  direction?: 'normal' | 'reverse' | 'alternate'

  /** 自动播放 */
  autoplay?: boolean
}

/**
 * 通用元素动画函数 - 使用 Motion
 *
 * @param selector - CSS选择器字符串
 * @param config - 动画配置对象
 *
 * @example
 * ```tsx
 * // 基础用法
 * animateElements('.card', {
 *   translateY: [20, 0],
 *   duration: 0.6,
 *   ease: 'easeOut'
 * })
 *
 * // 使用索引延迟
 * animateElements('.item', {
 *   scale: [0.8, 1],
 *   delay: (_, i) => i * 0.1,
 *   duration: 0.5
 * })
 * ```
 */
export const animateElements = (selector: string, config: AnimationConfig): void => {
  const elements = document.querySelectorAll(selector)

  if (!elements || elements.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[animateElements] No elements found for selector: ${selector}`)
    }
    return
  }

  // 默认配置
  const defaultConfig: AnimationConfig = {
    opacity: [0, 1],
    duration: 0.6,
    ease: 'easeOut',
  }

  // 合并配置
  const finalConfig = {
    ...defaultConfig,
    ...config,
  }

  // 为每个元素执行动画
  elements.forEach((element, index) => {
    const animationProps: Record<string, any> = {}

    // 处理各种动画属性
    if (finalConfig.opacity) {
      animationProps.opacity = finalConfig.opacity
    }
    if (finalConfig.translateY) {
      animationProps.y = finalConfig.translateY
    }
    if (finalConfig.translateX) {
      animationProps.x = finalConfig.translateX
    }
    if (finalConfig.scale) {
      animationProps.scale = finalConfig.scale
    }
    if (finalConfig.rotate) {
      animationProps.rotate = finalConfig.rotate
    }

    // 计算延迟
    const delay =
      typeof finalConfig.delay === 'function'
        ? finalConfig.delay(element, index)
        : finalConfig.delay || 0

    // 执行动画
    const options: any = {
      duration: finalConfig.duration || 0.6,
      delay,
      repeat:
        finalConfig.loop === true
          ? Number.POSITIVE_INFINITY
          : typeof finalConfig.loop === 'number'
            ? finalConfig.loop
            : 0,
    }

    if (finalConfig.ease) {
      options.easing = finalConfig.ease
    }

    animate(element, animationProps, options)
  })
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
    duration: 0.8,
    ease: 'easeOut',
  }),

  /** 淡入 + 下滑 */
  fadeInDown: (delay = 0): AnimationConfig => ({
    translateY: [-40, 0],
    delay,
    duration: 0.8,
    ease: 'easeOut',
  }),

  /** 淡入 + 左滑 */
  fadeInLeft: (delay = 0): AnimationConfig => ({
    translateX: [-40, 0],
    delay,
    duration: 0.8,
    ease: 'easeOut',
  }),

  /** 淡入 + 右滑 */
  fadeInRight: (delay = 0): AnimationConfig => ({
    translateX: [40, 0],
    delay,
    duration: 0.8,
    ease: 'easeOut',
  }),

  /** 淡入 + 缩放 */
  fadeInScale: (delay = 0): AnimationConfig => ({
    scale: [0.8, 1],
    delay,
    duration: 0.6,
    ease: [0.34, 1.56, 0.64, 1], // easeOutBack
  }),

  /** 弹跳进入 */
  bounceIn: (delay = 0): AnimationConfig => ({
    translateY: [20, 0],
    delay,
    duration: 0.7,
    ease: [0.68, -0.55, 0.265, 1.55], // spring-like
  }),

  /** 弹性缩放 */
  elasticScale: (delay = 0): AnimationConfig => ({
    scale: [0, 1],
    delay,
    duration: 0.8,
    ease: [0.68, -0.55, 0.265, 1.55],
  }),

  /** 旋转淡入 */
  rotateIn: (delay = 0): AnimationConfig => ({
    rotate: [-180, 0],
    scale: [0.5, 1],
    delay,
    duration: 0.6,
    ease: [0.34, 1.56, 0.64, 1],
  }),
}

/**
 * 批量延迟动画辅助函数
 *
 * @param baseDelay - 基础延迟时间（秒）
 * @param step - 每个元素递增的延迟时间（秒）
 * @returns 延迟函数
 *
 * @example
 * ```tsx
 * animateElements('.item', {
 *   ...AnimationPresets.fadeInUp(),
 *   delay: staggerDelay(0, 0.1) // 0s, 0.1s, 0.2s, 0.3s...
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
 *   { selector: '.content', config: AnimationPresets.fadeInUp(0.2) },
 *   { selector: '.footer', config: AnimationPresets.fadeInScale(0.4) },
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
