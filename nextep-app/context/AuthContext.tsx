import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';

export interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        const userData = await authService.getUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext: Starting logout');
      setIsLoading(true);
      await authService.logout();
      console.log('AuthContext: Logout complete, clearing user');
      setUser(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error logging out:', error);
      setUser(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
