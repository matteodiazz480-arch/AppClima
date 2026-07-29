import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { getWeatherCodeInfo } from '@/constants/weatherCodes';
import { useCitySearch } from '@/hooks/useCitySearch';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useDailyForecast } from '@/hooks/useDailyForecast';
import { useWeather } from '@/hooks/useWeather';
import type { GeocodingResult } from '@/types/weather';
import { computeTripAdvice } from '@/utils/insights/tripAdvice';

interface TripLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

type ActiveField = 'origin' | 'destination' | null;

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function buildUpcomingDays(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const label = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : `${WEEKDAYS[date.getDay()]} ${date.getDate()}`;
    return { index: i, label };
  });
}

function toTripLocation(city: GeocodingResult): TripLocation {
  return { name: city.name, country: city.country, latitude: city.latitude, longitude: city.longitude };
}

export function TripScreen() {
  const location = useCurrentLocation();
  const [origin, setOrigin] = useState<TripLocation | null>(null);
  const [destination, setDestination] = useState<TripLocation | null>(null);
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [dayIndex, setDayIndex] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (location.data && !origin) {
      setOrigin({
        name: location.data.city,
        country: location.data.country,
        latitude: location.data.latitude,
        longitude: location.data.longitude,
      });
    }
  }, [location.data]);

  const search = useCitySearch(query);
  const upcomingDays = useMemo(() => buildUpcomingDays(16), []);

  const originWeather = useWeather({
    latitude: origin?.latitude ?? 0,
    longitude: origin?.longitude ?? 0,
    city: origin?.name ?? '',
    country: origin?.country ?? '',
    enabled: !!origin,
  });

  const forecast = useDailyForecast(
    destination ? { latitude: destination.latitude, longitude: destination.longitude } : null,
    (dayIndex ?? 0) + 1
  );

  const selectedDay = dayIndex !== null ? forecast.data?.[dayIndex] : undefined;

  const selectCity = (city: GeocodingResult) => {
    const tripLocation = toTripLocation(city);
    if (activeField === 'origin') setOrigin(tripLocation);
    if (activeField === 'destination') setDestination(tripLocation);
    setActiveField(null);
    setQuery('');
  };

  if (activeField) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={activeField === 'origin' ? '¿Desde dónde salís?' : '¿A dónde viajás?'} />
        <View style={styles.section}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="rgba(255,255,255,0.6)" />
            <TextInput
              style={styles.input}
              placeholder="Buscar ciudad"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              autoFocus
            />
          </View>
          {search.isFetching && <ActivityIndicator style={{ marginTop: 20 }} color="rgba(255,255,255,0.8)" />}
          <FlatList
            data={search.data ?? []}
            keyExtractor={(item) => String(item.id)}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable style={styles.resultRow} onPress={() => selectCity(item)}>
                <Ionicons name="location" size={18} color="rgba(255,255,255,0.6)" />
                <Text style={styles.resultText}>
                  {item.name}, {item.country}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!destination) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title="Modo viaje" />
        <View style={styles.section}>
          <Text style={styles.pickLabel}>Contanos tu viaje</Text>

          <Pressable style={styles.locationBlock} onPress={() => setActiveField('origin')}>
            <View style={styles.locationIconWrap}>
              <MaterialCommunityIcons name="map-marker-outline" size={20} color="#8FCBEB" />
            </View>
            <View style={styles.locationTextWrap}>
              <Text style={styles.locationLabel}>Desde</Text>
              <Text style={styles.locationValue}>
                {origin ? `${origin.name}, ${origin.country}` : 'Toca para elegir'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.35)" />
          </Pressable>

          <View style={{ height: 12 }} />

          <Pressable style={styles.locationBlock} onPress={() => setActiveField('destination')}>
            <View style={styles.locationIconWrap}>
              <MaterialCommunityIcons name="airplane-takeoff" size={20} color="#8FCBEB" />
            </View>
            <View style={styles.locationTextWrap}>
              <Text style={styles.locationLabel}>Hasta</Text>
              <Text style={styles.locationValue}>Toca para elegir</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.35)" />
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (dayIndex === null) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title="Modo viaje" />
        <View style={styles.section}>
          <Text style={styles.destinationLabel}>
            {destination.name}, {destination.country}
          </Text>
          <Pressable onPress={() => setDestination(null)}>
            <Text style={styles.changeLink}>Cambiar destino</Text>
          </Pressable>
          <Text style={styles.pickLabel}>¿Qué día viajás?</Text>
          <ScrollView contentContainerStyle={styles.dayGrid}>
            {upcomingDays.map((day) => (
              <Pressable key={day.index} style={styles.dayChip} onPress={() => setDayIndex(day.index)}>
                <Text style={styles.dayChipText}>{day.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Modo viaje" />
      <ScrollView style={styles.section} contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={styles.destinationLabel}>
          {destination.name}, {destination.country}
        </Text>
        <Pressable onPress={() => setDayIndex(null)}>
          <Text style={styles.changeLink}>Elegir otro día</Text>
        </Pressable>

        {forecast.isPending && <ActivityIndicator style={{ marginTop: 24 }} color="#fff" />}

        {selectedDay && (
          <>
            <View style={{ height: 16 }} />
            <TripResult day={selectedDay} origin={origin} originTemp={originWeather.data?.current.temperature} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const RAIN_RISK_LABEL: Record<'low' | 'moderate' | 'high', string> = {
  low: 'Riesgo bajo de lluvia',
  moderate: 'Riesgo moderado de lluvia',
  high: 'Riesgo alto de lluvia',
};

const RAIN_RISK_COLOR: Record<'low' | 'moderate' | 'high', string> = {
  low: '#4CAF50',
  moderate: '#FFB74D',
  high: '#4FC3F7',
};

interface TripResultProps {
  day: NonNullable<ReturnType<typeof useDailyForecast>['data']>[number];
  origin: TripLocation | null;
  originTemp: number | undefined;
}

function TripResult({ day, origin, originTemp }: TripResultProps) {
  const { label, icon } = getWeatherCodeInfo(day.weatherCode, true);
  const advice = computeTripAdvice(day, icon);
  const tempDiff = originTemp !== undefined ? Math.round(day.temperatureMax - originTemp) : null;

  return (
    <>
      <GlassCard>
        <View style={styles.weatherRow}>
          <WeatherIcon type={icon} size={40} />
          <View>
            <Text style={styles.tempText}>
              {day.temperatureMax}° / {day.temperatureMin}°
            </Text>
            <Text style={styles.conditionText}>{label}</Text>
          </View>
        </View>
        <View style={styles.rainRow}>
          <MaterialCommunityIcons name="weather-pouring" size={16} color={RAIN_RISK_COLOR[advice.rainRisk]} />
          <Text style={styles.rainText}>
            {day.precipitationProbability}% de probabilidad de lluvia · {RAIN_RISK_LABEL[advice.rainRisk]}
          </Text>
        </View>
        {advice.temperatureSwing >= 10 && (
          <View style={styles.rainRow}>
            <MaterialCommunityIcons name="thermometer" size={16} color="rgba(255,255,255,0.7)" />
            <Text style={styles.rainText}>Diferencia térmica de {advice.temperatureSwing}°C entre día y noche</Text>
          </View>
        )}
        {tempDiff !== null && origin && Math.abs(tempDiff) >= 3 && (
          <View style={styles.rainRow}>
            <MaterialCommunityIcons
              name={tempDiff > 0 ? 'thermometer-chevron-up' : 'thermometer-chevron-down'}
              size={16}
              color="rgba(255,255,255,0.7)"
            />
            <Text style={styles.rainText}>
              {tempDiff > 0 ? `${tempDiff}°C más` : `${Math.abs(tempDiff)}°C menos`} que ahora en {origin.name}
            </Text>
          </View>
        )}
      </GlassCard>

      <View style={{ height: 16 }} />

      <GlassCard>
        <Text style={styles.cardTitle}>Ropa recomendada</Text>
        <View style={styles.chipRow}>
          {advice.clothing.map((item) => (
            <View key={item.label} style={styles.chip}>
              <MaterialCommunityIcons name={item.icon} size={16} color="#fff" />
              <Text style={styles.chipLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <View style={{ height: 16 }} />

      <GlassCard>
        <View style={styles.tipRow}>
          <MaterialCommunityIcons name="lightbulb-outline" size={18} color="#8FCBEB" />
          <Text style={styles.tipText}>{advice.activitySuggestion}</Text>
        </View>
      </GlassCard>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2A4A',
  },
  section: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  resultText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  locationBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  locationIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextWrap: {
    flex: 1,
  },
  locationLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  locationValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  destinationLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },
  changeLink: {
    color: '#8FCBEB',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  pickLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 14,
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dayChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  tempText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  conditionText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
  },
  rainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  rainText: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  cardTitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  chipRow: {
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
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19,
  },
});
