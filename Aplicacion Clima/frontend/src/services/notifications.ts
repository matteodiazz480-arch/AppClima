import Constants from 'expo-constants';

const isExpoGo = Constants.appOwnership === 'expo';

let handlerConfigured = false;

function loadNotifications(): typeof import('expo-notifications') | null {
  if (isExpoGo) return null;
  try {
    return require('expo-notifications');
  } catch {
    return null;
  }
}

function configureHandlerOnce(Notifications: typeof import('expo-notifications')) {
  if (handlerConfigured) return;
  handlerConfigured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const Notifications = loadNotifications();
  if (!Notifications) return false;

  try {
    configureHandlerOnce(Notifications);
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;

    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch {
    return false;
  }
}

export async function sendLocalNotification(title: string, body: string): Promise<void> {
  const Notifications = loadNotifications();
  if (!Notifications) return;

  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  } catch {
    // Notifications not supported in this runtime (e.g. Expo Go) — alerts still show in-app.
  }
}

export function notificationsSupported(): boolean {
  return !isExpoGo;
}
