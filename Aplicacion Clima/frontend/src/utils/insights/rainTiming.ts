import type { RainTiming } from '@/types/weather';

const RAIN_THRESHOLD_MM = 0.1;

interface MinutelyPrecipitation {
  time: string[];
  precipitation: number[];
}

export function computeRainTiming(currentTime: string, minutely?: MinutelyPrecipitation): RainTiming {
  if (!minutely || minutely.time.length === 0) return { state: 'none' };

  const nowIndex = minutely.time.findIndex((t) => t >= currentTime);
  const startIndex = nowIndex >= 0 ? nowIndex : 0;

  const isRainingNow = minutely.precipitation[startIndex] >= RAIN_THRESHOLD_MM;

  if (isRainingNow) {
    const stopIndex = minutely.precipitation.findIndex(
      (mm, idx) => idx > startIndex && mm < RAIN_THRESHOLD_MM
    );
    if (stopIndex === -1) return { state: 'raining', minutesUntilStop: null };
    return { state: 'raining', minutesUntilStop: (stopIndex - startIndex) * 15 };
  }

  const startsIndex = minutely.precipitation.findIndex(
    (mm, idx) => idx >= startIndex && mm >= RAIN_THRESHOLD_MM
  );
  if (startsIndex === -1) return { state: 'none' };

  return { state: 'starting', minutesUntilStart: (startsIndex - startIndex) * 15 };
}
