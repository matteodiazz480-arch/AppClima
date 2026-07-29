import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { WeatherAnimation } from '@/constants/weatherCodes';
import type { CurrentWeather } from '@/types/weather';

export interface DrivingWarning {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}

export function getDrivingWarnings(current: CurrentWeather, icon: WeatherAnimation): DrivingWarning[] {
  const warnings: DrivingWarning[] = [];

  if (icon === 'fog') {
    warnings.push({ icon: 'weather-fog', label: 'Niebla' });
  }
  if (current.windSpeed >= 40) {
    warnings.push({ icon: 'weather-windy', label: `Viento fuerte (${current.windSpeed} km/h)` });
  }
  if ((icon === 'rain' || icon === 'thunder') && current.precipitationProbability >= 60) {
    warnings.push({ icon: 'weather-pouring', label: 'Lluvia intensa' });
  }
  if (current.temperature <= 2 && (icon === 'rain' || icon === 'drizzle' || icon === 'snow')) {
    warnings.push({ icon: 'snowflake-alert', label: 'Riesgo de hielo en la calzada' });
  }
  if (current.visibility <= 2) {
    warnings.push({ icon: 'eye-off-outline', label: `Baja visibilidad (${current.visibility} km)` });
  }

  return warnings;
}
