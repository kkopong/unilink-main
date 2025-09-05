import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const internships = [
  {
    title: "Software Engineering Intern",
    company: "TechNova",
    location: "Remote",
    duration: "3 Months",
    description: "Work on real-world projects with React Native and Node.js.",
  },
  {
    title: "Data Science Intern",
    company: "Insight AI",
    location: "Accra, Ghana",
    duration: "6 Months",
    description: "Assist in building ML models and perform EDA.",
  },
  {
    title: "UI/UX Design Intern",
    company: "DesignLab",
    location: "Hybrid",
    duration: "4 Months",
    description: "Collaborate with the team to create intuitive mobile designs.",
  },
];

export default function InternshipScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Internship Opportunities</Text>
          <Text style={styles.headerSubtitle}>
            Explore internships and gain real-world experience
          </Text>
        </View>

        {internships.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>{item.company} • {item.location}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.duration}>Duration: {item.duration}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.cta}>
          <Text style={styles.ctaText}>Don't see what you're looking for?</Text>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => navigation.navigate('AboutScreen')}
          >
            <Text style={styles.ctaButtonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <MaterialCommunityIcons name="home" size={28} color="#2166A5" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/map')}>
          <Ionicons name="map" size={28} color="#2166A5" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/internship')}>
          <MaterialCommunityIcons name="briefcase" size={28} color="#2166A5" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/notifications')}>
          <Ionicons name="notifications" size={28} color="#2166A5" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/settings')}>
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
    paddingBottom: 100, // space for navBar
  },
  header: {
    marginTop: 50,
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    alignItems: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  meta: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
  duration: {
    fontSize: 13,
    color: '#999',
    marginTop: 10,
  },
  button: {
    marginTop: 14,
    backgroundColor: '#4b7bec',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cta: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  ctaText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#B3D0F7',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#dbeafe',
  },
});
