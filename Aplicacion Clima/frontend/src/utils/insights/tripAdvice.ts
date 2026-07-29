import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { WeatherAnimation } from '@/constants/weatherCodes';
import type { DailyForecastItem } from '@/types/weather';

export interface TripClothingItem {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}

export interface TripAdvice {
  clothing: TripClothingItem[];
  temperatureSwing: number;
  rainRisk: 'low' | 'moderate' | 'high';
  activitySuggestion: string;
}

function getActivitySuggestion(day: DailyForecastItem, icon: WeatherAnimation): string {
  if ((icon === 'rain' || icon === 'thunder' || icon === 'drizzle') && day.precipitationProbability >= 60) {
    return 'Conviene tener planes bajo techo de respaldo, es probable que llueva bastante.';
  }
  if (day.temperatureMax >= 30) {
    return 'Reservá las actividades al aire libre para la mañana o el atardecer, evitando la hora de más calor.';
  }
  if (icon === 'snow') {
    return 'Buen clima para actividades de nieve, pero abrigate en varias capas.';
  }
  return 'Buen clima para explorar al aire libre durante el día.';
}

export function computeTripAdvice(day: DailyForecastItem, icon: WeatherAnimation): TripAdvice {
  const clothing: TripClothingItem[] = [];

  if (day.temperatureMax >= 24) clothing.push({ icon: 'tshirt-crew-outline', label: 'Ropa liviana' });
  if (day.temperatureMin <= 12) clothing.push({ icon: 'tshirt-crew', label: 'Campera' });
  if (day.temperatureMin <= 5) clothing.push({ icon: 'snowflake', label: 'Bufanda' });
  if (day.precipitationProbability >= 40) clothing.push({ icon: 'umbrella-outline', label: 'Paraguas' });
  if (icon === 'snow') clothing.push({ icon: 'shoe-sneaker', label: 'Botas' });
  if (day.temperatureMax >= 28) clothing.push({ icon: 'sunglasses', label: 'Protector solar' });
  if (clothing.length === 0) clothing.push({ icon: 'tshirt-crew-outline', label: 'Ropa cómoda' });

  const temperatureSwing = day.temperatureMax - day.temperatureMin;
  const rainRisk: TripAdvice['rainRisk'] =
    day.precipitationProbability >= 60 ? 'high' : day.precipitationProbability >= 30 ? 'moderate' : 'low';

  return { clothing, temperatureSwing, rainRisk, activitySuggestion: getActivitySuggestion(day, icon) };
}
