import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CurrentWeather } from '@/types/weather';

export interface ComfortIndex {
  score: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  factor: string;
}

export function computeComfortIndex(current: CurrentWeather): ComfortIndex {
  const t = current.apparentTemperature;

  let score = 100 - Math.min(100, Math.abs(t - 21) * 4);
  let factor = 'Temperatura templada';

  if (current.humidity > 60 && t > 24) {
    score -= (current.humidity - 60) * 0.6;
    factor = `Humedad alta (${current.humidity}%) con calor`;
  }
  if (current.humidity < 20) {
    score -= (20 - current.humidity) * 0.5;
    factor = `Aire muy seco (${current.humidity}% de humedad)`;
  }
  if (t < 15) {
    score -= Math.min(20, current.windSpeed * 0.5);
    if (current.windSpeed >= 20) factor = `Sensación de frío por viento (${current.windSpeed} km/h)`;
  }
  if (current.isDay && current.uvIndex >= 6) {
    score -= (current.uvIndex - 5) * 3;
    factor = `Índice UV elevado (${current.uvIndex})`;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  if (score < 45) {
    if (t >= 27) return { score, icon: 'thermometer-alert', label: 'Muy caluroso', factor };
    if (t <= 8) return { score, icon: 'snowflake-alert', label: 'Muy frío', factor };
    return { score, icon: 'emoticon-neutral-outline', label: 'Pesado', factor };
  }
  if (score < 65) return { score, icon: 'emoticon-neutral-outline', label: 'Pesado', factor };
  if (score < 85) return { score, icon: 'emoticon-happy-outline', label: 'Agradable', factor };
  return { score, icon: 'emoticon-excited-outline', label: 'Muy agradable', factor: 'Condiciones ideales' };
}
