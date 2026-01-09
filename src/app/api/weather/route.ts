import { NextResponse } from 'next/server'
import type { WeatherCondition, WeatherData } from '@/types/weather'

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
  try {
    // Using a public IP geolocation API (same as before, but server-side)
    // In production, you might want to use a more robust service or database
    const res = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`)
    if (!res.ok) return null
    const data = await res.json()
    console.log('data', data)

    return {
      lat: Number.parseFloat(data.latitude),
      lon: Number.parseFloat(data.longitude),
      city: data.city || data.region || 'Unknown Location',
    }
  } catch (e) {
    console.warn('Server IP Location failed', e)
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
    const ip = forwardedFor ? forwardedFor.split(',')[0] : realIp || ''

    console.log('Weather API: Detecting location for IP:', ip || 'unknown')

    if (ip) {
      const ipLoc = await getIpLocation(ip)
      if (ipLoc) {
        lat = ipLoc.lat.toString()
        lon = ipLoc.lon.toString()
        city = ipLoc.city
        console.log('Weather API: Using IP Location', { lat, lon, city })
      }
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

    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)

    if (!res.ok) {
      throw new Error('Failed to fetch weather data from Open-Meteo')
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

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error('Weather API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  }
}
