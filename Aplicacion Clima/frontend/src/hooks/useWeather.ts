import { useQuery } from '@tanstack/react-query';

import { fetchWeather } from '@/services/weatherApi';
import type { Coordinates } from '@/types/weather';

interface UseWeatherParams extends Coordinates {
  city: string;
  country: string;
  enabled?: boolean;
}

export function useWeather({ latitude, longitude, city, country, enabled = true }: UseWeatherParams) {
  return useQuery({
    queryKey: ['weather', latitude, longitude],
    queryFn: () => fetchWeather({ latitude, longitude, city, country }),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
