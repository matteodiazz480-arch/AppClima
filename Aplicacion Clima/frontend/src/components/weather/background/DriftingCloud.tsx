import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface DriftingCloudProps {
  top: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

export function DriftingCloud({ top, size, opacity, duration, delay, color }: DriftingCloudProps) {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(-size - delay);

  useEffect(() => {
    translateX.value = -size - delay;
    translateX.value = withRepeat(
      withTiming(width + size, { duration, easing: Easing.linear }),
      -1,
      false,
      undefined,
      ReduceMotion.Never
    );
  }, [width, duration, delay]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[{ position: 'absolute', top }, style]}>
      <Ionicons name="cloud" size={size} color={color} style={{ opacity }} />
    </Animated.View>
  );
}
