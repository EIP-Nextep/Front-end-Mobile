import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleStartQuiz = () => {
    router.navigate('/(app)/quiz' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.greeting}>Bienvenue,</Text>
          <Text style={styles.userName}>{user?.fullName || 'Utilisateur'}</Text>
          <Text style={styles.subtitle}>Trouvez votre orientation idéale</Text>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <MaterialCommunityIcons name="clipboard-list" size={40} color={Colors.light.secondary} />
            </View>
            <Text style={styles.cardTitle}>Quiz d&apos;Orientation</Text>
            <Text style={styles.cardDescription}>
              Répondez à nos questions pour découvrir les formations et métiers qui vous correspondent le mieux.
            </Text>
            <TouchableOpacity
              style={styles.cardButton}
              onPress={handleStartQuiz}
            >
              <Text style={styles.cardButtonText}>Commencer le quiz</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="school" size={24} color={Colors.light.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Écoles</Text>
                <Text style={styles.infoText}>Découvrez nos écoles partenaires</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.light.muted} />
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="gesture-swipe-right" size={24} color={Colors.light.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Métiers</Text>
                <Text style={styles.infoText}>Explorez les métiers recommandés</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.light.muted} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 14,
    color: Colors.light.muted,
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.muted,
  },
  contentSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.light.muted,
    lineHeight: 22,
    marginBottom: 16,
  },
  cardButton: {
    backgroundColor: Colors.light.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoSection: {
    gap: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 12,
    color: Colors.light.muted,
  },
});
