import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuEntry {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  route: '/pets' | '/trip';
}

const ENTRIES: MenuEntry[] = [
  { icon: 'paw', title: 'Clima para mascotas', subtitle: 'Cuidados y recomendaciones según el clima', route: '/pets' },
  { icon: 'airplane', title: 'Modo viaje', subtitle: 'Clima y recomendaciones para tu próximo destino', route: '/trip' },
];

export function MoreScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Más</Text>

      {ENTRIES.map((entry) => (
        <Pressable key={entry.route} style={styles.row} onPress={() => router.push(entry.route)}>
          <View style={styles.iconWrap}>
            <Ionicons name={entry.icon} size={20} color="#8FCBEB" />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.rowTitle}>{entry.title}</Text>
            <Text style={styles.rowSubtitle}>{entry.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.35)" />
        </Pressable>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2A4A',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  rowTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rowSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    marginTop: 2,
  },
});
