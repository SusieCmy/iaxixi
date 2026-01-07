/*
 * @Date: 2025-01-07
 * @Description: 天气卡片组件 - 玻璃拟态与渐变设计 (Real Data)
 */
'use client'
import { Cloud, CloudRain, CloudSun, Droplets, Loader2, MapPin, Moon, Sun, Wind } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import { cn } from '@/utils/cn'

interface WeatherData {
    temp: number
    condition: 'sunny' | 'cloudy' | 'rainy' | 'night'
    location: string
    humidity: number
    windSpeed: number
    high: number
    low: number
    forecast: Array<{
        day: string
        temp: number
        condition: 'sunny' | 'cloudy' | 'rainy'
    }>
}

function WeatherCard() {
    const [data, setData] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch('/api/weather')
                if (!res.ok) {
                    throw new Error('Failed to fetch weather data')
                }
                const weatherData = await res.json()
                setData(weatherData)
            } catch (err) {
                console.error(err)
                setError('Failed to load weather')
            } finally {
                setLoading(false)
            }
        }

        fetchWeather()
    }, [])

    // 根据天气状况获取背景渐变和图标
    const getWeatherConfig = (condition: string) => {
        switch (condition) {
            case 'sunny':
                return {
                    bg: 'bg-gradient-to-br from-orange-400 to-amber-600',
                    icon: Sun,
                    textColor: 'text-orange-50',
                }
            case 'night':
                return {
                    bg: 'bg-gradient-to-br from-indigo-900 to-slate-900',
                    icon: Moon,
                    textColor: 'text-indigo-50',
                }
            case 'rainy':
                return {
                    bg: 'bg-gradient-to-br from-blue-700 to-slate-800',
                    icon: CloudRain,
                    textColor: 'text-blue-50',
                }
            case 'cloudy':
            default:
                return {
                    bg: 'bg-gradient-to-br from-sky-400 to-blue-600',
                    icon: CloudSun,
                    textColor: 'text-sky-50',
                }
        }
    }

    if (loading) {
        return (
            <div className="flex h-[400px] w-80 items-center justify-center rounded-3xl bg-base-200 shadow-xl">
                <Loader2 className="h-8 w-8 animate-spin text-base-content/30" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="flex h-[400px] w-80 flex-col items-center justify-center gap-2 rounded-3xl bg-base-200 shadow-xl text-base-content/50">
                <Cloud className="h-10 w-10" />
                <p>{error || 'No Data'}</p>
            </div>
        )
    }

    const config = getWeatherConfig(data.condition)
    const MainIcon = config.icon

    return (
        <div className="group relative w-80 overflow-hidden rounded-3xl shadow-2xl transition-all hover:scale-[1.02] hover:shadow-3xl">
            {/* 背景层 */}
            <div className={cn('absolute inset-0 transition-all duration-500', config.bg)} />

            {/* 装饰性光晕 */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />

            {/* 内容层 */}
            <div className={cn('relative p-6 text-white', config.textColor)}>
                {/* 顶部位置信息 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
                        <MapPin className="h-3.5 w-3.5" />
                        {data.location}
                    </div>
                    <div className="text-xs font-medium opacity-80">Today</div>
                </div>

                {/* 主要天气展示 */}
                <div className="mt-8 flex flex-col items-center">
                    <div className="relative">
                        <MainIcon className="h-24 w-24 drop-shadow-lg transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" />
                        {/* 动态阴影 */}
                        <div className="absolute -bottom-4 left-1/2 h-4 w-16 -translate-x-1/2 rounded-[100%] bg-black/20 blur-md transition-all group-hover:w-20 group-hover:bg-black/30" />
                    </div>

                    <div className="mt-4 text-center">
                        <div className="flex items-start justify-center">
                            <span className="text-7xl font-bold tracking-tighter drop-shadow-sm">
                                {data.temp}
                            </span>
                            <span className="mt-2 text-3xl font-medium">°</span>
                        </div>
                        <div className="text-lg font-medium capitalize opacity-90">{data.condition}</div>
                        <div className="mt-1 text-sm opacity-70">
                            H: {data.high}° L: {data.low}°
                        </div>
                    </div>
                </div>

                {/* 详情数据 */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-md transition-colors hover:bg-white/15">
                        <Droplets className="h-5 w-5 opacity-80" />
                        <div>
                            <div className="text-xs opacity-60">Humidity</div>
                            <div className="font-semibold">{data.humidity}%</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-md transition-colors hover:bg-white/15">
                        <Wind className="h-5 w-5 opacity-80" />
                        <div>
                            <div className="text-xs opacity-60">Wind</div>
                            <div className="font-semibold">{data.windSpeed} km/h</div>
                        </div>
                    </div>
                </div>

                {/* 底部预报 */}
                <div className="mt-6 border-t border-white/10 pt-4">
                    <div className="flex justify-between px-2">
                        {data.forecast.map((day, index) => {
                            const DayIcon = getWeatherConfig(day.condition).icon
                            return (
                                <div key={index} className="flex flex-col items-center gap-2">
                                    <span className="text-xs font-medium opacity-70">{day.day}</span>
                                    <DayIcon className="h-6 w-6" />
                                    <span className="text-sm font-semibold">{day.temp}°</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(WeatherCard)
