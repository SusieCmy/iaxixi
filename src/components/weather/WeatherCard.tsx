/*
 * @Date: 2025-01-07
 * @Description: 天气卡片组件 - Open-Meteo 适配版
 */
'use client'
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Loader2,
  MapPin,
  Moon,
  Navigation,
  RefreshCw,
  Sun,
  Wind,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useWeather } from '@/hooks/useWeather'
import { animateElements, staggerDelay } from '@/lib/animations'
import type { WeatherCondition } from '@/types/weather'
import { cn } from '@/utils/cn'

function WeatherCard() {
  const t = useTranslations('weather')
  const tCommon = useTranslations('common')

  const { data, isLoading, error, refetch, isRefetching, useBrowser, handleLocateMe } = useWeather()

  useEffect(() => {
    // 信息卡片
    animateElements('.cmy-card', {
      translateY: [40, 0],
      delay: staggerDelay(0, 100),
      duration: 800,
      ease: 'outExpo',
    })
  }, [])

  const getWeatherIcon = (condition: WeatherCondition) => {
    switch (condition) {
      case 'sunny':
        return Sun
      case 'night':
        return Moon
      case 'rainy':
        return CloudRain
      case 'cloudy':
      default:
        return CloudSun
    }
  }

  const getWeatherColor = (condition: WeatherCondition) => {
    switch (condition) {
      case 'sunny':
        return 'text-warning'
      case 'night':
        return 'text-info'
      case 'rainy':
        return 'text-primary'
      case 'cloudy':
      default:
        return 'text-accent'
    }
  }

  if (isLoading) {
    return (
      <div className="cmy-card w-full border border-base-300 bg-base-100 opacity-0 shadow-lg rounded-2xl transition-all duration-300">
        <div className="cmy-card-body items-center justify-center">
          <Loader2 className="size-10 animate-spin text-primary" />
          <p className="text-sm text-base-content/60">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="cmy-card w-full border border-base-300 bg-base-100 opacity-0 shadow-lg rounded-2xl transition-all duration-300">
        <div className="cmy-card-body items-center gap-4">
          <div className="rounded-full bg-error/10 p-4">
            <Cloud className="size-10 text-error" />
          </div>
          <p className="text-center text-sm font-medium text-base-content">
            {error instanceof Error ? error.message : t('noData')}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="cmy-btn cmy-btn-primary cmy-btn-sm gap-2"
          >
            <RefreshCw className="size-4" />
            {tCommon('retry')}
          </button>
        </div>
      </div>
    )
  }

  const MainIcon = getWeatherIcon(data.condition)
  const iconColor = getWeatherColor(data.condition)

  return (
    <div
      className="cmy-card rounded-2xl
    border border-base-300 bg-base-100 opacity-0 shadow-lg transition-all duration-300
     w-full hover:shadow-xl"
    >
      <div className="cmy-card-body gap-4 p-5">
        {/* 顶部栏：地点 + 操作 */}
        <div className="flex items-center justify-between">
          <div className="cmy-badge cmy-badge-ghost gap-1.5">
            <MapPin className="size-3.5" />
            <span className="text-xs font-medium">{data.location}</span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isRefetching}
              className="cmy-btn cmy-btn-ghost cmy-btn-circle cmy-btn-sm"
              title="Locate Me"
            >
              <Navigation className={cn('size-4', useBrowser && 'text-primary')} />
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isRefetching}
              className={cn(
                'cmy-btn cmy-btn-ghost cmy-btn-circle cmy-btn-sm',
                isRefetching && 'cmy-loading'
              )}
              aria-label={t('refreshData')}
            >
              <RefreshCw className={cn('size-4', isRefetching && 'animate-spin')} />
            </button>
          </div>
        </div>

        {/* 主要天气信息 */}
        <div className="flex items-center gap-4">
          <MainIcon className={cn('size-16 shrink-0', iconColor)} />
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-base-content">{data.temp}</span>
              <span className="text-2xl text-base-content/60">°C</span>
            </div>
            <p className="text-sm font-medium text-base-content/80">{data.conditionText}</p>
            <p className="text-xs text-base-content/50">
              {data.high}° / {data.low}°
            </p>
          </div>
        </div>

        {/* 湿度和风速 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-base-200 p-3">
            <Droplets className="size-5 text-primary" />
            <div>
              <p className="text-xs text-base-content/60">{t('humidity')}</p>
              <p className="text-lg font-semibold text-base-content">{data.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-base-200 p-3">
            <Wind className="size-5 text-accent" />
            <div>
              <p className="text-xs text-base-content/60">{data.windDir}</p>
              <p className="text-lg font-semibold text-base-content">{data.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
