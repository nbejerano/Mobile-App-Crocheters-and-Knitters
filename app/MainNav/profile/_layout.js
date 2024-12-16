import { Stack } from "expo-router";
import Theme from "@/assets/theme";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Theme.colors.backgroundPrimary,
        },
        headerTintColor: Theme.colors.textPrimary,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  );
} 