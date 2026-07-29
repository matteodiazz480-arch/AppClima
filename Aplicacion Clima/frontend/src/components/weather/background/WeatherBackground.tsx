import { StyleSheet, View } from 'react-native';

import { CloudsLayer } from '@/components/weather/background/CloudsLayer';
import { RainLayer } from '@/components/weather/background/RainLayer';
import { SnowLayer } from '@/components/weather/background/SnowLayer';
import { StarsLayer } from '@/components/weather/background/StarsLayer';
import { SunGlow } from '@/components/weather/background/SunGlow';
import type { WeatherAnimation } from '@/constants/weatherCodes';

interface WeatherBackgroundProps {
  icon: WeatherAnimation;
  isDay: boolean;
}

export function WeatherBackground({ icon, isDay }: WeatherBackgroundProps) {
  const showStars = !isDay && icon !== 'thunder';
  const cloudColor = isDay ? 'rgba(255,255,255,0.85)' : 'rgba(220,225,240,0.5)';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {icon === 'sun' && isDay && <SunGlow />}
      {showStars && <StarsLayer />}

      {(icon === 'cloud' || icon === 'cloud-sun' || icon === 'fog') && (
        <CloudsLayer density="light" color={cloudColor} />
      )}

      {icon === 'drizzle' && (
        <>
          <CloudsLayer density="light" color={cloudColor} />
          <RainLayer density="light" />
        </>
      )}

      {icon === 'rain' && (
        <>
          <CloudsLayer density="heavy" color={cloudColor} />
          <RainLayer density="heavy" />
        </>
      )}

      {icon === 'thunder' && (
        <>
          <CloudsLayer density="heavy" color="rgba(180,185,200,0.6)" />
          <RainLayer density="heavy" />
        </>
      )}

      {icon === 'snow' && (
        <>
          <CloudsLayer density="light" color={cloudColor} />
          <SnowLayer />
        </>
      )}
    </View>
  );
}
