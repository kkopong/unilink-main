import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, StyleSheet, TouchableOpacity, 
  ScrollView, Dimensions, Modal, Pressable, Animated 
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// Skeleton Loading Component
const SkeletonLoader = () => {
  const pulseAnimation = new Animated.Value(0);

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  const opacity = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={styles.skeletonCard}>
          <View style={styles.skeletonHeader}>
            <Animated.View style={[styles.skeletonAvatar, { opacity }]} />
            <View style={styles.skeletonTextContainer}>
              <Animated.View style={[styles.skeletonText, styles.skeletonName, { opacity }]} />
              <Animated.View style={[styles.skeletonText, styles.skeletonTime, { opacity }]} />
            </View>
          </View>
          <Animated.View style={[styles.skeletonImage, { opacity }]} />
          <Animated.View style={[styles.skeletonText, styles.skeletonTitle, { opacity }]} />
        </View>
      ))}
    </View>
  );
};

export default function HomeScreen() {
  const [user, setUser] = useState({
    id: '1',
    name: 'User',
    profilePic: require('../assets/M1.png'),
  });

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cache keys
  const POSTS_CACHE_KEY = 'unilink_posts_cache';
  const CACHE_EXPIRY_KEY = 'unilink_posts_cache_expiry';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

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

  // Check if cache is valid
  const isCacheValid = async () => {
    try {
      const cacheExpiry = await AsyncStorage.getItem(CACHE_EXPIRY_KEY);
      if (!cacheExpiry) return false;
      
      const expiryTime = parseInt(cacheExpiry);
      const currentTime = Date.now();
      
      return currentTime < expiryTime;
    } catch (error) {
      console.error('Error checking cache validity:', error);
      return false;
    }
  };

  // Load posts from cache
  const loadPostsFromCache = async () => {
    try {
      const cachedPosts = await AsyncStorage.getItem(POSTS_CACHE_KEY);
      if (cachedPosts) {
        const parsedPosts = JSON.parse(cachedPosts);
        setPosts(parsedPosts);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading posts from cache:', error);
      return false;
    }
  };

  // Save posts to cache
  const savePostsToCache = async (postsData) => {
    try {
      const expiryTime = Date.now() + CACHE_DURATION;
      await AsyncStorage.multiSet([
        [POSTS_CACHE_KEY, JSON.stringify(postsData)],
        [CACHE_EXPIRY_KEY, expiryTime.toString()]
      ]);
    } catch (error) {
      console.error('Error saving posts to cache:', error);
    }
  };

  // Fetch posts from backend
  const fetchPostsFromAPI = async () => {
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
      
      console.log('Fresh data fetched:', data);
      setPosts(data);
      await savePostsToCache(data);
      return data;
    } catch (error) {
      console.error('Error fetching posts from API:', error);
      throw error;
    }
  };

  // Main function to get posts (with caching logic)
  const getPosts = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      if (!forceRefresh) {
        // Try to load from cache first
        const cacheValid = await isCacheValid();
        if (cacheValid) {
          const cacheLoaded = await loadPostsFromCache();
          if (cacheLoaded) {
            console.log('Posts loaded from cache');
            setLoading(false);
            return;
          }
        }
      }

      // If cache is invalid or doesn't exist, fetch from API
      await fetchPostsFromAPI();
      
    } catch (error) {
      console.error('Error in getPosts:', error);
      // If API fails, try to load from cache as fallback
      if (!forceRefresh) {
        const cacheLoaded = await loadPostsFromCache();
        if (cacheLoaded) {
          console.log('Loaded stale cache due to API error');
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await getPosts(true); // Force refresh
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={user.profilePic} style={styles.profilePic} />
        <Text style={styles.welcome}>Welcome {user.name}</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={handleRefresh}
          disabled={refreshing}
        >
          <Ionicons 
            name="refresh" 
            size={24} 
            color={refreshing ? "#ccc" : "#2166A5"} 
          />
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <ScrollView 
        style={styles.feed}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >
        {loading ? (
          <SkeletonLoader />
        ) : (
          posts?.map(post => (
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
          ))
        )}
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
  header: { 
    alignItems: 'center', 
    marginBottom: 10, 
    paddingVertical: 20, 
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative'
  },
  profilePic: { width: 70, height: 70, borderRadius: 35, marginBottom: 8 },
  welcome: { fontSize: 20, fontWeight: 'bold', color: '#2166A5' },
  refreshButton: {
    position: 'absolute',
    right: 20,
    top: 30,
    padding: 8,
  },
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

  // Skeleton styles
  skeletonContainer: {
    paddingHorizontal: 0,
  },
  skeletonCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 18,
    padding: 16,
    shadowColor: '#2166A5',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  skeletonAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeletonText: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  skeletonName: {
    height: 16,
    width: '40%',
    marginBottom: 4,
  },
  skeletonTime: {
    height: 12,
    width: '60%',
  },
  skeletonImage: {
    width: '100%',
    height: width * 0.45,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  skeletonTitle: {
    height: 16,
    width: '80%',
    marginTop: 4,
  },

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