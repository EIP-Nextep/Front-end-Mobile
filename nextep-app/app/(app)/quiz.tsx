import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { matchingService, Question, QuizAnswer } from '@/services/matching.service';

export default function QuizScreen() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await matchingService.getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      Alert.alert('Erreur', 'Impossible de charger le quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionId: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    newAnswers.push({
      questionId: currentQuestion.id,
      optionId,
    });
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (answers.length !== questions.length) {
      Alert.alert('Attention', 'Veuillez répondre à toutes les questions');
      return;
    }

    try {
      setSubmitting(true);
      await matchingService.submitQuiz(answers);
      Alert.alert('Succès', 'Quiz soumis avec succès!', [
        {
          text: 'OK',
          onPress: () => router.navigate('/(app)/(tabs)/swipe' as any),
        },
      ]);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      Alert.alert('Erreur', 'Impossible de soumettre le quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Chargement du quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Aucune question disponible</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswerIndex = answers.findIndex(a => a.questionId === currentQuestion.id);
  const isCurrentQuestionAnswered = currentAnswerIndex !== -1;
  const allQuestionsAnswered = answers.length === questions.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz d&apos;Orientation</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} sur {questions.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>{currentQuestion.text}</Text>

          {currentQuestion.options.map((option, index) => {
            const isSelected = isCurrentQuestionAnswered && answers[currentAnswerIndex]?.optionId === option.id;

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() => handleSelectOption(option.id)}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionIndicator,
                    isSelected && styles.optionIndicatorSelected,
                  ]}>
                    <Text style={[
                      styles.optionLetter,
                      isSelected && styles.optionLetterSelected,
                    ]}>
                      {option.letter}
                    </Text>
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[
                      styles.optionTitle,
                      isSelected && styles.optionTitleSelected,
                    ]}>
                      {option.title}
                    </Text>
                    {option.description && (
                      <Text style={[
                        styles.optionDescription,
                        isSelected && styles.optionDescriptionSelected,
                      ]}>
                        {option.description}
                      </Text>
                    )}
                  </View>
                  {isSelected && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color={Colors.light.primary}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={20}
            color={currentQuestionIndex === 0 ? Colors.light.muted : Colors.light.primary}
          />
          <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.navButtonTextDisabled]}>
            Précédent
          </Text>
        </TouchableOpacity>

        {currentQuestionIndex < questions.length - 1 ? (
          <TouchableOpacity
            style={[styles.navButton, !isCurrentQuestionAnswered && styles.navButtonDisabled]}
            onPress={handleNextQuestion}
            disabled={!isCurrentQuestionAnswered}
          >
            <Text style={[styles.navButtonText, !isCurrentQuestionAnswered && styles.navButtonTextDisabled]}>
              Suivant
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color={!isCurrentQuestionAnswered ? Colors.light.muted : Colors.light.primary}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, !allQuestionsAnswered && styles.submitButtonDisabled]}
            onPress={handleSubmitQuiz}
            disabled={!allQuestionsAnswered || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Soumettre</Text>
                <MaterialCommunityIcons name="check" size={20} color="#FFF" />
              </>
            )}
          </TouchableOpacity>
        )}
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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.secondary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: Colors.light.muted,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  questionContainer: {
    gap: 20,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.primary,
    lineHeight: 26,
    marginBottom: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  optionButtonSelected: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.primary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  optionIndicatorSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  optionLetterSelected: {
    color: '#FFFFFF',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: Colors.light.primary,
  },
  optionDescription: {
    fontSize: 12,
    color: Colors.light.muted,
    lineHeight: 18,
  },
  optionDescriptionSelected: {
    color: Colors.light.muted,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  navButtonDisabled: {
    borderColor: Colors.light.muted,
    backgroundColor: '#F5F5F5',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  navButtonTextDisabled: {
    color: Colors.light.muted,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: Colors.light.secondary,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.light.muted,
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.muted,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: '600',
  },
});
