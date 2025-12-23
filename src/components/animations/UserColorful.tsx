/*
 * @Date: 2025-07-25 08:32:47
 * @LastEditors: cmy && 1732728869@qq.com
 * @LastEditTime: 2025-07-25 09:29:36
 * @FilePath: \susie-cmy\src\components\Animation\UserColorful.tsx
 * @Description: 强者都是孤独的
 */
import type { ReactNode } from 'react'

interface GradientTextProps {
  children: ReactNode
  className?: string
  colors?: string[]
  animationSpeed?: number
  showBorder?: boolean
}

export default function GradientText({
  children,
  className = '',
  colors = ['#ffaa40', '#9c40ff', '#ffaa40'],
  animationSpeed = 3,
  showBorder = false,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
    backgroundSize: '400% 100%',
    animation: `gradientMove ${animationSpeed}s ease-in-out infinite`,
  }

  return (
    <div
      className={`relative flex max-w-fit cursor-pointer flex-row items-center justify-center overflow-hidden rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 ${className}`}
    >
      {showBorder && (
        <div className="pointer-events-none absolute inset-0 z-0 bg-cover" style={gradientStyle}>
          <div
            className="absolute inset-0 z-[-1] rounded-[1.25rem] bg-black"
            style={{
              width: 'calc(100% - 2px)',
              height: 'calc(100% - 2px)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      )}
      <div
        className="relative z-2 inline-block bg-cover text-transparent"
        style={{
          ...gradientStyle,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
        }}
      >
        {children}
      </div>
    </div>
  )
}
