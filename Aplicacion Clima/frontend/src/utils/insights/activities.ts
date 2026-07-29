import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { WeatherAnimation } from '@/constants/weatherCodes';
import type { CurrentWeather } from '@/types/weather';

export interface ActivitySuggestion {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}

export function getActivitySuggestions(current: CurrentWeather, icon: WeatherAnimation): ActivitySuggestion[] {
  if (icon === 'thunder' || icon === 'rain' || current.windSpeed >= 45) {
    return [{ icon: 'home-outline', label: 'Mejor quedarse en casa' }];
  }

  const suggestions: ActivitySuggestion[] = [];
  const t = current.temperature;

  if (t >= 12 && t <= 26 && current.windSpeed < 25 && icon !== 'drizzle') {
    suggestions.push({ icon: 'run', label: 'Excelente para correr' });
  }
  if (current.windSpeed < 30 && (icon === 'sun' || icon === 'cloud-sun' || icon === 'cloud')) {
    suggestions.push({ icon: 'bike', label: 'Buen día para andar en bicicleta' });
  }
  if (current.uvIndex <= 7 && t >= 10 && t <= 25 && icon !== 'drizzle') {
    suggestions.push({ icon: 'hiking', label: 'Ideal para hacer senderismo' });
  }
  if (suggestions.length === 0) {
    suggestions.push({ icon: 'walk', label: 'Día tranquilo, salí con precaución' });
  }

  return suggestions;
}
