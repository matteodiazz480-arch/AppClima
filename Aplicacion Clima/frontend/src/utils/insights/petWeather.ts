import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { WeatherAnimation } from '@/constants/weatherCodes';
import type { CurrentWeather, DailyForecastItem, SunTimes } from '@/types/weather';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export interface ActivityLevel {
  icon: IconName;
  label: string;
  description: string;
}

export interface PetCareTip {
  icon: IconName;
  message: string;
}

export interface WarningSigns {
  title: string;
  signs: string[];
}

export interface PetWeather {
  activityLevel: ActivityLevel;
  bestWalkTime: string;
  careTips: PetCareTip[];
  warningSigns: WarningSigns | null;
}

function getActivityLevel(current: CurrentWeather, icon: WeatherAnimation): ActivityLevel {
  const veryHot = current.temperature >= 30 || (current.temperature >= 27 && current.humidity >= 70);

  if (veryHot) {
    return {
      icon: 'weather-sunny-alert',
      label: 'Solo paseos cortos',
      description: 'El calor puede afectarla rápido. Salí a la sombra y por poco tiempo.',
    };
  }
  if ((icon === 'rain' || icon === 'thunder') && current.precipitationProbability >= 60) {
    return {
      icon: 'home-outline',
      label: 'Mejor jugar adentro',
      description: 'Con lluvia intensa, es más cómodo quedarse en casa hoy.',
    };
  }
  if (current.temperature <= 0) {
    return {
      icon: 'snowflake-alert',
      label: 'Paseos cortos',
      description: 'El frío extremo no es agradable para pasear mucho tiempo.',
    };
  }
  if (current.windSpeed >= 40) {
    return {
      icon: 'weather-windy',
      label: 'Paseo breve',
      description: 'El viento fuerte puede resultar molesto, sobre todo para razas pequeñas.',
    };
  }
  return {
    icon: 'paw',
    label: 'Buen día para pasear',
    description: 'Las condiciones son cómodas para actividad al aire libre.',
  };
}

function formatClock(iso: string): string {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function getBestWalkTime(today: DailyForecastItem | undefined, current: CurrentWeather, sun: SunTimes): string {
  const max = today?.temperatureMax ?? current.temperature;
  const min = today?.temperatureMin ?? current.temperature;

  if (max >= 28) {
    return `Antes de las ${formatClock(sun.sunrise)} o después de las ${formatClock(sun.sunset)}, cuando refresca`;
  }
  if (min <= 3) {
    return `Media mañana o media tarde, evitando el frío cerca del amanecer (${formatClock(sun.sunrise)})`;
  }
  return 'Cualquier momento del día es cómodo, sin condiciones extremas';
}

function getCareTips(current: CurrentWeather, icon: WeatherAnimation): PetCareTip[] {
  const tips: PetCareTip[] = [];

  if (current.temperature >= 26) {
    tips.push({ icon: 'cup-water', message: 'Llevá agua extra: el calor la deshidrata más rápido que a vos.' });
    tips.push({ icon: 'clock-alert-outline', message: 'Evitá las horas de más calor, entre las 12 y las 16hs.' });
  }
  if (current.temperature <= 5) {
    tips.push({ icon: 'tshirt-crew', message: 'En razas pequeñas o de pelo corto, un abrigo ayuda durante el paseo.' });
  }
  if (icon === 'snow') {
    tips.push({ icon: 'shoe-print', message: 'Secá bien sus patas al volver: la nieve y la sal pueden irritarle la piel.' });
  }
  if (icon === 'rain' || icon === 'drizzle') {
    tips.push({ icon: 'hair-dryer-outline', message: 'Secala bien al volver, la humedad prolongada puede irritarle la piel.' });
  }
  if (current.windSpeed >= 30) {
    tips.push({ icon: 'eye-outline', message: 'En paseos largos con viento, protegé sus ojos y oídos del polvo.' });
  }
  if (current.uvIndex >= 8 && current.isDay) {
    tips.push({ icon: 'sunglasses', message: 'Evitá superficies muy expuestas al sol del mediodía.' });
  }

  return tips;
}

function getWarningSigns(current: CurrentWeather): WarningSigns | null {
  if (current.temperature >= 30) {
    return {
      title: 'Señales de golpe de calor',
      signs: ['Jadeo excesivo', 'Encías rojas o pálidas', 'Vómitos o diarrea', 'Debilidad o desorientación'],
    };
  }
  if (current.temperature <= -2) {
    return {
      title: 'Señales de hipotermia',
      signs: ['Temblores', 'Letargo o debilidad', 'Piel fría al tacto', 'Respiración lenta'],
    };
  }
  return null;
}

export function computePetWeather(
  current: CurrentWeather,
  today: DailyForecastItem | undefined,
  sun: SunTimes,
  icon: WeatherAnimation
): PetWeather {
  return {
    activityLevel: getActivityLevel(current, icon),
    bestWalkTime: getBestWalkTime(today, current, sun),
    careTips: getCareTips(current, icon),
    warningSigns: getWarningSigns(current),
  };
}
