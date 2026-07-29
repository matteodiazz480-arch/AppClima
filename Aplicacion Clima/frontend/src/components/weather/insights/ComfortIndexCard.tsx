import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import type { ComfortIndex } from '@/utils/insights/comfortIndex';

interface ComfortIndexCardProps {
  comfort: ComfortIndex;
}

export function ComfortIndexCard({ comfort }: ComfortIndexCardProps) {
  return (
    <GlassCard>
      <Text style={styles.title}>Índice de comodidad</Text>
      <View style={styles.row}>
        <MaterialCommunityIcons name={comfort.icon} size={34} color="#fff" />
        <View style={styles.info}>
          <Text style={styles.label}>{comfort.label}</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${comfort.score}%` }]} />
          </View>
        </View>
        <Text style={styles.score}>{comfort.score}</Text>
      </View>
      <Text style={styles.factor}>{comfort.factor}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  title: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8FCBEB',
  },
  score: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  factor: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    marginTop: 10,
  },
});
