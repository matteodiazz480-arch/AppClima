import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { getWeatherCodeInfo } from '@/constants/weatherCodes';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useWeather } from '@/hooks/useWeather';
import { computePetWeather } from '@/utils/insights/petWeather';

export function PetsScreen() {
  const insets = useSafeAreaInsets();
  const location = useCurrentLocation();
  const weather = useWeather({
    latitude: location.data?.latitude ?? 0,
    longitude: location.data?.longitude ?? 0,
    city: location.data?.city ?? '',
    country: location.data?.country ?? '',
    enabled: !!location.data,
  });

  if (location.isPending || weather.isPending) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title="Clima para mascotas" />
        <ActivityIndicator color="#fff" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (location.isError || weather.isError || !weather.data) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title="Clima para mascotas" />
        <Text style={styles.errorText}>No se pudo cargar el clima.</Text>
      </SafeAreaView>
    );
  }

  const { current, daily, sun } = weather.data;
  const { icon } = getWeatherCodeInfo(current.weatherCode, current.isDay);
  const petWeather = computePetWeather(current, daily[0], sun, icon);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Clima para mascotas" />
      <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <GlassCard>
          <View style={styles.activityRow}>
            <View style={styles.activityIconWrap}>
              <MaterialCommunityIcons name={petWeather.activityLevel.icon} size={26} color="#8FCBEB" />
            </View>
            <View style={styles.activityTextWrap}>
              <Text style={styles.activityLabel}>{petWeather.activityLevel.label}</Text>
              <Text style={styles.activityDescription}>{petWeather.activityLevel.description}</Text>
            </View>
          </View>
        </GlassCard>

        <View style={{ height: 16 }} />

        <GlassCard>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="rgba(255,255,255,0.75)" />
            <Text style={styles.cardTitle}>Mejor horario para pasear</Text>
          </View>
          <Text style={styles.rowText}>{petWeather.bestWalkTime}</Text>
        </GlassCard>

        {petWeather.careTips.length > 0 && (
          <>
            <View style={{ height: 16 }} />
            <GlassCard>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="paw" size={16} color="rgba(255,255,255,0.75)" />
                <Text style={styles.cardTitle}>Cuidados recomendados</Text>
              </View>
              {petWeather.careTips.map((tip) => (
                <View key={tip.message} style={styles.tipRow}>
                  <MaterialCommunityIcons name={tip.icon} size={18} color="#8FCBEB" />
                  <Text style={styles.tipText}>{tip.message}</Text>
                </View>
              ))}
            </GlassCard>
          </>
        )}

        {petWeather.warningSigns && (
          <>
            <View style={{ height: 16 }} />
            <GlassCard style={styles.warningCard}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="alert-decagram-outline" size={16} color="#FFB74D" />
                <Text style={styles.cardTitle}>{petWeather.warningSigns.title}</Text>
              </View>
              {petWeather.warningSigns.signs.map((sign) => (
                <View key={sign} style={styles.signRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.signText}>{sign}</Text>
                </View>
              ))}
            </GlassCard>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2A4A',
  },
  content: {
    paddingHorizontal: 16,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  activityIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(143,203,235,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTextWrap: {
    flex: 1,
  },
  activityLabel: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  activityDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  cardTitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  rowText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  tipText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  warningCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#FFB74D',
  },
  signRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 3,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFB74D',
  },
  signText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  errorText: {
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: 40,
  },
});
