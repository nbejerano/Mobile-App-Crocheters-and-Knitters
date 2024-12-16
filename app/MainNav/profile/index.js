import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useAuth } from '@/context/auth';
import Theme from "@/assets/theme";
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DatabaseService from '@/database/db';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const { signOut, userId } = useAuth();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        setUserEmail(email || 'No email found');
      } catch (error) {
        console.error('Error fetching user email:', error);
        setUserEmail('Error loading email');
      }
    };

    fetchUserEmail();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <MaterialCommunityIcons 
          name="account-circle" 
          size={100} 
          color={Theme.colors.iconHighlighted}
        />
        <Text style={styles.emailText}>{userEmail}</Text>
      </View>

      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={signOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Theme.colors.backgroundPrimary,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 50,
  },
  emailText: {
    fontSize: 18,
    color: Theme.colors.textPrimary,
    marginTop: 20,
  },
  signOutButton: {
    backgroundColor: Theme.colors.iconHighlighted,
    padding: 15,
    borderRadius: 8,
    marginTop: 40,
    width: '80%',
    alignItems: 'center',
  },
  signOutText: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});