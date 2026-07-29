import { useQuery } from '@tanstack/react-query';

import { fetchDailyForecast } from '@/services/weatherApi';
import type { Coordinates } from '@/types/weather';

export function useDailyForecast(coords: Coordinates | null, days: number) {
  return useQuery({
    queryKey: ['daily-forecast', coords?.latitude, coords?.longitude, days],
    queryFn: () => fetchDailyForecast(coords!, days),
    enabled: !!coords,
    staleTime: 30 * 60 * 1000,
  });
}
