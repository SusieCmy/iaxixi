import { NextRequest, NextResponse } from 'next/server'

const QWEATHER_API_KEY = process.env.QWEATHER_API_KEY
const BASE_URL = 'https://devapi.qweather.com/v7'
const GEO_URL = 'https://geoapi.qweather.com/v2'

export async function GET(request: NextRequest) {
  if (!QWEATHER_API_KEY) {
    return NextResponse.json(
      { error: 'QWeather API key not configured' },
      { status: 500 }
    )
  }

  try {
    // 1. 获取客户端 IP
    let ip = request.headers.get('x-forwarded-for') || request.ip || 'auto_ip'
    console.log('forecastData, ip', ip)
    if (ip.includes(',')) {
      ip = ip.split(',')[0]
    }
    
    // 本地开发时如果是 localhost，默认使用北京的 IP 或者让 API 自动判断
    if (ip === '::1' || ip === '127.0.0.1') {
      ip = '101010100' // 和风天气支持 auto_ip 参数
    }

    // 2. 获取城市信息 (GeoAPI)
    const locationRes = await fetch(
      `${GEO_URL}/city/lookup?location=${ip}&key=${QWEATHER_API_KEY}&lang=en`
    )
    const locationData = await locationRes.json()
    console.log('forecastData, forecastipData', ip)

    if (locationData.code !== '200' || !locationData.location?.[0]) {
      console.error('Location lookup failed:', locationData)
      // 如果 IP 定位失败，尝试默认城市（北京）
      // return NextResponse.json({ error: 'Location lookup failed' }, { status: 404 })
    }

    const locationId = locationData.location?.[0]?.id || '101010100' // 默认北京
    const cityName = locationData.location?.[0]?.name || 'Beijing'
    const adm2 = locationData.location?.[0]?.adm2 || '' // 上级行政区
    const locationName = adm2 ? `${cityName}, ${adm2}` : cityName

    // 3. 获取实时天气
    const nowRes = await fetch(
      `${BASE_URL}/weather/now?location=${locationId}&key=${QWEATHER_API_KEY}&lang=en`
    )
    const nowData = await nowRes.json()
    console.log('forecastData, nowData', nowData)
    // 4. 获取 3 天预报
    const forecastRes = await fetch(
      `${BASE_URL}/weather/3d?location=${locationId}&key=${QWEATHER_API_KEY}&lang=en`
    )
    const forecastData = await forecastRes.json()
    if (nowData.code !== '200' || forecastData.code !== '200') {
      throw new Error('Weather API failed')
    }

    // 5. 组装数据
    const weatherData = {
      temp: parseInt(nowData.now.temp),
      condition: mapWeatherCondition(nowData.now.icon),
      location: locationName,
      humidity: parseInt(nowData.now.humidity),
      windSpeed: parseInt(nowData.now.windSpeed),
      high: parseInt(forecastData.daily[0].tempMax),
      low: parseInt(forecastData.daily[0].tempMin),
      forecast: forecastData.daily.map((day: any) => ({
        day: getDayName(day.fxDate),
        temp: parseInt(day.tempMax),
        condition: mapWeatherCondition(day.iconDay),
      })),
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error('Weather API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}

// 辅助函数：映射天气图标代码到我们的简单状态
function mapWeatherCondition(iconCode: string): string {
  const code = parseInt(iconCode)
  // 和风天气图标代码参考: https://dev.qweather.com/docs/resource/icons/
  if (code >= 100 && code <= 104) return 'sunny' // 晴
  if (code >= 150 && code <= 154) return 'night' // 夜晚晴
  if (code >= 300 && code <= 399) return 'rainy' // 雨
  if (code >= 400 && code <= 499) return 'rainy' // 雪也暂时归为 rainy/bad weather
  if (code >= 500 && code <= 599) return 'cloudy' // 雾/霾
  return 'cloudy' // 默认多云
}

// 辅助函数：获取星期几
function getDayName(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}
