import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Colors } from "../../constants/theme";
import { SocialButton } from "../../components/common/SocialButton";
import { AppInput } from "../../components/common/AppInput";
import { authService } from "../../services/auth.service";

export default function LoginScreen() {
  const router = useRouter();
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      await authService.login({
        email,
        password,
      });

      Alert.alert("Succès", "Connecté avec succès!");
      router.replace("/(app)/(tabs)");
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Image
            source={require("../../assets/images/transparent-logo.png")}
            style={{ width: 300, height: 150 }}
          />
          <Text style={styles.welcomeTitle}>Bienvenue</Text>
          <Text style={styles.welcomeSubtitle}>
            Choisissez votre méthode de connexion préférée pour continuer.
          </Text>
        </View>

        {/* Continue With Section */}
        <View style={styles.continueSection}>
          <SocialButton
            title="Google"
            images={require("../../assets/images/google-logo.png")}
            onPress={() => {}}
          />
          <SocialButton
            title="Apple"
            images={require("../../assets/images/apple-logo.png")}
            onPress={() => {}}
          />
          <SocialButton
            title="Microsoft"
            images={require("../../assets/images/microsoft-logo.png")}
            onPress={() => {}}
          />
          <SocialButton
            title="E-mail"
            images={require("../../assets/images/email-icon.png")}
            onPress={() => setShowEmailLogin(true)}
          />
        </View>

        {/* Footer Links */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.footerLink}>Aide</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.footerLink}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Email Login Modal */}
      <Modal
        visible={showEmailLogin}
        animationType="slide"
        transparent={false}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEmailLogin(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Connexion</Text>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Connectez-vous avec votre email et mot de passe
            </Text>

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

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleEmailLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.loginButtonText}>Se connecter</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              style={styles.signupLink}
            >
              <Text style={styles.signupText}>
                Vous n&apos;avez pas de compte? <Text style={styles.signupLinkText}>Créer un compte</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </>
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
  loadingContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.light.secondary,
    borderTopColor: "transparent",
  },
  welcomeSection: {
    marginBottom: 30,
    alignItems: "center",
  },
  loginLink: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.light.primary,
    textAlign: "center",
    lineHeight: 24,
  },
  brandingCard: {
    backgroundColor: "#F0F4FF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 40,
  },
  brandingIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  brandingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginBottom: 8,
  },
  brandingDescription: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: "center",
  },
  continueSection: {
    marginBottom: 32,
  },
  continueLabel: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  emailSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  orText: {
    color: Colors.light.muted,
    fontSize: 14,
  },
  emailLink: {
    color: Colors.light.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.primary,
  },
  footerLink: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  closeButton: {
    fontSize: 28,
    color: Colors.light.primary,
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  modalContent: {
    paddingHorizontal: 24,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.light.muted,
    marginBottom: 24,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: Colors.light.secondary,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  loginButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupLink: {
    marginTop: 24,
    alignItems: "center",
  },
  signupText: {
    color: Colors.light.muted,
    fontSize: 14,
  },
  signupLinkText: {
    color: Colors.light.secondary,
    fontWeight: "600",
  },
});
