import { Ionicons } from '@expo/vector-icons';

import type { WeatherAnimation } from '@/constants/weatherCodes';

const ICON_NAME: Record<WeatherAnimation, keyof typeof Ionicons.glyphMap> = {
  sun: 'sunny',
  moon: 'moon',
  cloud: 'cloud',
  'cloud-sun': 'partly-sunny',
  fog: 'cloud',
  drizzle: 'rainy',
  rain: 'rainy',
  snow: 'snow',
  thunder: 'thunderstorm',
};

interface WeatherIconProps {
  type: WeatherAnimation;
  size?: number;
  color?: string;
}

export function WeatherIcon({ type, size = 24, color = '#fff' }: WeatherIconProps) {
  return <Ionicons name={ICON_NAME[type]} size={size} color={color} />;
}
