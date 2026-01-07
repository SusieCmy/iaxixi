import { type NextRequest, NextResponse } from 'next/server'

const QWEATHER_API_KEY = process.env.QWEATHER_API_KEY
const BASE_URL = 'https://devapi.qweather.com/v7'
const GEO_URL = 'https://geoapi.qweather.com/v2'

// 和风天气 API 类型定义（完全对应官方返回格式）
interface QWeatherLocation {
  id: string
  name: string
  lat: string
  lon: string
  adm2: string
  adm1: string
  country: string
  tz: string
  utcOffset: string
  isDst: string
  type: string
  rank: string
  fxLink: string
}

interface QWeatherLocationResponse {
  code: string
  location?: QWeatherLocation[]
  refer?: {
    sources: string[]
    license: string[]
  }
}

interface QWeatherNow {
  obsTime: string
  temp: string
  feelsLike: string
  icon: string
  text: string // 天气状况的文字描述（中文）
  wind360: string
  windDir: string
  windScale: string
  windSpeed: string
  humidity: string
  precip: string
  pressure: string
  vis: string
  cloud?: string
  dew?: string
}

interface QWeatherNowResponse {
  code: string
  updateTime: string
  fxLink: string
  now: QWeatherNow
  refer: {
    sources: string[]
    license: string[]
  }
}

interface QWeatherDaily {
  fxDate: string
  sunrise: string
  sunset: string
  moonrise: string
  moonset: string
  moonPhase: string
  moonPhaseIcon: string
  tempMax: string
  tempMin: string
  iconDay: string
  textDay: string // 白天天气状况文字描述
  iconNight: string
  textNight: string // 夜间天气状况文字描述
  wind360Day: string
  windDirDay: string
  windScaleDay: string
  windSpeedDay: string
  wind360Night: string
  windDirNight: string
  windScaleNight: string
  windSpeedNight: string
  humidity: string
  precip: string
  pressure: string
  vis: string
  cloud: string
  uvIndex: string
}

interface QWeatherForecastResponse {
  code: string
  updateTime: string
  fxLink: string
  daily: QWeatherDaily[]
  refer: {
    sources: string[]
    license: string[]
  }
}

// 返回给前端的数据格式
interface WeatherData {
  temp: number
  condition: string // 简化的天气状态（用于图标）
  conditionText: string // 完整的天气描述（中文）
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
    condition: string
    conditionText: string
  }>
}

export async function GET(request: NextRequest) {
  if (!QWEATHER_API_KEY) {
    return NextResponse.json({ error: 'QWeather API key not configured' }, { status: 500 })
  }

  try {
    // 1. 获取客户端 IP
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    let ip = forwardedFor || realIp || 'auto_ip'

    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim()
    }

    // 本地开发时如果是 localhost，默认使用北京的城市 ID
    if (ip === '::1' || ip === '127.0.0.1' || ip === 'auto_ip') {
      ip = '101010100' // 和风天气支持的北京城市 ID
    }

    // 2. 获取城市信息 (GeoAPI)
    const locationRes = await fetch(
      `${GEO_URL}/city/lookup?location=${ip}&key=${QWEATHER_API_KEY}&lang=zh`
    )
    const locationData: QWeatherLocationResponse = await locationRes.json()

    if (locationData.code !== '200' || !locationData.location?.[0]) {
      // 如果 IP 定位失败，使用默认城市（北京）
      console.warn('Location lookup failed, using default city (Beijing)')
    }

    const locationId = locationData.location?.[0]?.id || '101010100' // 默认北京
    const cityName = locationData.location?.[0]?.name || '北京'
    const adm2 = locationData.location?.[0]?.adm2 || '' // 上级行政区
    const locationName = adm2 ? `${adm2} ${cityName}` : cityName

    // 3. 并行获取实时天气和预报数据
    const [nowRes, forecastRes] = await Promise.all([
      fetch(`${BASE_URL}/weather/now?location=${locationId}&key=${QWEATHER_API_KEY}&lang=zh`),
      fetch(`${BASE_URL}/weather/3d?location=${locationId}&key=${QWEATHER_API_KEY}&lang=zh`),
    ])

    const [nowData, forecastData]: [QWeatherNowResponse, QWeatherForecastResponse] =
      await Promise.all([nowRes.json(), forecastRes.json()])

    if (nowData.code !== '200' || forecastData.code !== '200') {
      throw new Error('Weather API failed')
    }

    // 4. 组装数据
    const weatherData: WeatherData = {
      temp: Number.parseInt(nowData.now.temp),
      condition: mapWeatherCondition(nowData.now.icon, nowData.now.text),
      conditionText: nowData.now.text, // 直接使用和风天气的中文描述
      location: locationName,
      humidity: Number.parseInt(nowData.now.humidity),
      windSpeed: Number.parseInt(nowData.now.windSpeed),
      windDir: nowData.now.windDir,
      high: Number.parseInt(forecastData.daily[0].tempMax),
      low: Number.parseInt(forecastData.daily[0].tempMin),
      updateTime: nowData.updateTime,
      forecast: forecastData.daily.map((day) => ({
        day: getDayName(day.fxDate),
        temp: Number.parseInt(day.tempMax),
        condition: mapWeatherCondition(day.iconDay, day.textDay),
        conditionText: day.textDay,
      })),
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error('Weather API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  }
}

// 辅助函数：根据图标代码和天气文字映射到简化状态（用于UI图标选择）
function mapWeatherCondition(iconCode: string, text: string): string {
  const code = Number.parseInt(iconCode)

  // 和风天气图标代码参考: https://dev.qweather.com/docs/resource/icons/
  // 优先使用图标代码判断，因为更精确
  if (code >= 100 && code <= 104) return 'sunny' // 晴
  if (code >= 150 && code <= 154) return 'night' // 夜晚晴
  if (code >= 300 && code <= 399) return 'rainy' // 雨
  if (code >= 400 && code <= 499) return 'rainy' // 雪也暂时归为 rainy/bad weather
  if (code >= 500 && code <= 599) return 'cloudy' // 雾/霾

  // 备用：根据文字描述判断（防止图标代码不全）
  if (text.includes('晴')) return 'sunny'
  if (text.includes('雨') || text.includes('雪')) return 'rainy'
  if (text.includes('云') || text.includes('阴')) return 'cloudy'

  return 'cloudy' // 默认多云
}

// 辅助函数：获取星期几（中文）
function getDayName(dateStr: string): string {
  const date = new Date(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[date.getDay()]
}
