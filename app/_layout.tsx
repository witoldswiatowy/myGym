import { Stack } from "expo-router";

export default function RootLayout() {
  // return <Stack screenOptions={{ headerTitle: 'Moja Aplikacja ' }} />;
  return (
    <Stack
      screenOptions={({ route }) => ({
        headerTitle: `Moja Aplikacja: ${route.name}`,
      })}
    />
  );
}
