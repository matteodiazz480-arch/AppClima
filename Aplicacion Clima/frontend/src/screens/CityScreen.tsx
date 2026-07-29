import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { WeatherView } from '@/components/weather/WeatherView';
import { useWeather } from '@/hooks/useWeather';

export function CityScreen() {
  const params = useLocalSearchParams<{ lat: string; lon: string; name: string; country: string }>();
  const latitude = Number(params.lat);
  const longitude = Number(params.lon);
  const name = params.name ?? '';
  const country = params.country ?? '';

  const weather = useWeather({ latitude, longitude, city: name, country });

  const backButton = (
    <Pressable style={styles.iconButton} onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={20} color="#fff" />
    </Pressable>
  );

  if (weather.isPending) {
    return (
      <View style={[styles.center, styles.fallbackBg]}>
        <ActivityIndicator color="#fff" size="large" />
        <Text style={styles.fallbackText}>Cargando el clima…</Text>
      </View>
    );
  }

  if (weather.isError || !weather.data) {
    return (
      <View style={[styles.center, styles.fallbackBg]}>
        <Ionicons name="cloud-offline-outline" size={48} color="rgba(255,255,255,0.8)" />
        <Text style={styles.fallbackTitle}>No se pudo cargar el clima</Text>
        <Pressable style={styles.searchButton} onPress={() => router.back()}>
          <Text style={styles.searchButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <WeatherView
      data={weather.data}
      isRefreshing={weather.isFetching && !weather.isPending}
      onRefresh={() => weather.refetch()}
      headerLeft={backButton}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  fallbackBg: {
    backgroundColor: '#1B2A4A',
  },
  fallbackTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  fallbackText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    textAlign: 'center',
  },
  searchButton: {
    marginTop: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  searchButtonText: {
    color: '#0B1226',
    fontWeight: '700',
    fontSize: 15,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
