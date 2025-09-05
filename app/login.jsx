import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleLogin = async () => {
    setErrorMsg('');
    setLoading(true);

    // Validate inputs
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://unilink-backend-9t4p.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          password 
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store auth data
      await AsyncStorage.multiSet([
        ['unilink_user', JSON.stringify(data.user)],
        ['unilink_token', data.token],
        ['is_admin', String(!!data.user?.is_admin)]
      ]);

      // Check if user is admin when admin mode is selected
      if (isAdminMode && !data.user?.is_admin) {
        setErrorMsg('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }

      // Navigate based on role and mode selection
      if (data.user?.is_admin && isAdminMode) {
        router.replace('/AdminDashboard');
      } else if (!isAdminMode) {
        router.replace('/onboarding_screen');
      } else {
        setErrorMsg('Invalid admin credentials');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      if (error.message === 'Network request failed') {
        setErrorMsg('Unable to connect to server. Please check your internet connection.');
      } else {
        setErrorMsg(error.message || 'An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    setErrorMsg(''); // Clear any existing error messages
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
          {/* Logo */}
          <Image
            source={require('../assets/unilink-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Mode Toggle */}
          <View style={styles.modeToggleContainer}>
            <TouchableOpacity 
              style={[
                styles.modeButton, 
                !isAdminMode && styles.activeModeButton
              ]}
              onPress={() => setIsAdminMode(false)}
            >
              <MaterialCommunityIcons 
                name="account" 
                size={20} 
                color={!isAdminMode ? '#fff' : '#a4c9eb'} 
              />
              <Text style={[
                styles.modeButtonText,
                !isAdminMode && styles.activeModeButtonText
              ]}>
                Student
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.modeButton, 
                isAdminMode && styles.activeModeButton
              ]}
              onPress={() => setIsAdminMode(true)}
            >
              <MaterialCommunityIcons 
                name="shield-crown" 
                size={20} 
                color={isAdminMode ? '#fff' : '#a4c9eb'} 
              />
              <Text style={[
                styles.modeButtonText,
                isAdminMode && styles.activeModeButtonText
              ]}>
                Admin
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>
            {isAdminMode ? 'Admin Login' : 'Student Login'}
          </Text>

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

          {isAdminMode && (
            <View style={styles.adminNotice}>
              <MaterialCommunityIcons name="information" size={16} color="#a4c9eb" />
              <Text style={styles.adminNoticeText}>
                Admin access requires special credentials
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              isAdminMode && styles.adminButton
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isAdminMode ? 'Login as Admin' : 'Login'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/register')}>
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
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 20,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(164, 201, 235, 0.1)',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 100,
    justifyContent: 'center',
  },
  activeModeButton: {
    backgroundColor: '#a4c9eb',
  },
  modeButtonText: {
    color: '#a4c9eb',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  activeModeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  adminNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(164, 201, 235, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  adminNoticeText: {
    color: '#a4c9eb',
    fontSize: 12,
    marginLeft: 5,
    flex: 1,
  },
  button: {
    backgroundColor: '#a4c9eb',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  adminButton: {
    backgroundColor: '#2166A5',
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
});