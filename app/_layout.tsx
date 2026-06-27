import { useState } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import AnimatedSplash from './_splash';

type DrawerProps = {
  onClose: () => void;
};

function HamburgerDrawer({ onClose }: DrawerProps) {
  const menuItems = [
    { label: 'Contact Us', icon: 'call-outline', action: () => Linking.openURL('tel:+2348160246665') },
    { label: 'Partner With Us', icon: 'handshake-outline', action: () => Linking.openURL('mailto:starsofzion.ng@gmail.com') },
    { label: 'Volunteer', icon: 'people-outline', action: () => Linking.openURL('mailto:starsofzion.ng@gmail.com?subject=Volunteer') },
    { label: 'Rules & Guidelines', icon: 'document-text-outline', action: () => Linking.openURL('https://starsofzion.com.ng') },
    { label: 'Vision & Mission', icon: 'eye-outline', action: () => Linking.openURL('https://starsofzion.com.ng') },
    { label: 'About', icon: 'information-circle-outline', action: () => Linking.openURL('https://starsofzion.com.ng') },
  ];

  return (
    <View style={drawerStyles.overlay}>
      <TouchableOpacity style={drawerStyles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={drawerStyles.drawer}>
        <View style={drawerStyles.drawerHeader}>
          <Image
            source={require('../assets/iconic.png')}
            style={drawerStyles.drawerLogo}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={onClose} style={drawerStyles.closeBtn}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <Text style={drawerStyles.drawerTagline}>Reality Music Show · Season 5</Text>

        <View style={drawerStyles.divider} />

        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={drawerStyles.menuItem}
            onPress={() => { item.action(); onClose(); }}
          >
            <Ionicons name={item.icon as any} size={20} color="#2563eb" />
            <Text style={drawerStyles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#475569" />
          </TouchableOpacity>
        ))}

        <View style={drawerStyles.divider} />

        <Text style={drawerStyles.drawerFooter}>© 2026 Stars of Zion. All rights reserved.</Text>
      </View>
    </View>
  );
}

export default function Layout() {
  const [showSplash, setShowSplash] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <View style={{ flex: 1 }}>
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
          headerTitle: () => null,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setDrawerOpen(true)}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="menu" size={28} color="#ffffff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Image
              source={require('../assets/iconic.png')}
              style={{ width: 500, height: 280, marginRight: -180 }}
              resizeMode="contain"
            />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            headerTitle: () => null,
          }}
        />
        <Tabs.Screen
          name="vote"
          options={{
            title: 'Vote',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="trophy" size={size} color={color} />
            ),
            headerTitle: () => null,
          }}
        />
        <Tabs.Screen
          name="live"
          options={{
            title: 'Live',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="tv" size={size} color={color} />
            ),
            headerTitle: () => null,
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
            headerTitle: () => null,
          }}
        />
        <Tabs.Screen
          name="components/LoadingScreen"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="_splash"
          options={{ href: null }}
        />
      </Tabs>

      {drawerOpen && <HamburgerDrawer onClose={() => setDrawerOpen(false)} />}
    </View>
  );
}

const drawerStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 999,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  drawer: {
    width: 280,
    backgroundColor: '#0f172a',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    padding: 20,
    paddingTop: 50,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  drawerLogo: {
    width: 120,
    height: 50,
  },
  closeBtn: {
    padding: 4,
  },
  drawerTagline: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  drawerFooter: {
    fontSize: 10,
    color: '#334155',
    textAlign: 'center',
    marginTop: 20,
  },
});
