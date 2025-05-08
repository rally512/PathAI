// PathAI/hooks/useFacilityLookup.ts
import { useState } from 'react'

const GOOGLE_API_KEY = 'AIzaSyDTC7BEJa-GXfUpP60znn0hh6Gp8nrLjT8'

export interface FacilityInfo {
  name: string
  address: string
  lat: number
  lng: number
  phone?: string
  intlPhone?: string
  openingHours?: string[]
  website?: string
  rating?: number
  userRatingsTotal?: number
  mapsUrl?: string
}

export function useFacilityLookup() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|undefined>()
  const [data, setData] = useState<FacilityInfo|undefined>()

  async function lookup(keyword: string, destLat: number, destLng: number) {
    setLoading(true)
    setError(undefined)
    try {
      // 1) Nearby Search
      const nearRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `key=${GOOGLE_API_KEY}` +
        `&location=${destLat},${destLng}` +
        `&radius=50000` +
        `&keyword=${encodeURIComponent(keyword)}`
      )
      const near = await nearRes.json()
      if (near.status !== 'OK' || !near.results.length) {
        throw new Error(`No places found: ${near.status}`)
      }
      const placeId: string = near.results[0].place_id

      // 2) Place Details
      const fields = [
        'name',
        'formatted_address',
        'geometry/location',
        'formatted_phone_number',
        'international_phone_number',
        'opening_hours/weekday_text',
        'website',
        'rating',
        'user_ratings_total',
        'url',
      ].join(',')

      const detRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?` +
        `key=${GOOGLE_API_KEY}` +
        `&place_id=${placeId}` +
        `&fields=${fields}`
      )
      const det = await detRes.json()
      if (det.status !== 'OK' || !det.result) {
        throw new Error(`Details failed: ${det.status}`)
      }

      const r = det.result
      setData({
        name: r.name,
        address: r.formatted_address,
        lat: r.geometry.location.lat,
        lng: r.geometry.location.lng,
        phone: r.formatted_phone_number,
        intlPhone: r.international_phone_number,
        openingHours: r.opening_hours?.weekday_text,
        website: r.website,
        rating: r.rating,
        userRatingsTotal: r.user_ratings_total,
        mapsUrl: r.url,
      })
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, data, lookup }
}
