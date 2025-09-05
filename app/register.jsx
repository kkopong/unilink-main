import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions, 
  ActivityIndicator, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://unilink-backend-9t4p.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: name.trim(),
          email: email.trim().toLowerCase(), 
          password 
        }),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (data.success) {
        // Store auth data
        await AsyncStorage.multiSet([
          ['unilink_user', JSON.stringify(data.user)],
          ['unilink_token', data.token],
          ['is_admin', String(!!data.user?.is_admin)]
        ]);

        setSuccessMsg('Account created successfully! Redirecting...');
        
        // Navigate to onboarding after a short delay
        setTimeout(() => {
          router.replace('/onboarding_screen');
        }, 2000);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message === 'Network request failed') {
        setErrorMsg('Unable to connect to server. Please check your internet connection.');
      } else {
        setErrorMsg(error.message || 'An error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Image
            source={require('../assets/unilink-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Create Account</Text>

          {errorMsg ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}
          {successMsg ? <Text style={styles.successMsg}>{successMsg}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#082c4d"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#082c4d"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#082c4d"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#082c4d"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#082c4d',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#082c4d',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a4c9eb',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    color: '#082c4d',
    borderWidth: 1,
    borderColor: '#082c4d',
  },
  button: {
    backgroundColor: '#a4c9eb',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  link: {
    color: '#a4c9eb',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorMsg: {
    color: '#d32f2f',
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d32f2f',
    width: '100%',
  },
  successMsg: {
    color: '#2e7d32',
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2e7d32',
    width: '100%',
  },
});