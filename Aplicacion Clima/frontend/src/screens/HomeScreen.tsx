import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { WeatherView } from '@/components/weather/WeatherView';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useWeather } from '@/hooks/useWeather';
import { useWeatherNotifications } from '@/hooks/useWeatherNotifications';

export function HomeScreen() {
  const location = useCurrentLocation();
  const weather = useWeather({
    latitude: location.data?.latitude ?? 0,
    longitude: location.data?.longitude ?? 0,
    city: location.data?.city ?? '',
    country: location.data?.country ?? '',
    enabled: !!location.data,
  });

  useWeatherNotifications(weather.data);

  if (location.isPending) {
    return (
      <View style={[styles.center, styles.fallbackBg]}>
        <ActivityIndicator color="#fff" size="large" />
        <Text style={styles.fallbackText}>Obteniendo tu ubicación…</Text>
      </View>
    );
  }

  if (location.isError) {
    return (
      <View style={[styles.center, styles.fallbackBg]}>
        <Ionicons name="location-outline" size={48} color="rgba(255,255,255,0.8)" />
        <Text style={styles.fallbackTitle}>No pudimos acceder a tu ubicación</Text>
        <Text style={styles.fallbackText}>Buscá una ciudad manualmente para ver su clima.</Text>
        <Pressable style={styles.searchButton} onPress={() => router.push('/search')}>
          <Ionicons name="search" size={16} color="#0B1226" />
          <Text style={styles.searchButtonText}>Buscar ciudad</Text>
        </Pressable>
      </View>
    );
  }

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
        <Text style={styles.fallbackText}>Revisá tu conexión e intentá de nuevo.</Text>
      </View>
    );
  }

  return (
    <WeatherView
      data={weather.data}
      isRefreshing={weather.isFetching && !weather.isPending}
      onRefresh={() => weather.refetch()}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
});
