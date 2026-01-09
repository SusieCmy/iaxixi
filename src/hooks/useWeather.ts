import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { WeatherData } from '@/types/weather'

function getBrowserLocation(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      (error) => {
        console.warn('Geolocation error:', error)
        resolve(null)
      },
      { timeout: 5000 }
    )
  })
}

async function getCityName(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    )
    if (!res.ok) return 'My Location'
    const data = await res.json()
    return data.city || data.locality || 'My Location'
  } catch {
    return 'My Location'
  }
}

async function fetchWeather(useBrowserGeo = false): Promise<WeatherData> {
  let lat: number | undefined
  let lon: number | undefined
  let city: string | undefined

  if (useBrowserGeo) {
    const browserLoc = await getBrowserLocation()
    if (browserLoc) {
      lat = browserLoc.lat
      lon = browserLoc.lon
      city = await getCityName(lat, lon)
      console.log('useWeather: Using Browser Location', { lat, lon, city })
    }
  }

  const params = new URLSearchParams()
  if (lat && lon) {
    params.append('lat', lat.toString())
    params.append('lon', lon.toString())
    if (city) params.append('city', city)
  }

  // If no params are sent, the server will handle IP/Default fallback
  const res = await fetch(`/api/weather?${params.toString()}`)
  if (!res.ok) {
    throw new Error('Failed to fetch weather data')
  }
  return res.json()
}

export function useWeather() {
  const [useBrowser, setUseBrowser] = useState(false)

  const query = useQuery({
    queryKey: ['weather', useBrowser],
    queryFn: () => fetchWeather(useBrowser),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  })

  const handleLocateMe = () => {
    setUseBrowser(true)
    if (useBrowser) {
      query.refetch()
    }
  }

  return {
    ...query,
    useBrowser,
    handleLocateMe,
  }
}
