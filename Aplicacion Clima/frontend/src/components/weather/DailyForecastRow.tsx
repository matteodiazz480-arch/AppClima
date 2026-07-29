import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { getWeatherCodeInfo } from '@/constants/weatherCodes';
import type { DailyForecastItem } from '@/types/weather';
import { parseLocalDate } from '@/utils/date';

interface DailyForecastRowProps {
  daily: DailyForecastItem[];
}

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function formatDay(iso: string, index: number): string {
  if (index === 0) return 'Hoy';
  return WEEKDAYS[parseLocalDate(iso).getDay()];
}

export function DailyForecastRow({ daily }: DailyForecastRowProps) {
  const min = Math.min(...daily.map((d) => d.temperatureMin));
  const max = Math.max(...daily.map((d) => d.temperatureMax));
  const range = max - min || 1;

  return (
    <GlassCard>
      <Text style={styles.title}>Pronóstico de 7 días</Text>
      {daily.map((item, index) => {
        const { icon } = getWeatherCodeInfo(item.weatherCode, true);
        const barStart = ((item.temperatureMin - min) / range) * 100;
        const barWidth = ((item.temperatureMax - item.temperatureMin) / range) * 100;
        return (
          <View key={item.date} style={styles.row}>
            <Text style={styles.day}>{formatDay(item.date, index)}</Text>
            <WeatherIcon type={icon} size={20} />
            <Text style={styles.minTemp}>{item.temperatureMin}°</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { left: `${barStart}%`, width: `${barWidth}%` }]} />
            </View>
            <Text style={styles.maxTemp}>{item.temperatureMax}°</Text>
          </View>
        );
      })}
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
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  day: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    width: 42,
  },
  minTemp: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    width: 26,
    textAlign: 'right',
  },
  maxTemp: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
  barTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  barFill: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8FCBEB',
  },
});
