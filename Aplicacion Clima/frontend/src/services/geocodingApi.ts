import { httpClient } from '@/services/httpClient';
import { OPEN_METEO_GEOCODING_URL } from '@/constants/api';
import type { GeocodingResult } from '@/types/weather';

interface OpenMeteoGeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    country: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }>;
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (query.trim().length < 2) return [];

  const { data } = await httpClient.get<OpenMeteoGeocodingResponse>(OPEN_METEO_GEOCODING_URL, {
    params: { name: query, count: 10, language: 'es', format: 'json' },
  });

  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
}
