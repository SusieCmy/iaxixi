/*
 * @Date: 2025-12-09
 * @LastEditors: Claude Code
 * @Description: 现代化个人信息组件 - 优化版
 */
'use client'

import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Code2,
  Coffee,
  ExternalLink,
  Github,
  Heart,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import UserTextClone from '@/components/animations/UserTextClone'
import TextType from '@/components/ui/TextType'
import { EXTERNAL_LINKS, ROUTES } from '@/constants/routes'
import analytics from '@/lib/analytics'
import { animateElements, staggerDelay } from '@/lib/animations'
import { getTagStyle } from '@/lib/tagStyles'

// 技术栈配置
const techStack = {
  frontend: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Next.js'],
  styling: ['Tailwind CSS', 'CSS3', 'SCSS', 'DaisyUI'],
  tools: ['Git', 'Vite', 'Webpack', 'npm', 'pnpm'],
  others: ['Node.js', 'GSAP', 'Anime.js', 'Zustand'],
}

// 社交链接
const socialLinks = [
  {
    icon: Github,
    label: 'GitHub',
    href: EXTERNAL_LINKS.GITHUB,
  },
  {
    icon: Mail,
    label: 'Email',
    href: EXTERNAL_LINKS.EMAIL,
  },
]

const UserInfoPage = () => {
  const t = useTranslations('userInfo')
  const containerRef = useRef<HTMLDivElement>(null)

  // 统计数据
  const stats = [
    {
      icon: Code2,
      label: t('stats.projectExperience'),
      value: t('stats.projectsValue'),
      iconColor: 'text-blue-500',
    },
    {
      icon: BookOpen,
      label: t('stats.techArticles'),
      value: t('stats.articlesValue'),
      iconColor: 'text-green-500',
    },
    {
      icon: Award,
      label: t('stats.openSource'),
      value: t('stats.openSourceValue'),
      iconColor: 'text-purple-500',
    },
    {
      icon: Coffee,
      label: t('stats.codeLines'),
      value: t('stats.codeLinesValue'),
      iconColor: 'text-orange-500',
    },
  ]

  // 入场动画
  useEffect(() => {
    // 信息卡片
    animateElements('.info-card', {
      translateY: [40, 0],
      delay: staggerDelay(0, 100),
      duration: 800,
      ease: 'outExpo',
    })

    // 统计项
    animateElements('.stat-item', {
      scale: [0.8, 1],
      delay: staggerDelay(400, 80),
      duration: 600,
      ease: 'outBack',
    })

    // 技术栈分类卡片
    animateElements('.tech-category', {
      translateY: [30, 0],
      scale: [0.95, 1],
      delay: staggerDelay(600, 80),
      duration: 600,
      ease: 'outExpo',
    })

    // 技术标签
    animateElements('.tech-tag', {
      scale: [0.8, 1],
      delay: staggerDelay(800, 20),
      duration: 400,
      ease: 'outBack',
    })

    // 学习中的技术区域
    animateElements('.learning-section', {
      translateY: [20, 0],
      delay: 1000,
      duration: 600,
      ease: 'outExpo',
    })

    // 学习中的技术标签
    animateElements('.learning-tag', {
      scale: [0.9, 1],
      delay: staggerDelay(1200, 100),
      duration: 500,
      ease: 'outBack',
    })
  }, [])

  return (
    <div ref={containerRef} className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* 主要信息区域 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 左侧：个人介绍卡片 */}
        <div className="lg:col-span-2">
          <div className="info-card h-full rounded-2xl border border-base-300 bg-base-100 p-6 opacity-0 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:items-start">
              {/* 头像 */}
              <div className="group relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
                <Image
                  src="/chenmuyu.png"
                  alt={t('name')}
                  priority
                  width={140}
                  height={140}
                  className="relative z-10 rounded-2xl shadow-md ring-2 ring-base-300 transition-all duration-300 group-hover:ring-primary/50"
                />
                <div className="-bottom-1 -right-1 absolute z-20 h-5 w-5 animate-pulse rounded-full border-3 border-base-100 bg-green-500" />
              </div>

              {/* 个人信息 */}
              <div className="flex-1 text-center md:text-left">
                <h1
                  className="mb-2 font-bold text-3xl text-base-content transition-colors hover:text-primary sm:text-4xl"
                  onClick={() => analytics.clickUserName()}
                >
                  <p>{t('name')}</p>
                </h1>
                <p className="mb-4 font-medium text-base text-base-content/70 sm:text-lg">
                  {t('position')}
                </p>

                {/* 标签 */}
                <div className="mb-5 flex flex-wrap justify-center gap-2 md:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 font-medium text-primary text-sm transition-colors hover:bg-primary/20">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t('tags.webDeveloper')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/10 px-3 py-1.5 font-medium text-secondary text-sm transition-colors hover:bg-secondary/20">
                    <Code2 className="h-3.5 w-3.5" />
                    {t('tags.fullStack')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 font-medium text-accent text-sm transition-colors hover:bg-accent/20">
                    <Heart className="h-3.5 w-3.5" />
                    {t('tags.openSource')}
                  </span>
                </div>

                {/* 位置和时间 */}
                <div className="mb-5 flex flex-wrap justify-center gap-4 text-base-content/60 text-sm md:justify-start">
                  <div className="flex items-center gap-1.5 transition-colors hover:text-base-content">
                    <MapPin className="h-4 w-4" />
                    <span>{t('location')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 transition-colors hover:text-base-content">
                    <Calendar className="h-4 w-4" />
                    <span>{t('timeline')}</span>
                  </div>
                </div>

                {/* 社交链接 */}
                <div className="flex justify-center gap-2 md:justify-start">
                  {socialLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="transform rounded-lg bg-base-200 p-2.5 transition-all duration-200 hover:scale-110 hover:bg-primary/10 hover:text-primary"
                        title={link.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => analytics.clickSocialLink(link.label)}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 个人简介 */}
            <div className="mt-6 border-base-300 border-t pt-6 sm:mt-8 sm:pt-8">
              <h2 className="mb-3 flex items-center gap-2 font-semibold text-base-content text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                {t('aboutTitle')}
              </h2>
              <div className="text-base-content/70 text-sm leading-relaxed sm:text-base">
                <TextType
                  text={[t('introduction')]}
                  typingSpeed={50}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="|"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：统计数据卡片 */}
        <div className="lg:col-span-1">
          <div className="info-card flex h-full flex-col rounded-2xl border border-base-300 bg-base-100 p-6 opacity-0 shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2
              className="mb-6 flex items-center gap-2 font-semibold text-xl"
              onClick={() => analytics.viewStats()}
            >
              <Award className="h-5 w-5 text-primary" />
              <UserTextClone propsText={t('stats.title')} />
            </h2>

            <div className="grid flex-1 grid-cols-2 gap-3">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="stat-item group rounded-xl bg-gradient-to-br from-base-200/50 to-base-200/30 p-4 opacity-0 transition-all duration-200 hover:from-base-200 hover:to-base-200/70"
                  >
                    <Icon
                      className={`mb-2 h-5 w-5 ${stat.iconColor} transition-transform group-hover:scale-110`}
                    />
                    <div className="mb-1 font-bold text-base-content text-xl sm:text-2xl">
                      {stat.value}
                    </div>
                    <div className="text-base-content/60 text-xs">{stat.label}</div>
                  </div>
                )
              })}
            </div>

            {/* 快速链接 */}
            <div className="mt-6 border-base-300 border-t pt-6">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-base-content/70 text-sm">
                <ExternalLink className="h-4 w-4" />
                {t('quickAccess.title')}
              </h3>
              <div className="space-y-2">
                <Link
                  href={ROUTES.BLOG}
                  className="group/link flex items-center justify-between rounded-lg border border-transparent bg-base-200/50 p-3 transition-all duration-200 hover:border-primary/20 hover:bg-primary/10"
                  onClick={() => analytics.navigateToBlog()}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{t('quickAccess.blog')}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover/link:opacity-100" />
                </Link>

                <Link
                  href={ROUTES.PROJECTS}
                  className="group/link flex items-center justify-between rounded-lg border border-transparent bg-base-200/50 p-3 transition-all duration-200 hover:border-secondary/20 hover:bg-secondary/10"
                  onClick={() => analytics.navigateToProjects()}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-secondary" />
                    <span className="font-medium text-sm">{t('quickAccess.projects')}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-secondary opacity-0 transition-opacity group-hover/link:opacity-100" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 技术栈区域 */}
      <div className="info-card overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-6 opacity-0 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
        {/* 背景装饰 */}
        <div className="-z-10 absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 blur-3xl" />

        <div className="relative">
          <h2 className="mb-6 flex items-center gap-2 font-semibold text-xl">
            <Code2 className="h-5 w-5 text-primary" />
            <UserTextClone propsText={t('techStack.title')} />
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Object.entries(techStack).map(([category, techs]) => {
              const categoryConfig = {
                frontend: {
                  icon: Code2,
                  label: t('techStack.frontend'),
                  color: 'primary',
                  bgGradient: 'from-blue-500/10 to-cyan-500/10',
                },
                styling: {
                  icon: Sparkles,
                  label: t('techStack.styling'),
                  color: 'secondary',
                  bgGradient: 'from-purple-500/10 to-pink-500/10',
                },
                tools: {
                  icon: Briefcase,
                  label: t('techStack.tools'),
                  color: 'accent',
                  bgGradient: 'from-orange-500/10 to-yellow-500/10',
                },
                others: {
                  icon: Award,
                  label: t('techStack.others'),
                  color: 'text-purple-500',
                  bgGradient: 'from-indigo-500/10 to-violet-500/10',
                },
              }

              const config = categoryConfig[category as keyof typeof categoryConfig]
              const Icon = config.icon

              return (
                <div
                  key={category}
                  className={`tech-category group rounded-xl border border-base-300 bg-gradient-to-br p-5 ${config.bgGradient} hover:border-${config.color}/30 opacity-0 transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <div
                      className={`rounded-lg bg-base-100 p-2 transition-transform group-hover:scale-110`}
                    >
                      <Icon className={`h-4 w-4 text-${config.color}`} />
                    </div>
                    <h3 className="font-bold text-base-content/80 text-sm tracking-wide">
                      {config.label}
                    </h3>
                    <div className="ml-auto">
                      <span className="rounded-full bg-base-200 px-2 py-1 font-semibold text-base-content/40 text-xs">
                        {techs.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech) => {
                      const tagLower = tech.toLowerCase().replace(/\s+/g, '-').replace('.', '')
                      return (
                        <span
                          key={tech}
                          role="button"
                          tabIndex={0}
                          className={`tech-tag hover:-translate-y-0.5 cursor-pointer rounded-lg px-3 py-1.5 font-medium text-xs opacity-0 transition-all duration-200 hover:scale-110 hover:shadow-md ${getTagStyle(tagLower)}`}
                          onClick={() => analytics.clickTechTag(tech, config.label)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              analytics.clickTechTag(tech, config.label)
                            }
                          }}
                        >
                          {tech}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 学习中的技术 */}
          <div className="learning-section mt-8 rounded-xl border-2 border-accent/30 border-dashed bg-accent/5 p-5 opacity-0 transition-all duration-300 hover:bg-accent/10">
            <div className="mb-4 flex items-center gap-2">
              <div className="relative">
                <Sparkles className="h-5 w-5 animate-pulse text-accent" />
                <div className="absolute inset-0 blur-sm">
                  <Sparkles className="h-5 w-5 animate-pulse text-accent" />
                </div>
              </div>
              <h3 className="flex items-center gap-2 font-bold text-accent text-lg">
                {t('techStack.learning')}
                <span className="inline-block h-2 w-2 animate-ping rounded-full bg-accent" />
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Rust', 'Go', 'Docker', 'Kubernetes'].map((tech) => (
                <span
                  key={tech}
                  role="button"
                  tabIndex={0}
                  className="learning-tag group/tech relative cursor-pointer overflow-hidden rounded-lg border-2 border-accent/40 bg-base-100 px-4 py-2 font-medium text-accent text-sm opacity-0 transition-all duration-200 hover:scale-105 hover:border-accent hover:bg-accent hover:text-accent-content"
                  onClick={() => analytics.viewLearningTech(tech)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      analytics.viewLearningTech(tech)
                    }
                  }}
                >
                  <span className="relative z-10">{tech}</span>
                  <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/tech:translate-x-[100%]" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfoPage
