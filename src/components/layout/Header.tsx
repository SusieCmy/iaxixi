/*
 * @Date: 2025-07-07
 * @Description: 日系简约风格 Header - 带 SVG 描边动画
 */

'use client'
import { motion } from 'motion/react'
import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-50 mx-auto flex min-h-14 max-w-screen-2xl items-center justify-between gap-4 border-(--jp-mist) border-b bg-(--jp-cream)/90 px-6 backdrop-blur-sm"
    >
      <div className="flex h-full shrink-0 items-center">
        <Link href={'/'} title="chenmuyu" className="group">
          <div className="w-48">
            <svg viewBox="0 0 500 100">
              <g
                stroke="var(--jp-ink)"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="6"
              >
                {/* C */}
                <motion.path
                  d="M30 30 Q10 30 10 50 Q10 70 30 70"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                    delay: 0,
                  }}
                />
                {/* H */}
                <motion.path
                  d="M45 30 L45 70 M60 30 L60 70 M45 50 L60 50"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                    delay: 0.1,
                  }}
                />
                {/* E */}
                <motion.path
                  d="M75 30 L75 70 M75 30 L90 30 M75 50 L87 50 M75 70 L90 70"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                    delay: 0.2,
                  }}
                />
                {/* N */}
                <motion.path
                  d="M105 70 L105 30 L120 70 L120 30"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                    delay: 0.3,
                  }}
                />
                {/* M */}
                <motion.path
                  d="M135 70 L135 30 L145 50 L155 30 L155 70"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                    delay: 0.4,
                  }}
                />
                {/* U */}
                <motion.path
                  d="M170 30 L170 60 Q170 70 180 70 Q190 70 190 60 L190 30"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                />
                {/* Y */}
                <motion.path
                  d="M205 30 L215 50 L225 30 M215 50 L215 70"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                    delay: 0.6,
                  }}
                />
                {/* U */}
                <motion.path
                  d="M240 30 L240 60 Q240 70 250 70 Q260 70 260 60 L260 30"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                    delay: 0.7,
                  }}
                />
              </g>
            </svg>
          </div>
        </Link>
      </div>

      <Navigation />
    </motion.div>
  )
}
