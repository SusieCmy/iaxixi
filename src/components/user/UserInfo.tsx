/*
 * @Date: 2025-12-09
 * @LastEditors: Claude Code
 * @Description: 日系简约风格个人信息组件
 */
'use client'

import { Calendar, Code2, Github, Heart, Mail, MapPin, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import NewsCard from '@/components/news/NewsCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import TextType from '@/components/ui/TextType'
import WeatherCard from '@/components/weather/WeatherCard'
import { EXTERNAL_LINKS } from '@/constants/routes'
import analytics from '@/lib/analytics'
import { animateElements, staggerDelay } from '@/lib/animations'

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

  // 入场动画
  useEffect(() => {
    // 信息卡片
    animateElements('.info-card', {
      translateY: [40, 0],
      delay: staggerDelay(0, 0.1),
      duration: 0.8,
      ease: 'easeOut',
    })

    // 统计项
    animateElements('.stat-item', {
      scale: [0.8, 1],
      delay: staggerDelay(0.4, 0.08),
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    })

    // 技术栈分类卡片
    animateElements('.tech-category', {
      translateY: [30, 0],
      scale: [0.95, 1],
      delay: staggerDelay(0.6, 0.08),
      duration: 0.6,
      ease: 'easeOut',
    })

    // 技术标签
    animateElements('.tech-tag', {
      scale: [0.8, 1],
      delay: staggerDelay(0.8, 0.02),
      duration: 0.4,
      ease: [0.34, 1.56, 0.64, 1],
    })

    // 学习中的技术区域

    animateElements('.learning-section', {
      translateY: [20, 0],
      delay: 1,
      duration: 0.6,
      ease: 'easeOut',
    })

    // 学习中的技术标签
    animateElements('.learning-tag', {
      scale: [0.9, 1],
      delay: staggerDelay(1.2, 0.1),
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1],
    })
  }, [])

  return (
    <div ref={containerRef} className="mx-auto max-w-screen-2xl py-8 sm:py-12">
      {/* 主要信息区域 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 左侧：个人介绍卡片 */}
        <div className="lg:col-span-2">
          <div className="info-card group relative h-full overflow-hidden border border-(--jp-mist) bg-(--jp-cream) p-6 opacity-0 transition-colors hover:border-(--jp-stone) sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:items-start">
              {/* 头像 */}
              <div className="group/avatar relative shrink-0">
                <Image
                  src="/chenmuyu.png"
                  alt={t('name')}
                  priority
                  width={140}
                  height={140}
                  className="relative z-10 rounded-lg"
                />
              </div>

              {/* 个人信息 */}
              <div className="flex-1 text-center md:text-left">
                <h1
                  className="font-(family-name:--font-jp) mb-2 font-medium text-(--jp-ink) text-3xl sm:text-4xl"
                  onClick={() => analytics.clickUserName()}
                >
                  <p>{t('name')}</p>
                </h1>
                <p className="font-(family-name:--font-jp-sans) mb-4 text-(--jp-stone) text-base sm:text-lg">
                  {t('position')}
                </p>

                {/* 标签 */}
                <div className="mb-5 flex flex-wrap justify-center gap-2 md:justify-start">
                  <Badge
                    variant="outline"
                    className="font-(family-name:--font-jp-sans) gap-1.5 px-3 py-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-(--jp-vermilion)" />
                    {t('tags.webDeveloper')}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="font-(family-name:--font-jp-sans) gap-1.5 px-3 py-1.5"
                  >
                    <Code2 className="h-3.5 w-3.5 text-(--jp-indigo)" />
                    {t('tags.fullStack')}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="font-(family-name:--font-jp-sans) gap-1.5 px-3 py-1.5"
                  >
                    <Heart className="h-3.5 w-3.5 text-(--jp-moss)" />
                    {t('tags.openSource')}
                  </Badge>
                </div>

                {/* 位置和时间 */}
                <div className="font-(family-name:--font-jp-sans) mb-5 flex flex-wrap justify-center gap-4 text-(--jp-ash) text-sm md:justify-start">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{t('location')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{t('timeline')}</span>
                  </div>
                </div>

                {/* 社交链接 */}
                <div className="flex justify-center gap-2 md:justify-start">
                  {socialLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <Button key={link.label} variant="outline" size="icon" asChild>
                        <Link
                          href={link.href}
                          title={link.label}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => analytics.clickSocialLink(link.label)}
                        >
                          <Icon className="h-5 w-5" />
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 个人简介 */}
            <div className="relative mt-6 border-(--jp-mist) border-t pt-6 sm:mt-8 sm:pt-8">
              <h2 className="font-(family-name:--font-jp) mb-3 flex items-center gap-2 font-medium text-(--jp-ink) text-lg">
                <Sparkles className="h-5 w-5 text-(--jp-vermilion)" />
                {t('aboutTitle')}
              </h2>
              <div className="font-(family-name:--font-jp-sans) text-(--jp-stone) text-sm leading-relaxed sm:text-base">
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

        {/* 右侧：天气卡片（首页）或 统计数据卡片（其他页面） */}
        <div className="lg:col-span-1">
          <div className="flex flex-col gap-6">
            <WeatherCard />
            <NewsCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfoPage
