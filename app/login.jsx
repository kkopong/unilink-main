import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    
    // Basic validation
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', { email });
      const response = await fetch('https://unilink-tuqi.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();
      console.log('Login response:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Login failed. Please check your credentials.');
      }

      // Store user data
      if (responseData.user) {
        console.log('Login successful, user:', responseData.user);
        
        try {
          // Store user data using AsyncStorage
          await AsyncStorage.setItem('unilink_user', JSON.stringify(responseData.user));
          // If token exists in response, store it, otherwise use a placeholder
          const token = responseData.token || 'dummy-token-for-development';
          await AsyncStorage.setItem('unilink_token', token);
        } catch (storageError) {
          console.error('Error saving user data:', storageError);
          // Continue with navigation even if storage fails
        }
        console.log('Login successful, navigating to Onboarding');
        navigation.replace('OnboardingScreen');
      } else {
        console.error('No user data in response:', responseData);
        throw new Error('Invalid user data received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg(error.message || 'An error occurred during login. Please try again.');
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
          {/* Logo (optional) */}
          <Image
            source={require('../assets/unilink-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Login</Text>

          {errorMsg ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}

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

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.link}>Don't have an account? Sign up</Text>
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
    width: width * 1,
    height: width * 1,
    marginBottom: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a4c9eb',
    marginBottom: 2,
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
    marginBottom: 20,
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
});