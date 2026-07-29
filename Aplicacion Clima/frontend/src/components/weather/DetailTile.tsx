import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';

interface DetailTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

export function DetailTile({ icon, label, value }: DetailTileProps) {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons name={icon} size={14} color="rgba(255,255,255,0.75)" />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  label: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  value: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
});
