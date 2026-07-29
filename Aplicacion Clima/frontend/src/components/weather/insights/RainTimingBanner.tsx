import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import type { RainTiming } from '@/types/weather';

interface RainTimingBannerProps {
  timing: RainTiming;
}

function getMessage(timing: RainTiming): string | null {
  if (timing.state === 'starting') {
    return `Comenzará a llover en ${timing.minutesUntilStart} minutos.`;
  }
  if (timing.state === 'raining') {
    return timing.minutesUntilStop !== null
      ? `Está lloviendo. Para en ${timing.minutesUntilStop} minutos.`
      : 'Está lloviendo en este momento.';
  }
  return null;
}

export function RainTimingBanner({ timing }: RainTimingBannerProps) {
  const message = getMessage(timing);
  if (!message) return null;

  return (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        <MaterialCommunityIcons name="weather-pouring" size={22} color="#8FCBEB" />
        <Text style={styles.text}>{message}</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
