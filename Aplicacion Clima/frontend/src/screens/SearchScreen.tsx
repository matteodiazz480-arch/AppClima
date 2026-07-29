import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCitySearch } from '@/hooks/useCitySearch';
import type { GeocodingResult } from '@/types/weather';

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const search = useCitySearch(query);

  const openCity = (city: GeocodingResult) => {
    router.push({
      pathname: '/city',
      params: {
        lat: String(city.latitude),
        lon: String(city.longitude),
        name: city.name,
        country: city.country,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="rgba(255,255,255,0.6)" />
        <TextInput
          style={styles.input}
          placeholder="Buscar ciudad"
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.5)" />
          </Pressable>
        )}
      </View>

      {search.isFetching && (
        <ActivityIndicator style={styles.loader} color="rgba(255,255,255,0.8)" />
      )}

      {!search.isFetching && query.trim().length >= 2 && (search.data?.length ?? 0) === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={36} color="rgba(255,255,255,0.4)" />
          <Text style={styles.emptyText}>No se encontraron ciudades</Text>
        </View>
      )}

      <FlatList
        data={search.data ?? []}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.resultRow} onPress={() => openCity(item)}>
            <Ionicons name="location" size={18} color="rgba(255,255,255,0.6)" />
            <View style={styles.resultText}>
              <Text style={styles.resultName}>{item.name}</Text>
              <Text style={styles.resultSubtitle}>
                {[item.admin1, item.country].filter(Boolean).join(', ')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.35)" />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2A4A',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
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
  loader: {
    marginTop: 24,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    gap: 8,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 120,
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
    flex: 1,
  },
  resultName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    marginTop: 2,
  },
});
