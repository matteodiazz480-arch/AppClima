import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { WeatherAnimation } from '@/constants/weatherCodes';
import type { CurrentWeather } from '@/types/weather';

export interface OutfitItem {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}

export function getOutfitSuggestions(current: CurrentWeather, icon: WeatherAnimation): OutfitItem[] {
  const items: OutfitItem[] = [];
  const t = current.apparentTemperature;

  if (t >= 24) {
    items.push({ icon: 'tshirt-crew-outline', label: 'Remera' });
  } else if (t >= 16) {
    items.push({ icon: 'tshirt-crew-outline', label: 'Remera' });
    items.push({ icon: 'tshirt-crew', label: 'Campera liviana' });
  } else if (t >= 8) {
    items.push({ icon: 'tshirt-crew', label: 'Campera' });
  } else {
    items.push({ icon: 'tshirt-crew', label: 'Campera abrigada' });
    items.push({ icon: 'snowflake', label: 'Bufanda' });
  }

  if (current.uvIndex >= 6 && current.isDay) {
    items.push({ icon: 'sunglasses', label: 'Gorra' });
  }

  if (current.precipitationProbability >= 40) {
    items.push({ icon: 'umbrella-outline', label: 'Paraguas' });
  }

  if (icon === 'snow' || (t < 3 && current.precipitationProbability >= 30)) {
    items.push({ icon: 'shoe-sneaker', label: 'Botas' });
  }

  return items;
}
