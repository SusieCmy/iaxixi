# 动画工具库使用指南

## 简介

`src/lib/animations.ts` 提供了基于 Anime.js 的统一动画工具函数，用于简化和标准化项目中的动画实现。

## 基础用法

### 1. 导入函数

```typescript
import { animateElements, staggerDelay, AnimationPresets } from '@/lib/animations'
```

### 2. 基础动画

```typescript
// 简单的淡入上滑动画
animateElements('.card', {
  translateY: [20, 0],
  duration: 600,
  ease: 'outExpo'
})
```

### 3. 使用延迟函数

```typescript
// 交错动画效果
animateElements('.item', {
  translateY: [20, 0],
  delay: staggerDelay(0, 100), // 每个元素延迟 100ms
  duration: 600,
  ease: 'outBack'
})
```

### 4. 使用预设动画

```typescript
// 淡入上滑
animateElements('.header', AnimationPresets.fadeInUp(200))

// 淡入缩放
animateElements('.button', AnimationPresets.fadeInScale(300))

// 弹跳进入
animateElements('.menu-item', AnimationPresets.bounceIn())
```

## 完整示例

### 导航菜单动画

```typescript
import { useEffect } from 'react'
import { animateElements, staggerDelay } from '@/lib/animations'

export default function Navigation() {
  useEffect(() => {
    // 菜单项弹跳进入
    animateElements('.nav-menu-item', {
      translateY: [20, 0],
      delay: staggerDelay(0, 60),
      duration: 700,
      ease: 'spring(1, 80, 10, 0)'
    })
  }, [])

  return (
    <nav>
      <div className="nav-menu-item">首页</div>
      <div className="nav-menu-item">关于</div>
      <div className="nav-menu-item">博客</div>
    </nav>
  )
}
```

### 个人信息页动画

```typescript
import { useEffect } from 'react'
import { animateElements, staggerDelay } from '@/lib/animations'

export default function UserInfo() {
  useEffect(() => {
    // 卡片淡入上滑
    animateElements('.info-card', {
      translateY: [40, 0],
      delay: staggerDelay(0, 100),
      duration: 800,
      ease: 'outExpo'
    })

    // 统计项缩放进入
    animateElements('.stat-item', {
      scale: [0.8, 1],
      delay: staggerDelay(400, 80),
      duration: 600,
      ease: 'outBack'
    })

    // 技术标签交错进入
    animateElements('.tech-tag', {
      scale: [0.8, 1],
      delay: staggerDelay(800, 20),
      duration: 400,
      ease: 'outBack'
    })
  }, [])

  return (
    <div>
      <div className="info-card">个人信息</div>
      <div className="stat-item">统计数据</div>
      <div className="tech-tag">React</div>
      <div className="tech-tag">TypeScript</div>
    </div>
  )
}
```

## API 参考

### animateElements

执行元素动画的主函数。

**签名：**
```typescript
animateElements(selector: string, config: AnimationConfig): void
```

**参数：**
- `selector`: CSS 选择器字符串
- `config`: 动画配置对象

**AnimationConfig 选项：**
```typescript
interface AnimationConfig {
  opacity?: [number, number]        // 透明度 [起始, 结束]
  translateY?: [number, number]     // Y轴位移 [起始, 结束]
  translateX?: [number, number]     // X轴位移 [起始, 结束]
  scale?: [number, number]          // 缩放 [起始, 结束]
  rotate?: [number, number]         // 旋转角度 [起始, 结束]
  delay?: number | Function         // 延迟（毫秒）
  duration?: number                 // 持续时间（毫秒）
  ease?: string                     // 缓动函数
  loop?: number | boolean           // 循环次数
  direction?: 'normal' | 'reverse' | 'alternate'
  autoplay?: boolean                // 自动播放
}
```

### staggerDelay

创建交错延迟效果。

**签名：**
```typescript
staggerDelay(baseDelay: number, step: number): Function
```

**参数：**
- `baseDelay`: 基础延迟时间（毫秒）
- `step`: 每个元素递增的延迟时间（毫秒）

**示例：**
```typescript
// 第1个元素延迟 0ms，第2个延迟 100ms，第3个延迟 200ms...
delay: staggerDelay(0, 100)

// 第1个元素延迟 500ms，第2个延迟 550ms，第3个延迟 600ms...
delay: staggerDelay(500, 50)
```

### AnimationPresets

