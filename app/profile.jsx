import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Image
        source={require('../assets/M1.png')} // Replace with user avatar if available
        style={styles.avatar}
      />

      {/* User Info */}
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.email}>john.doe@email.com</Text>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    
      {/* Profile Options */}
      <View style={styles.options}>
        <TouchableOpacity style={styles.option} onPress={() => navigation && navigation.navigate('SettingsScreen')}>
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.option}
          onPress={() => navigation && navigation.navigate('NotificationsScreen')}
        >
          <Text style={styles.optionText}>My Events</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.option}
          onPress={() => navigation && navigation.navigate('LoginScreen')}
        >
          <Text style={[styles.optionText, { color: '#E53935' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3D0F7',
    alignItems: 'center',
    paddingTop: 60,
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: '#fff',
    marginBottom: 18,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2166A5',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#2166A5',
    opacity: 0.8,
    marginBottom: 18,
  },
  editButton: {
    backgroundColor: '#2166A5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 32,
    marginBottom: 30,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  options: {
    width: '90%',
    marginTop: 10,
  },
  option: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',
    elevation: 1,
  },
  optionText: {
    color: '#2166A5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});