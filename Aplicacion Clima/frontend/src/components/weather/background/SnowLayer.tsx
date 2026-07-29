import { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { SnowFlake } from '@/components/weather/background/SnowFlake';

export function SnowLayer() {
  const { width } = useWindowDimensions();

  const flakes = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * width,
        size: 3 + Math.random() * 4,
        duration: 5000 + Math.random() * 4000,
        delay: Math.random() * 3000,
      })),
    [width]
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {flakes.map((f) => (
        <SnowFlake key={f.id} left={f.left} size={f.size} duration={f.duration} delay={f.delay} />
      ))}
    </View>
  );
}
