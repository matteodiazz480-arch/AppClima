import { useQuery } from '@tanstack/react-query';

import { getDeviceLocation } from '@/services/locationService';

export function useCurrentLocation() {
  return useQuery({
    queryKey: ['device-location'],
    queryFn: getDeviceLocation,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}
