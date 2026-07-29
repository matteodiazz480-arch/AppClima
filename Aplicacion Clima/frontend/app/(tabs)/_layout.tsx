import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#8FCBEB',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Clima',
          tabBarIcon: ({ color, size }) => <Ionicons name="partly-sunny" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Más',
          tabBarIcon: ({ color, size }) => <Ionicons name="apps" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: 'transparent',
    height: Platform.select({ ios: 88, default: 64 }),
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
