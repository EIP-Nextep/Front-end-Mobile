import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors } from '../../constants/theme';
import { AppInput } from '../../components/common/AppInput';
import { authService } from '../../services/auth.service';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom complet');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre adresse email');
      return false;
    }
    if (!password) {
      Alert.alert('Erreur', 'Veuillez entrer un mot de passe');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    return true;
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await authService.registerAndLogin({
        fullName,
        email,
        password,
        confirmPassword,
      });

      // Auto-login was successful, navigate to home
      router.replace('/(app)/(tabs)');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Image source={require('../../assets/images/transparent-logo.png')} style={{ width: 300, height: 150 }} />
          <Text style={styles.headerTitle}>Commencez en quelques secondes</Text>
          <Text style={styles.headerSubtitle}>
          Créez un compte pour accéder à toutes les fonctionnalités.
        </Text>
      </View>

      {/* Form Fields */}
      <AppInput 
        label="Nom complet" 
        placeholder="Prénom et nom" 
        value={fullName}
        onChangeText={setFullName}
      />
      <AppInput 
        label="Adresse email" 
        placeholder="mail@entreprise.com" 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <AppInput 
        label="Mot de passe" 
        placeholder="••••••••••" 
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <AppInput 
        label="Confirmer le mot de passe" 
        placeholder="••••••••••" 
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Create Account Button */}
      <TouchableOpacity 
        style={styles.createButton} 
        onPress={handleCreateAccount}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.createButtonText}>Créer mon compte</Text>
        )}
      </TouchableOpacity>

      {/* Terms Section */}
      <View style={styles.termsSection}>
        <Text style={styles.termsText}>
          En créant un compte, vous acceptez les{' '}
          <Text style={styles.termsLink}>Conditions générales</Text>
          {' '}et la{' '}
          <Text style={styles.termsLink}>Politique de confidentialité</Text>
          .
        </Text>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.primary,
    textAlign: 'center',
    lineHeight: 22,
  },
  createButton: {
    backgroundColor: Colors.light.secondary,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  termsSection: {
    marginTop: 16,
    paddingHorizontal: 4,
  },
  termsText: {
    color: Colors.light.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  termsLink: {
    color: Colors.light.secondary,
    fontWeight: '600',
  },
});
