import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import type { OutfitItem } from '@/utils/insights/outfit';

interface OutfitCardProps {
  items: OutfitItem[];
}

export function OutfitCard({ items }: OutfitCardProps) {
  return (
    <GlassCard>
      <Text style={styles.title}>¿Qué me pongo hoy?</Text>
      <View style={styles.row}>
        {items.map((item) => (
          <View key={item.label} style={styles.chip}>
            <MaterialCommunityIcons name={item.icon} size={16} color="#fff" />
            <Text style={styles.chipLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
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
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  chipLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
