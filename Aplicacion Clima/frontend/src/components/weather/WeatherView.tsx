import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedWeatherIcon } from '@/components/weather/AnimatedWeatherIcon';
import { WeatherBackground } from '@/components/weather/background/WeatherBackground';
import { DailyForecastRow } from '@/components/weather/DailyForecastRow';
import { DetailTile } from '@/components/weather/DetailTile';
import { HourlyForecastRow } from '@/components/weather/HourlyForecastRow';
import { ActivitiesCard } from '@/components/weather/insights/ActivitiesCard';
import { ComfortIndexCard } from '@/components/weather/insights/ComfortIndexCard';
import { DrivingCard } from '@/components/weather/insights/DrivingCard';
import { OutfitCard } from '@/components/weather/insights/OutfitCard';
import { RainTimingBanner } from '@/components/weather/insights/RainTimingBanner';
import { getWeatherGradient } from '@/constants/gradients';
import { getWeatherCodeInfo } from '@/constants/weatherCodes';
import type { WeatherData } from '@/types/weather';
import { getActivitySuggestions } from '@/utils/insights/activities';
import { computeComfortIndex } from '@/utils/insights/comfortIndex';
import { getDrivingWarnings } from '@/utils/insights/driving';
import { getOutfitSuggestions } from '@/utils/insights/outfit';
import { degreesToCompass } from '@/utils/windDirection';

interface WeatherViewProps {
  data: WeatherData;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  headerLeft?: ReactNode;
}

export function WeatherView({ data, isRefreshing = false, onRefresh, headerLeft }: WeatherViewProps) {
  const insets = useSafeAreaInsets();

  const { current, hourly, daily, location: place, nextRain } = data;
  const { label, icon } = getWeatherCodeInfo(current.weatherCode, current.isDay);
  const gradient = getWeatherGradient(icon, current.isDay);
  const today = daily[0];

  const comfort = computeComfortIndex(current);
  const outfit = getOutfitSuggestions(current, icon);
  const driving = getDrivingWarnings(current, icon);
  const activities = getActivitySuggestions(current, icon);

  return (
    <LinearGradient colors={gradient} style={styles.flex}>
      <WeatherBackground icon={icon} isDay={current.isDay} />

      {headerLeft && (
        <View style={[styles.toolbar, { top: insets.top + 8 }]} pointerEvents="box-none">
          {headerLeft}
        </View>
      )}

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + (headerLeft ? 52 : 12), paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#fff" /> : undefined
        }
      >
        <View style={styles.header}>
          <Text style={styles.city}>{place.city}</Text>
          <Text style={styles.country}>{place.country}</Text>
        </View>

        <View style={styles.hero}>
          <AnimatedWeatherIcon type={icon} size={110} />
          <Text style={styles.temperature}>{current.temperature}°</Text>
          <Text style={styles.condition}>{label}</Text>
          {today && (
            <Text style={styles.minMax}>
              Máx: {today.temperatureMax}°  Mín: {today.temperatureMin}°
            </Text>
          )}
          <Text style={styles.feelsLike}>Sensación térmica: {current.apparentTemperature}°</Text>
        </View>

        <RainTimingBanner timing={nextRain} />

        <HourlyForecastRow hourly={hourly} />

        <View style={{ height: 16 }} />

        <DailyForecastRow daily={daily} />

        <View style={{ height: 16 }} />

        <View style={styles.grid}>
          <DetailTile icon="water-outline" label="Humedad" value={`${current.humidity}%`} />
          <DetailTile icon="speedometer-outline" label="Presión" value={`${current.pressure} hPa`} />
          <DetailTile icon="eye-outline" label="Visibilidad" value={`${current.visibility} km`} />
          <DetailTile
            icon="navigate-outline"
            label="Viento"
            value={`${current.windSpeed} km/h ${degreesToCompass(current.windDirection)}`}
          />
          <DetailTile icon="sunny-outline" label="Índice UV" value={`${current.uvIndex}`} />
          <DetailTile icon="rainy-outline" label="Prob. lluvia" value={`${current.precipitationProbability}%`} />
        </View>

        <View style={{ height: 16 }} />

        <ComfortIndexCard comfort={comfort} />

        <View style={{ height: 16 }} />

        <OutfitCard items={outfit} />

        <View style={{ height: 16 }} />

        <ActivitiesCard suggestions={activities} />

        <View style={{ height: 16 }} />

        <DrivingCard warnings={driving} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  toolbar: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  city: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  country: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  temperature: {
    fontSize: 88,
    fontWeight: '200',
    color: '#fff',
    marginTop: -8,
  },
  condition: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  minMax: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
    fontWeight: '500',
  },
  feelsLike: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
