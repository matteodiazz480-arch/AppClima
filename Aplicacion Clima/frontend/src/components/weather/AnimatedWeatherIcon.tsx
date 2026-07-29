import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import Animated, {
  Easing,
  ReduceMotion,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

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

const loop = <T,>(animation: T) => withRepeat(animation as never, -1, false, undefined, ReduceMotion.Never);

interface AnimatedWeatherIconProps {
  type: WeatherAnimation;
  size?: number;
  color?: string;
}

export function AnimatedWeatherIcon({ type, size = 96, color = '#fff' }: AnimatedWeatherIconProps) {
  const rotate = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    rotate.value = 0;
    translateY.value = 0;
    scale.value = 1;
    opacity.value = 1;

    switch (type) {
      case 'sun':
        rotate.value = loop(withTiming(360, { duration: 18000, easing: Easing.linear }));
        scale.value = loop(
          withSequence(
            withTiming(1.06, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
            withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) })
          )
        );
        break;
      case 'moon':
        opacity.value = loop(
          withSequence(
            withTiming(0.75, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
            withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) })
          )
        );
        break;
      case 'cloud-sun':
      case 'cloud':
        translateY.value = loop(
          withSequence(
            withTiming(-4, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
            withTiming(4, { duration: 2000, easing: Easing.inOut(Easing.sin) })
          )
        );
        break;
      case 'fog':
        opacity.value = loop(
          withSequence(
            withTiming(0.5, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
            withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) })
          )
        );
        break;
      case 'drizzle':
      case 'rain':
        translateY.value = loop(
          withSequence(
            withTiming(3, { duration: 500, easing: Easing.inOut(Easing.quad) }),
            withTiming(0, { duration: 500, easing: Easing.inOut(Easing.quad) })
          )
        );
        break;
      case 'snow':
        translateY.value = loop(
          withSequence(
            withTiming(5, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
            withTiming(-5, { duration: 1200, easing: Easing.inOut(Easing.sin) })
          )
        );
        rotate.value = loop(
          withSequence(
            withTiming(-8, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
            withTiming(8, { duration: 1200, easing: Easing.inOut(Easing.sin) })
          )
        );
        break;
      case 'thunder':
        opacity.value = loop(
          withSequence(
            withTiming(1, { duration: 120 }),
            withTiming(0.4, { duration: 100 }),
            withTiming(1, { duration: 120 }),
            withTiming(1, { duration: 1600 })
          )
        );
        break;
    }

    return () => {
      cancelAnimation(rotate);
      cancelAnimation(translateY);
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [type]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={ICON_NAME[type]} size={size} color={color} />
    </Animated.View>
  );
}
