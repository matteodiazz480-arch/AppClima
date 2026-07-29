import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import type { ActivitySuggestion } from '@/utils/insights/activities';

interface ActivitiesCardProps {
  suggestions: ActivitySuggestion[];
}

export function ActivitiesCard({ suggestions }: ActivitiesCardProps) {
  return (
    <GlassCard>
      <Text style={styles.title}>Actividades recomendadas</Text>
      {suggestions.map((suggestion) => (
        <View key={suggestion.label} style={styles.row}>
          <MaterialCommunityIcons name={suggestion.icon} size={18} color="#8FCBEB" />
          <Text style={styles.text}>{suggestion.label}</Text>
        </View>
      ))}
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
