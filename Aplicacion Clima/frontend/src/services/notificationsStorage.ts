import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'weather_notification_state';

interface NotificationState {
  date: string;
  contentKey: string;
}

export async function getLastNotifiedContentKey(todayKey: string): Promise<string | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const state = JSON.parse(raw) as NotificationState;
    return state.date === todayKey ? state.contentKey : null;
  } catch {
    return null;
  }
}

export async function setLastNotifiedContentKey(todayKey: string, contentKey: string): Promise<void> {
  const state: NotificationState = { date: todayKey, contentKey };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
