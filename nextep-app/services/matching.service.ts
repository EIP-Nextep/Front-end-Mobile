import { initializeApi } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Question {
  id: string;
  text: string;
  category?: string;
  order: number;
  imageUrl?: string;
  options: Option[];
}

export interface Option {
  id: string;
  letter: string;
  title: string;
  description?: string;
}

export interface QuizAnswer {
  questionId: string;
  optionId: string;
}

export interface Metier {
  id: string;
  name: string;
  description?: string;
  domain?: string;
}

export interface School {
  id: string;
  name: string;
  description?: string;
  image?: string;
  degree?: string;
  price?: string;
  location?: string;
  website?: string;
  logoUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  price?: number;
  duration?: string;
  thumbnail?: string;
  schoolId: string;
  school?: {
    id: string;
    name: string;
    logoUrl?: string;
    website?: string;
  };
  modules?: {
    id: string;
    title: string;
    order: number;
    lessons?: {
      id: string;
      title: string;
    }[];
  }[];
  domainIds?: string[];
  match?: number;
}

class MatchingService {
  private apiBaseUrl: string | null = null;

  private async ensureApiInitialized(): Promise<string> {
    if (!this.apiBaseUrl) {
      this.apiBaseUrl = await initializeApi();
    }
    return this.apiBaseUrl!;
  }

  async createUserProfile(userId: string): Promise<void> {
    try {
      const baseUrl = await this.ensureApiInitialized();
      const token = await AsyncStorage.getItem('accessToken');

      const url = `${baseUrl}/api/matching/user`;
      console.log('Matching: Creating user profile for:', userId);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create user profile: ${response.status}`);
      }

      console.log('Matching: User profile created successfully');
    } catch (error) {
      console.error('Matching: Error creating user profile:', error);
      throw error;
    }
  }

  async getQuestions(): Promise<Question[]> {
    try {
      const baseUrl = await this.ensureApiInitialized();
      const token = await AsyncStorage.getItem('accessToken');
      
      const url = `${baseUrl}/api/matching/questions`;
      console.log('Matching: Fetching questions from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status}`);
      }

      const data = await response.json();
      console.log('Matching: Questions fetched successfully');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Matching: Error fetching questions:', error);
      throw error;
    }
  }

  async submitQuiz(answers: QuizAnswer[]): Promise<void> {
    try {
      const baseUrl = await this.ensureApiInitialized();
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.sub;

      const url = `${baseUrl}/api/matching/calculate`;
      const payload = {
        userId,
        answers,
      };

      console.log('Matching: Submitting quiz answers to:', url);
      console.log('Matching: Payload:', JSON.stringify(payload));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('Matching: Response status:', response.status);
      
      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = JSON.stringify(errorData);
        } catch {
          errorDetails = await response.text();
        }
        console.log('Matching: Error response:', errorDetails);
        throw new Error(`Failed to submit quiz: ${response.status} - ${errorDetails}`);
      }

      const responseData = await response.json();
      console.log('Matching: Quiz submitted successfully:', responseData);
    } catch (error) {
      console.error('Matching: Error submitting quiz:', error);
      throw error;
    }
  }

  async getRecommendedMetiers(): Promise<Metier[]> {
    try {
      const baseUrl = await this.ensureApiInitialized();
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        console.warn('Matching: No token for recommendations');
        return [];
      }

      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.sub;

      const url = `${baseUrl}/api/matching/recommendations/metiers/${userId}`;
      console.log('Matching: Fetching recommended metiers from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('Matching: No recommendations found (quiz not completed)');
          return [];
        }
        throw new Error(`Failed to fetch recommendations: ${response.status}`);
      }

      const data = await response.json();
      console.log('Matching: Recommended metiers fetched successfully');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Matching: Error fetching recommendations:', error);
      return [];
    }
  }

  async recordMetierInteraction(metierId: string, liked: boolean): Promise<void> {
    try {
      const baseUrl = await this.ensureApiInitialized();
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.sub;

      const url = `${baseUrl}/api/matching/interactions/metier`;
      const payload = {
        userId,
        metierId,
        liked,
      };

      console.log(`Matching: Recording ${liked ? 'like' : 'dislike'} for metier:`, metierId);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to record interaction: ${response.status}`);
      }

      console.log('Matching: Interaction recorded successfully');
    } catch (error) {
      console.error('Matching: Error recording interaction:', error);
      throw error;
    }
  }

  async getCourses(): Promise<Course[]> {
    try {
      const baseUrl = await this.ensureApiInitialized();
      const token = await AsyncStorage.getItem('accessToken');
      
      const url = `${baseUrl}/api/catalog/courses`;
      console.log('Matching: Fetching courses from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }

      const data = await response.json();
      console.log('Matching: Courses fetched successfully, count:', Array.isArray(data) ? data.length : 0);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Matching: Error fetching courses:', error);
      throw error;
    }
  }

  async getRecommendedCourses(): Promise<Course[]> {
    try {
      const baseUrl = await this.ensureApiInitialized();
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        console.warn('Matching: No token for course recommendations');
        return [];
      }

      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.sub;

      const url = `${baseUrl}/api/matching/recommendations/courses/${userId}`;
      console.log('Matching: Fetching recommended courses from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('Matching: No course recommendations found (quiz not completed)');
          return [];
        }
        throw new Error(`Failed to fetch course recommendations: ${response.status}`);
      }

      const recommendations = await response.json();
      console.log('Matching: Recommended courses fetched from matching service:', recommendations);

      if (Array.isArray(recommendations) && recommendations.length > 0) {
        const fullCourses: Course[] = [];
        
        for (const rec of recommendations) {
          try {
            const courseId = rec.id || rec.courseId;
            if (courseId) {
              const catalogUrl = `${baseUrl}/api/catalog/courses/${courseId}`;
              const catalogResponse = await fetch(catalogUrl, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token && { 'Authorization': `Bearer ${token}` }),
                },
              });

              if (catalogResponse.ok) {
                const fullCourse = await catalogResponse.json();
                if (rec.match !== undefined) {
                  fullCourse.match = rec.match;
                }
                fullCourses.push(fullCourse);
              }
            } else if (rec.title) {
              fullCourses.push(rec);
            }
          } catch (fetchError) {
            console.warn('Matching: Could not fetch full course details for recommended course:', rec.id || rec.courseId, fetchError);
            if (rec.title) {
              fullCourses.push(rec);
            }
          }
        }

        console.log('Matching: Recommended courses fetched successfully with full details, count:', fullCourses.length);
        return fullCourses;
      }

      return Array.isArray(recommendations) ? recommendations : [];
    } catch (error) {
      console.error('Matching: Error fetching course recommendations:', error);
      return [];
    }
  }

  async hasCompletedQuiz(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        return false;
      }

      const recommendations = await this.getRecommendedMetiers();
      return recommendations.length > 0;
    } catch {
      return false;
    }
  }
}

export const matchingService = new MatchingService();