预设的常用动画配置。

**可用预设：**
```typescript
AnimationPresets.fadeInUp(delay)      // 淡入 + 上滑
AnimationPresets.fadeInDown(delay)    // 淡入 + 下滑
AnimationPresets.fadeInLeft(delay)    // 淡入 + 左滑
AnimationPresets.fadeInRight(delay)   // 淡入 + 右滑
AnimationPresets.fadeInScale(delay)   // 淡入 + 缩放
AnimationPresets.bounceIn(delay)      // 弹跳进入
AnimationPresets.elasticScale(delay)  // 弹性缩放
AnimationPresets.rotateIn(delay)      // 旋转淡入
```

## 缓动函数参考

### 常用缓动
- `linear` - 线性
- `outExpo` - 指数缓出（快速淡入）
- `outBack` - 回弹缓出（超过终点再返回）
- `outQuad` - 二次缓出
- `outCubic` - 三次缓出

### 弹簧缓动
```typescript
ease: 'spring(mass, stiffness, damping, velocity)'

// 示例：轻盈弹跳
ease: 'spring(1, 80, 10, 0)'
```

**参数说明：**
- `mass`: 质量（默认 1）
- `stiffness`: 刚度（默认 100）
- `damping`: 阻尼（默认 10）
- `velocity`: 初速度（默认 0）

## 最佳实践

### 1. 性能优化

```typescript
// ✅ 好：只在组件挂载时执行一次
useEffect(() => {
  animateElements('.item', config)
}, [])

// ❌ 差：每次渲染都执行
useEffect(() => {
  animateElements('.item', config)
}) // 缺少依赖数组
```

### 2. 动画时序

```typescript
// 建议的动画时序层级
useEffect(() => {
  // 第一层：主要内容（0ms 开始）
  animateElements('.main-card', {
    translateY: [40, 0],
    delay: staggerDelay(0, 100),
    duration: 800,
    ease: 'outExpo'
  })

  // 第二层：次要内容（400ms 开始）
  animateElements('.secondary', {
    scale: [0.8, 1],
    delay: staggerDelay(400, 80),
    duration: 600,
    ease: 'outBack'
  })

  // 第三层：细节元素（800ms 开始）
  animateElements('.detail', {
    scale: [0.8, 1],
    delay: staggerDelay(800, 20),
    duration: 400,
    ease: 'outBack'
  })
}, [])
```

### 3. 条件动画

```typescript
useEffect(() => {
  if (isOpen) {
    animateElements('.modal-content', {
      translateY: [30, 0],
      delay: staggerDelay(0, 50),
      duration: 600,
      ease: 'spring(1, 80, 10, 0)'
    })
  }
}, [isOpen])
```

## 迁移指南

### 从本地动画函数迁移

**迁移前：**
```typescript
import { animate, utils } from 'animejs'

const animateElements = (selector, config) => {
  const elements = utils.$(selector)
  if (elements && elements.length > 0) {
    animate(elements, {
      opacity: [0, 1],
      ...config
    })
  }
}

animateElements('.item', {
  translateY: [20, 0],
  delay: (_, i) => i * 100,
  duration: 600,
  ease: 'outExpo'
})
```

**迁移后：**
```typescript
import { animateElements, staggerDelay } from '@/lib/animations'

animateElements('.item', {
  translateY: [20, 0],
  delay: staggerDelay(0, 100),
  duration: 600,
  ease: 'outExpo'
})
```

## 故障排除

### 动画不生效

1. **检查选择器是否正确**
   ```typescript
   // 确保元素已渲染到 DOM
   useEffect(() => {
     setTimeout(() => {
       animateElements('.my-element', config)
     }, 0)
   }, [])
   ```

2. **检查元素初始样式**
   ```css
   /* 确保元素有初始的 opacity: 0 */
   .my-element {
     opacity: 0;
   }
   ```

3. **查看开发环境警告**
   ```typescript
   // 开发环境会提示未找到元素
   // [animateElements] No elements found for selector: .my-element
   ```

### 动画冲突

```typescript
// ❌ 避免在同一个 useEffect 中对同一元素应用多次动画
useEffect(() => {
  animateElements('.item', config1)
  animateElements('.item', config2) // 会覆盖 config1
}, [])

// ✅ 使用序列或合并配置
useEffect(() => {
  animateElements('.item', {
    ...config1,
    ...config2
  })
}, [])
```
