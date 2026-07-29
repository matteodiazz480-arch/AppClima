import { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { Star } from '@/components/weather/background/Star';

const STAR_COUNT = 22;

export function StarsLayer() {
  const { width, height } = useWindowDimensions();

  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => ({
        id: i,
        top: Math.random() * height * 0.55,
        left: Math.random() * width,
        size: 1.5 + Math.random() * 2,
        delay: Math.random() * 2000,
      })),
    [width, height]
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((s) => (
        <Star key={s.id} top={s.top} left={s.left} size={s.size} delay={s.delay} />
      ))}
    </View>
  );
}
