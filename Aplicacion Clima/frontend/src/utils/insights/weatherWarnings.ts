import type { WeatherData } from '@/types/weather';
import { parseLocalDate } from '@/utils/date';

export interface WeatherWarning {
  id: string;
  message: string;
}

const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const STORM_CODES = [95, 96, 99];

export function computeWeatherWarnings(data: WeatherData): WeatherWarning[] {
  const { current, daily, nextRain } = data;
  const warnings: WeatherWarning[] = [];

  if (nextRain.state === 'starting' && nextRain.minutesUntilStart <= 30) {
    warnings.push({ id: 'rain-soon', message: `Va a llover en ${nextRain.minutesUntilStart} minutos.` });
  }

  const tomorrow = daily[1];
  if (tomorrow && tomorrow.temperatureMin <= 2) {
    warnings.push({
      id: 'frost-tomorrow',
      message: `Mañana habrá heladas, con una mínima de ${tomorrow.temperatureMin}°C.`,
    });
  }

  const today = daily[0];
  if (today && today.temperatureMax >= 34) {
    warnings.push({ id: 'heatwave', message: `Ola de calor: hoy la máxima llega a ${today.temperatureMax}°C.` });
  }

  const stormDayIndex = daily
    .slice(0, 3)
    .findIndex((d) => STORM_CODES.includes(d.weatherCode) && d.precipitationProbability >= 60);
  if (stormDayIndex !== -1) {
    const stormDay = daily[stormDayIndex];
    const dayLabel =
      stormDayIndex === 0 ? 'hoy' : stormDayIndex === 1 ? 'mañana' : `el ${WEEKDAYS[parseLocalDate(stormDay.date).getDay()]}`;
    warnings.push({ id: 'storm', message: `Se esperan tormentas fuertes ${dayLabel}.` });
  }

  if (current.windSpeed >= 50) {
    warnings.push({ id: 'strong-wind', message: `Viento intenso: ráfagas de hasta ${current.windSpeed} km/h.` });
  }

  return warnings;
}
