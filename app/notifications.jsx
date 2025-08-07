import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';

const notifications = [
  {
    id: 1,
    title: 'New Internship Posted!',
    message: 'A new Software Engineering internship is now available at TechNova.',
    time: '2 hours ago',
  },
  {
    id: 2,
    title: 'Profile Updated',
    message: 'Your profile has been successfully updated.',
    time: '1 day ago',
  },
  {
    id: 3,
    title: 'New Event: Career Fair',
    message: 'Join us at the upcoming virtual career fair for networking opportunities.',
    time: '3 days ago',
  },
];

export default function NotificationsScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Notifications</Text>

        {notifications.map((note) => (
          <View key={note.id} style={styles.card}>
            <Text style={styles.cardTitle}>{note.title}</Text>
            <Text style={styles.cardMessage}>{note.message}</Text>
            <Text style={styles.cardTime}>{note.time}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <MaterialCommunityIcons name="home" size={28} color="#2166A5" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MapScreen')}>
          <Ionicons name="map" size={28} color="#2166A5" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('InternshipScreen')}>
          <MaterialCommunityIcons name="briefcase" size={28} color="#2166A5" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreen')}>
          <Ionicons name="notifications" size={28} color="#2166A5" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
          <FontAwesome name="user-circle" size={32} color="#2166A5" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E3EFFB',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2166A5',
    marginBottom: 4,
  },
  cardMessage: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  cardTime: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#E3EFFB',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#dbeafe',
  },
});
