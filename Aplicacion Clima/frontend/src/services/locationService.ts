import * as Location from 'expo-location';

import type { Coordinates } from '@/types/weather';

export interface DeviceLocation extends Coordinates {
  city: string;
  country: string;
}

export async function getDeviceLocation(): Promise<DeviceLocation> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== Location.PermissionStatus.GRANTED) {
    throw new Error('LOCATION_PERMISSION_DENIED');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const [place] = await Location.reverseGeocodeAsync({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    city: place?.city ?? place?.subregion ?? 'Ubicación actual',
    country: place?.country ?? '',
  };
}
