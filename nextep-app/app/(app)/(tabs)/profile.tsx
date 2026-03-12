import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        {
          text: 'Annuler',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Déconnecter',
          onPress: async () => {
            try {
              console.log('Profile: Logging out...');
              await logout();
              console.log('Profile: Logout successful, navigating to login');
              // Navigate to login screen after logout
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Profile: Logout failed:', error);
              Alert.alert('Erreur', 'Impossible de se déconnecter');
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
          
          {user.fullName && (
            <>
              <Text style={styles.label}>Nom</Text>
              <Text style={styles.value}>{user.fullName}</Text>
            </>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutButtonText}>
          {isLoading ? 'Déconnexion...' : 'Se déconnecter'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 24,
  },
  userInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  label: {
    fontSize: 12,
    color: Colors.light.muted,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FF5C5C',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
