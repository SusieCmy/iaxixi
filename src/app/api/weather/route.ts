import { NextResponse } from 'next/server'
import type { WeatherCondition, WeatherData } from '@/types/weather'

// 缓存配置
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟
const locationCache = new Map<string, { data: any; timestamp: number }>()
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>()

function getWeatherCondition(
  code: number,
  isDay: number
): { condition: WeatherCondition; text: string } {
  const isNight = isDay === 0

  if (code === 0) {
    return { condition: isNight ? 'night' : 'sunny', text: isNight ? 'Clear Night' : 'Sunny' }
  }
  if (code === 1 || code === 2) {
    return { condition: isNight ? 'night' : 'cloudy', text: 'Partly Cloudy' }
  }
  if (code === 3) {
    return { condition: 'cloudy', text: 'Overcast' }
  }
  if ([45, 48].includes(code)) {
    return { condition: 'cloudy', text: 'Foggy' }
  }
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return { condition: 'rainy', text: 'Rain' }
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { condition: 'rainy', text: 'Snow' }
  }
  if ([95, 96, 99].includes(code)) {
    return { condition: 'rainy', text: 'Thunderstorm' }
  }

  return { condition: 'cloudy', text: 'Cloudy' }
}

const DEFAULT_LOCATION = {
  lat: 39.9042,
  lon: 116.4074,
  city: 'Beijing',
}

async function getIpLocation(
  ip: string
): Promise<{ lat: number; lon: number; city: string } | null> {
  // 检查缓存
  const cached = locationCache.get(ip)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Using cached IP location for:', ip)
    return cached.data
  }

  try {
    // 添加超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时

    const res = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WeatherApp/1.0)',
      },
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      console.warn(`IP Location API returned ${res.status}`)
      return null
    }

    const data = await res.json()

    const result = {
      lat: Number.parseFloat(data.latitude),
      lon: Number.parseFloat(data.longitude),
      city: data.city || data.region || 'Unknown Location',
    }

    // 验证数据有效性
    if (Number.isNaN(result.lat) || Number.isNaN(result.lon)) {
      console.warn('Invalid coordinates from IP location')
      return null
    }

    // 缓存结果
    locationCache.set(ip, { data: result, timestamp: Date.now() })
    console.log('IP Location success:', result)

    return result
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      console.warn('IP Location request timeout')
    } else {
      console.warn('IP Location failed:', e)
    }
    return null
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  let lat = searchParams.get('lat')
  let lon = searchParams.get('lon')
  let city = searchParams.get('city')

  // If no coordinates provided, try IP location
  if (!lat || !lon) {
    const headers = request.headers
    // Try to get IP from headers (x-forwarded-for is standard for proxies)
    const forwardedFor = headers.get('x-forwarded-for')
    const realIp = headers.get('x-real-ip')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || ''

    console.log('Weather API: Detecting location for IP:', ip || 'unknown')

    // 只对有效的公网 IP 进行定位
    if (ip && !ip.startsWith('127.') && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
      const ipLoc = await getIpLocation(ip)
      if (ipLoc) {
        lat = ipLoc.lat.toString()
        lon = ipLoc.lon.toString()
        city = ipLoc.city
        console.log('Weather API: Using IP Location', { lat, lon, city })
      }
    } else {
      console.log('Weather API: Skipping IP location (local/invalid IP)')
    }
  }

  // Fallback to default if still no coordinates
  if (!lat || !lon) {
    lat = DEFAULT_LOCATION.lat.toString()
    lon = DEFAULT_LOCATION.lon.toString()
    city = DEFAULT_LOCATION.city
    console.log('Weather API: Using Default Location', { lat, lon, city })
  }

  const locationName = city || 'Unknown Location'
  const cacheKey = `${lat},${lon}`

  // 检查天气数据缓存
  const cachedWeather = weatherCache.get(cacheKey)
  if (cachedWeather && Date.now() - cachedWeather.timestamp < CACHE_DURATION) {
    console.log('Using cached weather data for:', cacheKey)
    return NextResponse.json(cachedWeather.data)
  }

  try {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current:
        'temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m,wind_direction_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min',
      timezone: 'auto',
      forecast_days: '3',
    })

    // 添加超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      throw new Error(`Open-Meteo API returned ${res.status}`)
    }

    const data = await res.json()
    const current = data.current
    const daily = data.daily
    const { condition, text } = getWeatherCondition(current.weather_code, current.is_day)

    const forecast = daily.time.map((time: string, index: number) => {
      const code = daily.weather_code[index]
      const { condition: dayCond, text: dayText } = getWeatherCondition(code, 1)
      return {
        day: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
        temp: Math.round(daily.temperature_2m_max[index]),
        condition: dayCond,
        conditionText: dayText,
      }
    })

    const weatherData: WeatherData = {
      temp: Math.round(current.temperature_2m),
      condition,
      conditionText: text,
      location: locationName,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDir: `${current.wind_direction_10m}°`,
      high: Math.round(daily.temperature_2m_max[0]),
      low: Math.round(daily.temperature_2m_min[0]),
      updateTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      forecast,
    }

    // 缓存天气数据
    weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() })
    console.log('Weather data cached for:', cacheKey)

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error('Weather API Error:', error)

    // 区分不同类型的错误
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Weather service timeout. Please try again.' },
          { status: 504 }
        )
      }

      return NextResponse.json(
        { error: `Failed to fetch weather data: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 })
  }
}
