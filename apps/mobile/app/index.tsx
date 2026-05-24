import { View, Text, StyleSheet } from 'react-native'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allergy Travel</Text>
      <Text style={styles.subtitle}>Find allergy-safe food near you</Text>
      {/* TODO: Build home screen — near me button, allergen profile, recent places */}
    </View>
  )
}

const styles = StyleSheet.create({
  container:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title:      { fontSize: 28, fontWeight: '600', marginBottom: 8 },
  subtitle:   { fontSize: 16, color: '#666' },
})
