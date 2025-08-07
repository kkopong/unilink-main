import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// Navigation prop is provided by React Navigation

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top illustration or logo */}
      <Image
        source={require('../assets/unilink-logo.png')} // Replace with your onboarding illustration if needed
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Welcome text */}
      <Text style={styles.title}>Welcome to UniLink</Text>
      <Text style={styles.subtitle}>
        Campus life made simple. Connect, explore, and thrive with your campus community!
      </Text>

      {/* Get Started button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('HomeScreen')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3D0F7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustration: {
    width: width * 0.7,
    height: height * 0.3,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2166A5',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#2166A5',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#2166A5',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});