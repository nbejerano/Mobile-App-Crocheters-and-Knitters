import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useAuth } from '@/context/auth';
import Theme from '@/assets/theme';
import { Link } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to sign in');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Theme.colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Theme.colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <Link href="/auth/register" asChild>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    color: Theme.colors.textPrimary,
  },
  button: {
    backgroundColor: Theme.colors.iconHighlighted,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: Theme.colors.textSecondary,
  },
}); 