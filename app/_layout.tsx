import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, View } from 'react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
          height: 56,
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#ffffff',
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold', letterSpacing: 2 },
        animation: 'fade',
        headerTitle: () => (
          <Image
            source={require('../assets/icon.png')}
            style={{ width: 140, height: 48 }}
            resizeMode="contain"
          />
        ),
        headerTitleAlign: 'right',
        headerTitle: () => null,
headerRight: () => (
  <Image
    source={require('../assets/iconic.png')}
    style={{ width: 500, height: 280, marginRight: -180 }}
    resizeMode="contain"
  />
),
        headerTitle: () => null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vote"
        options={{
          title: 'Vote',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
          headerTitle: 'Contestants',
        }}
      />
      <Tabs.Screen
        name="live"
        options={{
          title: 'Live',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="tv" size={size} color={color} />
          ),
          headerTitle: 'Live Stream',
          headerStyle: { backgroundColor: '#000000' },
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield" size={size} color={color} />
          ),
          headerTitle: 'Admin Console',
        }}
      />
      <Tabs.Screen
        name="components/LoadingScreen"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
