import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import type { DrivingWarning } from '@/utils/insights/driving';

interface DrivingCardProps {
  warnings: DrivingWarning[];
}

export function DrivingCard({ warnings }: DrivingCardProps) {
  return (
    <GlassCard>
      <Text style={styles.title}>Clima para conducir</Text>
      {warnings.length === 0 ? (
        <View style={styles.row}>
          <MaterialCommunityIcons name="car" size={18} color="#4CAF50" />
          <Text style={styles.text}>Buenas condiciones para manejar</Text>
        </View>
      ) : (
        warnings.map((warning) => (
          <View key={warning.label} style={styles.row}>
            <MaterialCommunityIcons name={warning.icon} size={18} color="#FFB74D" />
            <Text style={styles.text}>{warning.label}</Text>
          </View>
        ))
      )}
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
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});
