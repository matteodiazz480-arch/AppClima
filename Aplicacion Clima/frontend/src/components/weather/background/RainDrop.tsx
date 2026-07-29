import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface RainDropProps {
  left: number;
  duration: number;
  delay: number;
}

export function RainDrop({ left, duration, delay }: RainDropProps) {
  const { height } = useWindowDimensions();
  const translateY = useSharedValue(-40);

  useEffect(() => {
    translateY.value = -40;
    translateY.value = withDelay(
      delay,
      withRepeat(withTiming(height + 40, { duration, easing: Easing.linear }), -1, false, undefined, ReduceMotion.Never),
      ReduceMotion.Never
    );
  }, [height, duration, delay]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: '12deg' }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left,
          width: 2,
          height: 16,
          borderRadius: 1,
          backgroundColor: 'rgba(200,225,255,0.55)',
        },
        style,
      ]}
    />
  );
}
