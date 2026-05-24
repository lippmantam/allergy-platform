import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Allergy Travel' }} />
      <Stack.Screen name="search" options={{ title: 'Find Safe Food' }} />
      <Stack.Screen name="place/[id]" options={{ title: 'Place Details' }} />
    </Stack>
  )
}
