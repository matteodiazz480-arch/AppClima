import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { getWeatherCodeInfo } from '@/constants/weatherCodes';
import type { HourlyForecastItem } from '@/types/weather';
import { formatHour } from '@/utils/date';

interface HourlyForecastRowProps {
  hourly: HourlyForecastItem[];
}

export function HourlyForecastRow({ hourly }: HourlyForecastRowProps) {
  return (
    <GlassCard>
      <Text style={styles.title}>Próximas 24 horas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {hourly.map((item, index) => {
          const { icon } = getWeatherCodeInfo(item.weatherCode, item.isDay);
          return (
            <View key={item.time} style={styles.item}>
              <Text style={styles.hour}>{index === 0 ? 'Ahora' : formatHour(item.time)}</Text>
              <WeatherIcon type={icon} size={22} />
              <Text style={styles.temp}>{item.temperature}°</Text>
              {item.precipitationProbability > 0 && (
                <Text style={styles.rain}>{item.precipitationProbability}%</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
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
  scrollContent: {
    gap: 20,
  },
  item: {
    alignItems: 'center',
    gap: 6,
    minWidth: 36,
  },
  hour: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '500',
  },
  temp: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  rain: {
    color: '#8FCBEB',
    fontSize: 11,
    fontWeight: '600',
  },
});
