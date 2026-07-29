import { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { DriftingCloud } from '@/components/weather/background/DriftingCloud';

interface CloudsLayerProps {
  density?: 'light' | 'heavy';
  color?: string;
}

export function CloudsLayer({ density = 'light', color = 'rgba(255,255,255,0.8)' }: CloudsLayerProps) {
  const { height } = useWindowDimensions();
  const count = density === 'heavy' ? 6 : 4;

  const clouds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const depth = i % 2 === 0 ? 1 : 0.6;
        return {
          id: i,
          top: 40 + (height * 0.35 * i) / count + Math.random() * 30,
          size: 60 * depth + Math.random() * 20,
          opacity: 0.25 + depth * 0.35,
          duration: 26000 / depth + Math.random() * 6000,
          delay: i * 4000,
        };
      }),
    [count, height]
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {clouds.map((c) => (
        <DriftingCloud
          key={c.id}
          top={c.top}
          size={c.size}
          opacity={c.opacity}
          duration={c.duration}
          delay={c.delay}
          color={color}
        />
      ))}
    </View>
  );
}
