/*
 * @Date: 2025-01-07
 * @Description: 天气卡片组件 - 简洁主题适配设计 + 国际化
 */
'use client'
import { useQuery } from '@tanstack/react-query'
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Loader2,
  MapPin,
  Moon,
  RefreshCw,
  Sun,
  Wind,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { memo } from 'react'
import { cn } from '@/utils/cn'

interface WeatherData {
  temp: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'night'
  conditionText: string
  location: string
  humidity: number
  windSpeed: number
  windDir: string
  high: number
  low: number
  updateTime: string
  forecast: Array<{
    day: string
    temp: number
    condition: 'sunny' | 'cloudy' | 'rainy'
    conditionText: string
  }>
}

async function fetchWeather(): Promise<WeatherData> {
  const res = await fetch('/api/weather')
  if (!res.ok) {
    throw new Error('Failed to fetch weather data')
  }
  return res.json()
}

function WeatherCard() {
  const t = useTranslations('weather')
  const tCommon = useTranslations('common')

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['weather'],
    queryFn: fetchWeather,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
  })

  const getWeatherIcon = (condition: string) => {
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

  const getWeatherColor = (condition: string) => {
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
      <div className="cmy-card w-full bg-base-200 shadow-lg rounded-2xl">
        <div className="cmy-card-body items-center justify-center">
          <Loader2 className="size-10 animate-spin text-primary" />
          <p className="text-sm text-base-content/60">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="cmy-card w-full bg-base-200 shadow-lg rounded-2xl">
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
    <div className="cmy-card rounded-2xl border border-base-300 w-full bg-base-100 shadow-lg hover:shadow-xl">
      <div className="cmy-card-body gap-4 p-5">
        {/* 顶部栏：地点 + 刷新 */}
        <div className="flex items-center justify-between">
          <div className="cmy-badge cmy-badge-ghost gap-1.5">
            <MapPin className="size-3.5" />
            <span className="text-xs font-medium">{data.location}</span>
          </div>
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
              <p className="text-lg font-semibold text-base-content">{data.windSpeed}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(WeatherCard)
