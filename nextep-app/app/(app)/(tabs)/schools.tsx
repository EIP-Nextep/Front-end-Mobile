import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { matchingService, Course } from '@/services/matching.service';

export default function CoursesScreen() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchCourses();
    }, [])
  );

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Fetch all courses
      const courses = await matchingService.getCourses();
      setAllCourses(courses);
      
      // Check if user completed quiz and fetch recommended courses
      const quizCompleted = await matchingService.hasCompletedQuiz();
      setHasCompletedQuiz(quizCompleted);
      
      if (quizCompleted) {
        const recommended = await matchingService.getRecommendedCourses();
        setRecommendedCourses(recommended);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('Erreur', 'Impossible de charger les parcours');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Chargement des parcours...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recommended Courses Section */}
        {hasCompletedQuiz && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="star" size={24} color={Colors.light.secondary} />
              <Text style={styles.sectionTitle}>Parcours Recommandés</Text>
            </View>
            
            {recommendedCourses.length > 0 ? (
              <View style={styles.coursesList}>
                {recommendedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} isRecommended={true} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyStateCard}>
                <MaterialCommunityIcons name="information-outline" size={48} color={Colors.light.muted} />
                <Text style={styles.emptyStateText}>Aucun parcours recommandé pour le moment</Text>
                <Text style={styles.emptyStateSubtext}>Les recommandations apparaîtront après vos interactions</Text>
              </View>
            )}
          </View>
        )}

        {/* All Courses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="book-multiple-outline" size={24} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Tous les Parcours</Text>
          </View>
          
          {allCourses.length > 0 ? (
            <View style={styles.coursesList}>
              {allCourses.map((course) => (
                <CourseCard key={course.id} course={course} isRecommended={false} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyStateText}>Aucun parcours disponible</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface CourseCardProps {
  course: Course;
  isRecommended: boolean;
}

function CourseCard({ course, isRecommended }: CourseCardProps) {
  const modulesCount = course.modules?.length || 0;
  const lessonsCount = course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0;

  return (
    <View style={[styles.courseCard, isRecommended && styles.courseCardRecommended]}>
      {isRecommended && course.match && (
        <View style={styles.recommendedBadge}>
          <MaterialCommunityIcons name="star" size={14} color="#FFFFFF" />
          <Text style={styles.recommendedBadgeText}>{Math.round(course.match)}% match</Text>
        </View>
      )}
      
      <View style={styles.courseCardContent}>
        <View style={styles.courseCardHeader}>
          <View style={styles.courseCardIcon}>
            <MaterialCommunityIcons name="book-open-variant" size={24} color={Colors.light.primary} />
          </View>
          <View style={styles.courseCardInfo}>
            <Text style={styles.courseCardTitle} numberOfLines={2}>{course.title}</Text>
            {course.school?.name && (
              <Text style={styles.courseCardSubtitle} numberOfLines={1}>{course.school.name}</Text>
            )}
          </View>
        </View>

        {course.description && (
          <Text style={styles.courseCardDescription} numberOfLines={2}>
            {course.description}
          </Text>
        )}

        <View style={styles.courseCardMeta}>
          {course.duration && (
            <View style={styles.metaBadge}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.light.primary} />
              <Text style={styles.metaBadgeText}>{course.duration}</Text>
            </View>
          )}
          {modulesCount > 0 && (
            <View style={styles.metaBadge}>
              <MaterialCommunityIcons name="folder-outline" size={14} color={Colors.light.primary} />
              <Text style={styles.metaBadgeText}>{modulesCount} module(s)</Text>
            </View>
          )}
          {lessonsCount > 0 && (
            <View style={styles.metaBadge}>
              <MaterialCommunityIcons name="file-document-outline" size={14} color={Colors.light.primary} />
              <Text style={styles.metaBadgeText}>{lessonsCount} leçon(s)</Text>
            </View>
          )}
          {course.price !== undefined && course.price > 0 && (
            <View style={styles.metaBadge}>
              <MaterialCommunityIcons name="currency-eur" size={14} color={Colors.light.secondary} />
              <Text style={styles.metaBadgeText}>{course.price}€</Text>
            </View>
          )}
          {isRecommended && course.match && (
            <View style={[styles.metaBadge, styles.matchBadge]}>
              <MaterialCommunityIcons name="chart-line" size={14} color={Colors.light.secondary} />
              <Text style={styles.matchBadgeText}>{Math.round(course.match)}%</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.courseCardAction}>
        <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.light.muted} />
      </TouchableOpacity>
    </View>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.muted,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  coursesList: {
    gap: 12,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  courseCardRecommended: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.secondary,
    borderWidth: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  courseCardContent: {
    flex: 1,
  },
  courseCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  courseCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  courseCardInfo: {
    flex: 1,
  },
  courseCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 2,
  },
  courseCardSubtitle: {
    fontSize: 12,
    color: Colors.light.muted,
  },
  courseCardDescription: {
    fontSize: 12,
    color: Colors.light.muted,
    lineHeight: 16,
    marginBottom: 8,
  },
  courseCardMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.light.background,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.light.background,
    borderRadius: 6,
  },
  matchBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.light.secondary,
  },
  courseCardAction: {
    paddingHorizontal: 8,
  },
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
    marginTop: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: Colors.light.muted,
    marginTop: 6,
    textAlign: 'center',
  },
});
