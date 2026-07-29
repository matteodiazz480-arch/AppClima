import { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { RainDrop } from '@/components/weather/background/RainDrop';

interface RainLayerProps {
  density?: 'light' | 'heavy';
}

export function RainLayer({ density = 'heavy' }: RainLayerProps) {
  const { width } = useWindowDimensions();
  const count = density === 'heavy' ? 40 : 18;

  const drops = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * width,
        duration: 550 + Math.random() * 500,
        delay: Math.random() * 1500,
      })),
    [count, width]
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {drops.map((d) => (
        <RainDrop key={d.id} left={d.left} duration={d.duration} delay={d.delay} />
      ))}
    </View>
  );
}
