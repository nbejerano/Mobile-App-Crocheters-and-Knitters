import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Theme from "@/assets/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.iconHighlighted,
        tabBarInactiveTintColor: Theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Theme.colors.backgroundPrimary,
          borderTopColor: Theme.colors.backgroundSecondary,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Projects",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard-list" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: "Gallery",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="image" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
