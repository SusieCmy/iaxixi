export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'night'

export interface WeatherData {
  temp: number
  condition: WeatherCondition
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
