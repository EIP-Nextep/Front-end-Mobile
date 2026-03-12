import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { matchingService, Metier } from '@/services/matching.service';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = 450;

export default function SwipeScreen() {
  const [metiers, setMetiers] = useState<Metier[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [pan] = useState(new Animated.ValueXY());
  const [fadeAnim] = useState(new Animated.Value(1));
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchMetiers();
    }, [])
  );

  const fetchMetiers = async () => {
    try {
      setLoading(true);
      setCardIndex(0);
      const data = await matchingService.getRecommendedMetiers();
      setMetiers(data);
    } catch (error) {
      console.error('Error fetching metiers:', error);
      Alert.alert('Erreur', 'Impossible de charger les métiers');
    } finally {
      setLoading(false);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [null, { dx: pan.x, dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (e, { dx, vx }) => {
      const direction = vx > 0 ? 1 : -1;
      
      if (Math.abs(dx) > 100) {
        handleSwipeComplete(direction);
      } else {
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
      }
    },
  });

  const handleSwipeComplete = (direction: number) => {
    const isLike = direction > 0;
    const currentMetier = metiers[cardIndex];

    // Record the interaction
    setSubmitting(true);
    matchingService.recordMetierInteraction(currentMetier.id, isLike)
      .catch(error => console.error('Error recording interaction:', error))
      .finally(() => setSubmitting(false));

    // Animate the card
    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x: direction * 500, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (cardIndex < metiers.length - 1) {
        setCardIndex(cardIndex + 1);
        pan.setValue({ x: 0, y: 0 });
        fadeAnim.setValue(1);
      }
    });
  };

  const handleLike = () => {
    handleSwipeComplete(1);
  };

  const handleDislike = () => {
    handleSwipeComplete(-1);
  };

  const rotateCard = pan.x.interpolate({
    inputRange: [-500, 0, 500],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  const cardColor = pan.x.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: ['rgba(255, 100, 100, 1)', 'rgba(255, 255, 255, 0)', 'rgba(100, 255, 100, 1)'],
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Chargement des métiers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (metiers.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <MaterialCommunityIcons name="information-outline" size={48} color={Colors.light.muted} />
          <Text style={styles.emptyTitle}>Aucun métier disponible</Text>
          <Text style={styles.emptySubtitle}>Complétez le quiz d&apos;orientation pour découvrir des recommandations</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentMetier = metiers[cardIndex];

  if (cardIndex >= metiers.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <MaterialCommunityIcons name="check-circle" size={64} color={Colors.light.secondary} />
          <Text style={styles.emptyTitle}>Vous avez vu tous les métiers!</Text>
          <Text style={styles.emptySubtitle}>Revenez plus tard pour en voir d&apos;autres</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorez les métiers</Text>
        <Text style={styles.subtitle}>{cardIndex + 1} / {metiers.length}</Text>
      </View>

      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateX: pan.x }, { rotate: rotateCard }],
              opacity: fadeAnim,
              backgroundColor: cardColor,
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.cardContent}>
            <Text style={styles.metierName}>{currentMetier.name}</Text>
            {currentMetier.domain && (
              <Text style={styles.metierDomain}>Domaine: {currentMetier.domain}</Text>
            )}
            {currentMetier.description && (
              <Text style={styles.metierDescription}>{currentMetier.description}</Text>
            )}
          </View>
        </Animated.View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.dislikeButton}
          onPress={handleDislike}
          disabled={submitting}
        >
          <MaterialCommunityIcons name="close" size={32} color="#FF6B6B" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.likeButton}
          onPress={handleLike}
          disabled={submitting}
        >
          <MaterialCommunityIcons name="check" size={32} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.muted,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  metierName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 12,
  },
  metierDomain: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.secondary,
    marginBottom: 16,
  },
  metierDescription: {
    fontSize: 14,
    color: Colors.light.muted,
    lineHeight: 22,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    gap: 40,
  },
  dislikeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    textAlign: 'center',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: 'center',
    marginTop: 12,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.muted,
  },
});
