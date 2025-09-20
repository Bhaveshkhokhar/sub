import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Home, MessageSquare, Wallet, Compass, User } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useLanguage';
import { DEFAULT_TAB_BAR_STYLE } from '@/constants/tabBarStyles';

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: DEFAULT_TAB_BAR_STYLE,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarIconStyle: { marginBottom: 2 },
        tabBarLabelPosition: 'below-icon',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('nav.explore'),
          tabBarIcon: ({ size, color }) => <Compass size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: t('nav.wallet'),
          tabBarIcon: ({ size, color }) => <Wallet size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: t('nav.chat'),
          tabBarIcon: ({ size, color }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('nav.account'),
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
      {/* Hidden tab */}
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
