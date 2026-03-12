import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.muted,
        tabBarStyle: {
          backgroundColor: Colors.light.background,
          borderTopColor: Colors.light.primary,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schools"
        options={{
          title: 'Écoles',
          tabBarLabel: 'Écoles',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="school" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="swipe"
        options={{
          title: 'Swipe',
          tabBarLabel: 'Swipe',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="gesture-swipe-right" color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="message-text" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="account" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
