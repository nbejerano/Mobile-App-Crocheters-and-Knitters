import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import DatabaseService from '@/database/db';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
      if (!storedUserId) {
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const result = await DatabaseService.authenticateUser(email, password);
      
      if (result.error) {
        Alert.alert('Error', result.error);
        return;
      }

      await AsyncStorage.setItem('userId', result.userId);
      setUserId(result.userId);
      router.replace('/MainNav/feed');
    } catch (error) {
      Alert.alert('Error', 'Invalid Credentials Please Try Again');
    }
  };

  const signUp = async (email, password) => {
    try {
      const result = await DatabaseService.createUser(email, password);
      
      if (result.error) {
        Alert.alert('Error', result.error);
        return;
      }

      await AsyncStorage.setItem('userId', result.userId);
      setUserId(result.userId);
      router.replace('/MainNav/feed');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      setUserId(null);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    userId,
    isLoading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 