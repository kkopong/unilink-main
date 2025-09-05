import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('posts');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    company: '',
    deadline: '',
    link: ''
  });

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const userStr = await AsyncStorage.getItem('unilink_user');
      const isAdmin = await AsyncStorage.getItem('is_admin');
      
      if (!userStr || isAdmin !== 'true') {
        Alert.alert('Access Denied', 'Admin access required');
        router.replace('/login');
        return;
      }
      
      const user = JSON.parse(userStr);
      setAdminUser(user);
    } catch (error) {
      console.error('Auth check error:', error);
      router.replace('/login');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['unilink_user', 'unilink_token', 'is_admin']);
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleAdd = (type) => {
    setModalType(type);
    setFormData({
      title: '',
      description: '',
      type: '',
      company: '',
      deadline: '',
      link: ''
    });
    setShowAddModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('unilink_token');
      
      // Determine the endpoint based on modal type
      let endpoint = '';
      let payload = { ...formData };
      
      switch(modalType) {
        case 'post':
          endpoint = 'posts';
          payload.type = 'announcement';
          break;
        case 'internship':
          endpoint = 'internships';
          break;
        case 'news':
          endpoint = 'news';
          break;
        default:
          throw new Error('Invalid content type');
      }

      const response = await fetch(`https://unilink-backend-9t4p.onrender.com/api/admin/${endpoint}`, {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create content');
      }

      Alert.alert('Success', `${modalType.charAt(0).toUpperCase() + modalType.slice(1)} created successfully!`);
      
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        type: '',
        company: '',
        deadline: '',
        link: ''
      });
      setShowAddModal(false);
      
    } catch (error) {
      console.error('Error submitting:', error);
      Alert.alert('Error', error.message || 'Failed to create content');
    } finally {
      setLoading(false);
    }
  };

  const renderDashboardCards = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
      <View style={styles.statsCard}>
        <Text style={styles.statsNumber}>23</Text>
        <Text style={styles.statsLabel}>Active Posts</Text>
      </View>
      <View style={styles.statsCard}>
        <Text style={styles.statsNumber}>15</Text>
        <Text style={styles.statsLabel}>Internships</Text>
      </View>
      <View style={styles.statsCard}>
        <Text style={styles.statsNumber}>45</Text>
        <Text style={styles.statsLabel}>News Items</Text>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'posts':
        return (
          <View style={styles.contentContainer}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAdd('post')}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Add New Post</Text>
            </TouchableOpacity>
            
            {/* Example Posts List */}
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>Welcome Week Events</Text>
              <Text style={styles.listItemDesc}>Schedule for orientation week...</Text>
              <View style={styles.listItemFooter}>
                <Text style={styles.listItemDate}>Posted 2 days ago</Text>
                <TouchableOpacity>
                  <Ionicons name="trash-outline" size={20} color="#d32f2f" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      
      case 'internships':
        return (
          <View style={styles.contentContainer}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAdd('internship')}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Add Internship</Text>
            </TouchableOpacity>
            
            {/* Example Internships List */}
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>Software Engineer Intern</Text>
              <Text style={styles.listItemCompany}>Tech Corp Ltd</Text>
              <Text style={styles.listItemDesc}>Looking for passionate developers...</Text>
              <View style={styles.listItemFooter}>
                <Text style={styles.listItemDate}>Deadline: Oct 30, 2024</Text>
                <TouchableOpacity>
                  <Ionicons name="trash-outline" size={20} color="#d32f2f" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 'news':
        return (
          <View style={styles.contentContainer}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAdd('news')}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Add News</Text>
            </TouchableOpacity>
            
            {/* Example News List */}
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>Campus Library Extended Hours</Text>
              <Text style={styles.listItemDesc}>The main library will now be open...</Text>
              <View style={styles.listItemFooter}>
                <Text style={styles.listItemDate}>Posted 1 day ago</Text>
                <TouchableOpacity>
                  <Ionicons name="trash-outline" size={20} color="#d32f2f" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
    }
  };

  if (!adminUser) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#a4c9eb" />
        <Text style={styles.loadingText}>Checking admin access...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome, {adminUser.name}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#a4c9eb" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dashboard Stats */}
      {renderDashboardCards()}

      {/* Navigation Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <MaterialCommunityIcons 
            name="post" 
            size={24} 
            color={activeTab === 'posts' ? '#fff' : '#a4c9eb'} 
          />
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            Posts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'internships' && styles.activeTab]}
          onPress={() => setActiveTab('internships')}
        >
          <MaterialCommunityIcons 
            name="briefcase" 
            size={24} 
            color={activeTab === 'internships' ? '#fff' : '#a4c9eb'} 
          />
          <Text style={[styles.tabText, activeTab === 'internships' && styles.activeTabText]}>
            Internships
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'news' && styles.activeTab]}
          onPress={() => setActiveTab('news')}
        >
          <Ionicons 
            name="newspaper" 
            size={24} 
            color={activeTab === 'news' ? '#fff' : '#a4c9eb'} 
          />
          <Text style={[styles.tabText, activeTab === 'news' && styles.activeTabText]}>
            News
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>

      {/* Add Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowAddModal(false)}
          >
            <TouchableOpacity 
              activeOpacity={1} 
              onPress={() => {}}
              style={styles.modalContent}
            >
              <ScrollView 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.modalTitle}>
                  Add New {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Title *"
                  value={formData.title}
                  onChangeText={(text) => setFormData({...formData, title: text})}
                  placeholderTextColor="#6B7280"
                />

                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Description *"
                  value={formData.description}
                  onChangeText={(text) => setFormData({...formData, description: text})}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#6B7280"
                />

                {modalType === 'internship' && (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Company"
                      value={formData.company}
                      onChangeText={(text) => setFormData({...formData, company: text})}
                      placeholderTextColor="#6B7280"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Deadline (e.g., 2024-12-31)"
                      value={formData.deadline}
                      onChangeText={(text) => setFormData({...formData, deadline: text})}
                      placeholderTextColor="#6B7280"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Application Link"
                      value={formData.link}
                      onChangeText={(text) => setFormData({...formData, link: text})}
                      placeholderTextColor="#6B7280"
                      keyboardType="url"
                    />
                  </>
                )}

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowAddModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Submit</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#082c4d',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#082c4d',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a4c9eb',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#a4c9eb',
    opacity: 0.8,
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  loadingText: {
    color: '#a4c9eb',
    marginTop: 10,
    fontSize: 16,
  },
  statsContainer: {
    padding: 20,
  },
  statsCard: {
    backgroundColor: '#a4c9eb',
    borderRadius: 12,
    padding: 20,
    marginRight: 15,
    width: 150,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#082c4d',
  },
  statsLabel: {
    color: '#082c4d',
    marginTop: 5,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#082c4d',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#2166A5',
  },
  tabText: {
    color: '#a4c9eb',
    marginTop: 5,
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentContainer: {
    padding: 20,
  },
  addButton: {
    backgroundColor: '#2166A5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  listItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#082c4d',
  },
  listItemCompany: {
    fontSize: 14,
    color: '#2166A5',
    marginTop: 5,
  },
  listItemDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  listItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  listItemDate: {
    fontSize: 12,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
    minHeight: '50%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#082c4d',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#2166A5',
    marginLeft: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});