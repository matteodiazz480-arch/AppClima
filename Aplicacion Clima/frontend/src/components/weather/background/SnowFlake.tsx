import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface SnowFlakeProps {
  left: number;
  size: number;
  duration: number;
  delay: number;
}

export function SnowFlake({ left, size, duration, delay }: SnowFlakeProps) {
  const { height } = useWindowDimensions();
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateY.value = -20;
    translateY.value = withDelay(
      delay,
      withRepeat(withTiming(height + 20, { duration, easing: Easing.linear }), -1, false, undefined, ReduceMotion.Never),
      ReduceMotion.Never
    );
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(10, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
          withTiming(-10, { duration: 1400, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false,
        undefined,
        ReduceMotion.Never
      ),
      ReduceMotion.Never
    );
  }, [height, duration, delay]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'rgba(255,255,255,0.85)',
        },
        style,
      ]}
    />
  );
}
