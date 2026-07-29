import { useEffect } from 'react';

import { ensureNotificationPermission, sendLocalNotification } from '@/services/notifications';
import { getLastNotifiedContentKey, setLastNotifiedContentKey } from '@/services/notificationsStorage';
import type { WeatherData } from '@/types/weather';
import { buildWeatherNotification } from '@/utils/insights/notificationContent';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useWeatherNotifications(data: WeatherData | undefined) {
  useEffect(() => {
    if (!data) return;

    let cancelled = false;

    (async () => {
      const granted = await ensureNotificationPermission();
      if (!granted || cancelled) return;

      const { title, body, contentKey } = buildWeatherNotification(data);
      const key = todayKey();
      const lastKey = await getLastNotifiedContentKey(key);
      if (lastKey === contentKey) return;

      await sendLocalNotification(title, body);
      await setLastNotifiedContentKey(key, contentKey);
    })();

    return () => {
      cancelled = true;
    };
  }, [data]);
}
