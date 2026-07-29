import { getWeatherCodeInfo } from '@/constants/weatherCodes';
import type { WeatherData } from '@/types/weather';
import { computeWeatherWarnings } from '@/utils/insights/weatherWarnings';

export interface NotificationContent {
  title: string;
  body: string;
  contentKey: string;
}

export function buildWeatherNotification(data: WeatherData): NotificationContent {
  const { current, location } = data;
  const { label } = getWeatherCodeInfo(current.weatherCode, current.isDay);
  const warnings = computeWeatherWarnings(data);

  const title = `Clima en ${location.city}`;
  let body = `${current.temperature}°C, ${label.toLowerCase()}. Sensación térmica de ${current.apparentTemperature}°C.`;

  if (warnings.length > 0) {
    body += ` ${warnings.map((w) => w.message).join(' ')}`;
  }

  const contentKey = `${location.city}|${warnings.map((w) => w.id).sort().join(',')}`;

  return { title, body, contentKey };
}
