import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, StyleSheet, TouchableOpacity, 
  ScrollView, Dimensions, Modal, Pressable 
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [user, setUser] = useState({
    id: '1',
    name: 'User',
    profilePic: require('../assets/M1.png'),
  });

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    // Load user from AsyncStorage
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('unilink_user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(prev => ({
            ...prev,
            id: parsedUser.id || '1',
            name: parsedUser.name || 'User',
            profilePic: require('../assets/M1.png'),
          }));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    // Fetch posts from backend
    const getPosts = async () => {
      try {
        const response = await fetch('https://unilink-backend-9t4p.onrender.com/api/users/posts', {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch posts');
        console.log(data)
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    getPosts();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={user.profilePic} style={styles.profilePic} />
        <Text style={styles.welcome}>Welcome {user.name}</Text>
      </View>

      {/* Feed */}
      <ScrollView style={styles.feed}>
        {posts?.map(post => (
          <TouchableOpacity 
            key={post.id} 
            style={styles.postCard} 
            onPress={() => setSelectedPost(post)}
          >
            <View style={styles.postHeader}>
              <Image 
                source={require('../assets/L2.png')} 
                style={styles.postAvatar} 
              />
              <View>
                <Text style={styles.postAuthor}>{post.author}</Text>
                <Text style={styles.postTime}>
                  {new Date(post.created_at).toLocaleString()}
                </Text>
              </View>
            </View>
            <Image 
              source={require('../assets/AI1.png')} // placeholder image
              style={styles.postImage} 
              resizeMode="cover" 
            />
            <Text style={styles.postTitle}>{post.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal for post details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedPost}
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPost && (
              <>
                <Text style={styles.modalTitle}>{selectedPost.title}</Text>
                <Text style={styles.modalAuthor}>By {selectedPost.author}</Text>
                <Text style={styles.modalTime}>
                  {new Date(selectedPost.created_at).toLocaleString()}
                </Text>
                <ScrollView>
                  <Text style={styles.modalDescription}>
                    {selectedPost.description}
                  </Text>
                </ScrollView>
                <Pressable 
                  style={styles.closeButton} 
                  onPress={() => setSelectedPost(null)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
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
  container: { flex: 1, backgroundColor: '#E3EFFB', paddingTop: 40 },
  header: { alignItems: 'center', marginBottom: 10, paddingVertical: 20 },
  profilePic: { width: 70, height: 70, borderRadius: 35, marginBottom: 8 },
  welcome: { fontSize: 20, fontWeight: 'bold', color: '#2166A5' },
  feed: { flex: 1, paddingHorizontal: 12 },
  postCard: {
    backgroundColor: '#fff', borderRadius: 14, marginBottom: 18, padding: 16,
    shadowColor: '#2166A5', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  postAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  postAuthor: { fontWeight: 'bold', fontSize: 15, color: '#222' },
  postTime: { fontSize: 12, color: '#888' },
  postImage: { width: '100%', height: width * 0.45, borderRadius: 10, marginVertical: 8 },
  postTitle: { fontSize: 16, fontWeight: 'bold', color: '#2166A5', marginTop: 4 },

  // Modal styles
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', backgroundColor: 'white', borderRadius: 14, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#2166A5' },
  modalAuthor: { fontSize: 14, fontWeight: '500', color: '#444' },
  modalTime: { fontSize: 12, color: '#666', marginBottom: 10 },
  modalDescription: { fontSize: 15, color: '#333', lineHeight: 22 },
  closeButton: { marginTop: 15, backgroundColor: '#2166A5', padding: 10, borderRadius: 8, alignSelf: 'center' },
  closeButtonText: { color: 'white', fontWeight: 'bold' },

  navBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#B3D0F7', paddingVertical: 10, borderTopWidth: 1, borderColor: '#dbeafe',
  },
});
