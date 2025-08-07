import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About UniLink</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Image 
            source={require('../assets/unilink-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.appName}>UniLink</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          
          <Text style={styles.sectionTitle}>Your All-in-One Campus Companion</Text>
          <Text style={styles.description}>
            UniLink is designed to connect students, faculty, and university services in one seamless platform. 
            Access course materials, join study groups, stay updated with campus events, and connect with peers 
            - all from your mobile device.
          </Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <View style={styles.featureItem}>
              <MaterialIcons name="school" size={24} color="#4a6fa5" />
              <Text style={styles.featureText}>Course Management & Materials</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="group" size={24} color="#4a6fa5" />
              <Text style={styles.featureText}>Study Groups & Collaboration</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="event" size={24} color="#4a6fa5" />
              <Text style={styles.featureText}>Campus Events & Activities</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="notifications" size={24} color="#4a6fa5" />
              <Text style={styles.featureText}>Real-time Notifications</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.description}>
              At UniLink, we believe in creating meaningful connections and simplifying campus life. 
              Our goal is to enhance the university experience by providing intuitive tools that help 
              students succeed academically and socially.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => Linking.openURL('mailto:support@unilink.edu')}
            >
              <MaterialIcons name="email" size={20} color="#4a6fa5" />
              <Text style={styles.contactText}>support@unilink.edu</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => Linking.openURL('tel:+233546018776')}
            >
              <MaterialIcons name="phone" size={20} color="#4a6fa5" />
              <Text style={styles.contactText}>+233546018776</Text>
            </TouchableOpacity>
            
            <View style={styles.socialIcons}>
              <TouchableOpacity 
                style={styles.socialIcon}
                onPress={() => Linking.openURL('https://facebook.com/unilink')}
              >
                <MaterialIcons name="facebook" size={24} color="#3b5998" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.socialIcon}
                onPress={() => Linking.openURL('https://twitter.com/unilink')}
              >
                <MaterialIcons name="twitter" size={24} color="#1da1f2" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.socialIcon}
                onPress={() => Linking.openURL('https://instagram.com/unilink')}
              >
                <MaterialIcons name="instagram" size={24} color="#e1306c" />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.copyright}>© {new Date().getFullYear()} UniLink. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 150,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#4a6fa5',
    marginLeft: 12,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  socialIcon: {
    marginHorizontal: 12,
  },
  copyright: {
    fontSize: 12,
    color: '#999',
    marginTop: 24,
    textAlign: 'center',
  },
});