import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="quiz"
        options={{
          headerShown: true,
          title: "Quiz",
        }}
      />
    </Stack>
  );
}
