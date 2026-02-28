/*
 * @Date: 2025-01-07
 * @Description: 天气卡片组件 - 日系简约风格
 */
'use client'
import {
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Moon,
  Navigation,
  RefreshCw,
  Sun,
  Wind,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useWeather } from '@/hooks/useWeather'
import { animateElements, staggerDelay } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { WeatherCondition } from '@/types/weather'

function WeatherCard() {
  const t = useTranslations('weather')

  const { data, isLoading, error, refetch, isRefetching, useBrowser, handleLocateMe } = useWeather()

  useEffect(() => {
    animateElements('.weather-card', {
      translateY: [40, 0],
      delay: staggerDelay(0, 0.1),
      duration: 0.8,
      ease: 'easeOut',
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
      default:
        return CloudSun
    }
  }

  const getWeatherColor = (condition: WeatherCondition) => {
    switch (condition) {
      case 'sunny':
        return 'text-(--jp-vermilion)'
      case 'night':
        return 'text-(--jp-indigo)'
      case 'rainy':
        return 'text-(--jp-indigo)'
      default:
        return 'text-(--jp-stone)'
    }
  }

  if (isLoading || error || !data) {
    return (
      <div className="weather-card relative w-full overflow-hidden border border-(--jp-mist) bg-(--jp-cream) opacity-0">
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <div className="h-5 w-20 animate-pulse rounded bg-(--jp-mist)" />
            <div className="flex gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-(--jp-mist)" />
              {(error || !data) && !isLoading ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  disabled={isRefetching}
                  className={cn('h-8 w-8 rounded-full', isRefetching && 'animate-spin')}
                  aria-label={t('refreshData')}
                >
                  <RefreshCw className="size-4" />
                </Button>
              ) : (
                <div className="h-8 w-8 animate-pulse rounded-full bg-(--jp-mist)" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="size-14 animate-pulse rounded-full bg-(--jp-mist)" />
            <div className="flex flex-col gap-2">
              <div className="h-10 w-24 animate-pulse rounded bg-(--jp-mist)" />
              <div className="h-4 w-16 animate-pulse rounded bg-(--jp-mist)" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 animate-pulse rounded-lg bg-(--jp-mist)" />
            <div className="h-16 animate-pulse rounded-lg bg-(--jp-mist)" />
          </div>
        </div>
      </div>
    )
  }

  const MainIcon = getWeatherIcon(data.condition)
  const iconColor = getWeatherColor(data.condition)

  return (
    <div className="weather-card group relative w-full overflow-hidden border border-(--jp-mist) bg-(--jp-cream) opacity-0 transition-colors hover:border-(--jp-stone)">
      <div className="flex flex-col gap-4 p-5">
        {/* 顶部栏：地点 + 操作 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-(--jp-ash)" />
            <span className="font-(family-name:--font-jp-sans) font-medium text-(--jp-ink) text-xs">
              {data.location}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleLocateMe}
              disabled={isRefetching}
              className={cn(
                'h-8 w-8 rounded-full',
                useBrowser && 'border-(--jp-vermilion) text-(--jp-vermilion)'
              )}
              aria-label="定位"
            >
              <Navigation className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="h-8 w-8 rounded-full"
              aria-label={t('refreshData')}
            >
              <RefreshCw className={cn('size-4', isRefetching && 'animate-spin')} />
            </Button>
          </div>
        </div>

        {/* 主要天气信息 */}
        <div className="flex items-center gap-4">
          <MainIcon className={cn('size-14 shrink-0', iconColor)} />
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-(family-name:--font-jp) font-semibold text-(--jp-ink) text-4xl">
                {data.temp}
              </span>
              <span className="text-(--jp-ash) text-xl">°C</span>
            </div>
            <p className="font-(family-name:--font-jp-sans) text-(--jp-stone) text-sm">
              {data.conditionText}
            </p>
            <p className="font-(family-name:--font-jp-sans) text-(--jp-ash) text-xs">
              {data.high}° / {data.low}°
            </p>
          </div>
        </div>

        {/* 湿度和风速 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-(--jp-mist) bg-(--jp-paper) p-3">
            <Droplets className="size-5 text-(--jp-indigo)" />
            <div>
              <p className="font-(family-name:--font-jp-sans) text-(--jp-ash) text-xs">
                {t('humidity')}
              </p>
              <p className="font-(family-name:--font-jp) font-medium text-(--jp-ink) text-lg">
                {data.humidity}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-(--jp-mist) bg-(--jp-paper) p-3">
            <Wind className="size-5 text-(--jp-moss)" />
            <div>
              <p className="font-(family-name:--font-jp-sans) text-(--jp-ash) text-xs">
                {data.windDir}
              </p>
              <p className="font-(family-name:--font-jp) font-medium text-(--jp-ink) text-lg">
                {data.windSpeed} km/h
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
