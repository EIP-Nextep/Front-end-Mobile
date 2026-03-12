import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export default function SchoolsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Écoles</Text>
      <Text style={styles.subtitle}>Liste des écoles disponibles</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.muted,
  },
});
