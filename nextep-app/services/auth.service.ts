import { API_ENDPOINTS, initializeApi } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

class AuthService {
  private apiBaseUrl: string | null = null;

  private async ensureApiInitialized(): Promise<string> {
    if (!this.apiBaseUrl) {
      this.apiBaseUrl = await initializeApi();
    }
    return this.apiBaseUrl!;
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const baseUrl = await this.ensureApiInitialized();
      const url = `${baseUrl}${API_ENDPOINTS.AUTH.REGISTER}`;
      
      // Backend expects: email, password, name, role
      const registerPayload = {
        email: payload.email,
        password: payload.password,
        name: payload.fullName,
        role: 'STUDENT',
      };
      
      console.log('API: Attempting register');
      console.log('API: Register URL:', url);
      console.log('API: Register payload:', registerPayload);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerPayload),
      });

      console.log('API: Register response status:', response.status);
      console.log('API: Register response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || JSON.stringify(error);
        } catch {
          const text = await response.text();
          errorMessage = text || `Server error: ${response.status}`;
        }
        console.error('API: Register error details:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("API: Raw register response:", data);
      
      const accessToken = data.accessToken || data.access_token;
      const refreshToken = data.refreshToken || data.refresh_token;
      const user = data.user || { id: data.id || 'unknown', email: payload.email, fullName: payload.fullName };
      
      console.log("API: Processed tokens - accessToken:", !!accessToken, "refreshToken:", !!refreshToken);

      if (accessToken) {
        await AsyncStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }
      await AsyncStorage.setItem('user', JSON.stringify(user));

      const formattedData: AuthResponse = {
        accessToken: accessToken || '',
        refreshToken: refreshToken || '',
        user
      };
      
      return formattedData;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async registerAndLogin(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      await this.register(payload);
      console.log('API: Account created successfully, now logging in...');
      
      const loginPayload: LoginPayload = {
        email: payload.email,
        password: payload.password,
      };
      
      const authResponse = await this.login(loginPayload);
      console.log('API: Auto-login successful after registration');
      return authResponse;
    } catch (error) {
      console.error('Register and login error:', error);
      throw error;
    }
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const baseUrl = await this.ensureApiInitialized();
      const url = `${baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`;
      
      console.log("API: Attempting login");
      console.log("API: Login URL:", url);
      console.log("API: Payload:", payload);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log("API: Login response status:", response.status);
      console.log("API: Login response ok:", response.ok);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error("API: Login error response:", error);
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      console.log("API: Raw login response:", data);
      
      const accessToken = data.accessToken || data.access_token;
      const refreshToken = data.refreshToken || data.refresh_token;
      const user = data.user || { id: 'unknown', email: payload.email, fullName: '' };
      
      console.log("API: Processed tokens - accessToken:", !!accessToken, "refreshToken:", !!refreshToken);

      if (accessToken) {
        await AsyncStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      const formattedData: AuthResponse = {
        accessToken: accessToken || '',
        refreshToken: refreshToken || '',
        user
      };
      
      return formattedData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('API: Logging out user...');
      
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
      
      console.log('API: User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      try {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('user');
      } catch (clearError) {
        console.error('Failed to clear tokens:', clearError);
      }
    }
  }

  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem('accessToken');
  }

  async getUser() {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('accessToken');
    return !!token;
  }
}

export const authService = new AuthService();
