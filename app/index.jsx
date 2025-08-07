import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  // Map of user IDs to their profile pictures
  const profilePics = {
    '1': require('../assets/M1.png'),
    '2': require('../assets/L2.png'),
    '3': require('../assets/L3.png'),
    // Add more user IDs and their corresponding profile pictures as needed
  };

  const [user, setUser] = useState({
    id: '1', // Default user ID
    name: 'User',
    profilePic: require('../assets/M1.png'), // Default profile picture
  });

  // Load user data from AsyncStorage when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('unilink_user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          const userId = parsedUser.id || '1';
          setUser(prev => ({
            ...prev,
            id: userId,
            name: parsedUser.name || 'User',
            profilePic: profilePics[userId] || require('../assets/L1.png'),
          }));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  const posts = [
    {
      id: 1,
      author: 'Dr. Agyemang',
      time: 'just posted',
      image: require('../assets/C1.png'), // Replace with your image
      title: 'Artificial Intelligence Conference',
    },
    {
      id: 2,
      author: 'Dr. Peasah',
      time: '2 minutes ago',
      image: require('../assets/AI1.png'), // Replace with your image
      title: 'How to Make Career in AI',
    },
    {
      id: 3,
      author: 'Mrs. Opong',
      time: '1 hour ago',
      image: require('../assets/DB1.png'), // Replace with your image
      title: 'DataBase Management',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with profile */}
      <View style={styles.header}>
        <Image source={user.profilePic} style={styles.profilePic} />
        <Text style={styles.welcome}>Welcome {user.name}</Text>
      </View>

      {/* Campus Feed */}
      <ScrollView style={styles.feed}>
        {posts.map(post => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image 
                source={post.author === 'Dr. Agyemang' ? profilePics['1'] : 
                        post.author === 'Dr. Peasah' ? profilePics['2'] : 
                        post.author === 'Mrs. Opong' ? profilePics['3'] : 
                        user.profilePic} 
                style={styles.postAvatar} 
              />
              <View>
                <Text style={styles.postAuthor}>{post.author}</Text>
                <Text style={styles.postTime}>{post.time}</Text>
              </View>
            </View>
            <Image source={post.image} style={styles.postImage} resizeMode="cover" />
            <Text style={styles.postTitle}>{post.title}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation with icons */}
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
  container: {
    flex: 1,
    backgroundColor: '#E3EFFB',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#E3EFFB',
    paddingVertical: 20,
  },
  profilePic: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2166A5',
  },
  feed: {
    flex: 1,
    paddingHorizontal: 12,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 18,
    padding: 16,
    shadowColor: '#2166A5',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  postAuthor: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  postTime: {
    fontSize: 12,
    color: '#888',
  },
  postImage: {
    width: '100%',
    height: width * 0.45,
    borderRadius: 10,
    marginBottom: 8,
    marginTop: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2166A5',
    marginTop: 4,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#B3D0F7',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#dbeafe',
  },
});