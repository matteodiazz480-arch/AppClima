import type { WeatherAnimation } from '@/constants/weatherCodes';

type GradientColors = readonly [string, string, ...string[]];

const DAY_GRADIENTS: Record<WeatherAnimation, GradientColors> = {
  sun: ['#4DA0E8', '#8FCBEB'],
  moon: ['#1B2A4A', '#3A4E7A'],
  cloud: ['#7C8FA6', '#A9B7C8'],
  'cloud-sun': ['#5B9BD5', '#9DC3E6'],
  fog: ['#8C97A3', '#B9C2CB'],
  drizzle: ['#5B7088', '#88A0B6'],
  rain: ['#41546B', '#5F7690'],
  snow: ['#7B93A8', '#C4D3DE'],
  thunder: ['#232B3E', '#3E4A63'],
};

const NIGHT_GRADIENTS: Record<WeatherAnimation, GradientColors> = {
  sun: ['#0F1C3F', '#2A3B66'],
  moon: ['#0B1226', '#1E2A4A'],
  cloud: ['#232C3D', '#3B4658'],
  'cloud-sun': ['#151E38', '#2A3552'],
  fog: ['#22262E', '#3A4048'],
  drizzle: ['#151E2E', '#2A3846'],
  rain: ['#10151F', '#232E3D'],
  snow: ['#1B2536', '#33445A'],
  thunder: ['#0B0E17', '#1D2333'],
};

export function getWeatherGradient(icon: WeatherAnimation, isDay: boolean): GradientColors {
  return isDay ? DAY_GRADIENTS[icon] : NIGHT_GRADIENTS[icon];
}
