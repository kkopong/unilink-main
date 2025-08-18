import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

// Enhanced KNUST campus locations with more details
const campusLocations = [
  {
    id: "1",
    title: "KNUST Main Library",
    description: "Central library with study spaces and research materials",
    category: "Academic",
    coordinate: { latitude: 5.6375, longitude: -0.1878 },
    openHours: "8:00 AM - 10:00 PM",
    facilities: ["WiFi", "Study Rooms", "Computer Lab"],
    walkingTime: "5 min",
    icon: "library-outline",
    rating: 4.5,
  },
  {
    id: "2",
    title: "Great Hall",
    description: "Iconic assembly hall for ceremonies and events",
    category: "Landmark",
    coordinate: { latitude: 5.6368, longitude: -0.1885 },
    openHours: "Event-based",
    facilities: ["Auditorium", "Parking"],
    walkingTime: "3 min",
    icon: "people-outline",
    rating: 4.8,
  },
  {
    id: "3",
    title: "SRC Mall",
    description: "Student shopping and dining center",
    category: "Dining",
    coordinate: { latitude: 5.638, longitude: -0.187 },
    openHours: "7:00 AM - 9:00 PM",
    facilities: ["Food Court", "ATM", "Shops"],
    walkingTime: "7 min",
    icon: "cafe-outline",
    rating: 4.2,
  },
  {
    id: "4",
    title: "Engineering Block",
    description: "College of Engineering lecture halls and labs",
    category: "Academic",
    coordinate: { latitude: 5.6365, longitude: -0.189 },
    openHours: "7:00 AM - 6:00 PM",
    facilities: ["Labs", "Lecture Halls", "WiFi"],
    walkingTime: "8 min",
    icon: "construct-outline",
    rating: 4.3,
  },
  {
    id: "5",
    title: "Main Gate",
    description: "Primary entrance to KNUST campus",
    category: "Entrance",
    coordinate: { latitude: 5.639, longitude: -0.186 },
    openHours: "24/7",
    facilities: ["Security", "Parking"],
    walkingTime: "10 min",
    icon: "car-outline",
    rating: 4.0,
  },
  {
    id: "6",
    title: "Student Center",
    description: "Hub for student activities and services",
    category: "Academic",
    coordinate: { latitude: 5.6372, longitude: -0.1882 },
    openHours: "8:00 AM - 8:00 PM",
    facilities: ["WiFi", "Meeting Rooms", "Cafeteria"],
    walkingTime: "4 min",
    icon: "school-outline",
    rating: 4.4,
  },
  {
    id: "7",
    title: "Medical Center",
    description: "Campus health services and emergency care",
    category: "Healthcare",
    coordinate: { latitude: 5.6378, longitude: -0.1875 },
    openHours: "24/7",
    facilities: ["Emergency Care", "Pharmacy", "Ambulance"],
    walkingTime: "6 min",
    icon: "medical-outline",
    rating: 4.1,
  },
];

const categories = ["All", "Academic", "Dining", "Landmark", "Entrance", "Healthcare"];

const EnhancedMapScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({ 
    title: "", 
    description: "", 
    category: "Academic" 
  });
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [activeTab, setActiveTab] = useState("nearby");
  const [locationPermission, setLocationPermission] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [region, setRegion] = useState({
    latitude: 5.637,
    longitude: -0.188,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = campusLocations.filter(location =>
        location.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Get user's current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show your current location');
        setLocationPermission(false);
        return;
      }

      setLocationPermission(true);
      
      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        const currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        
        setUserLocation(currentLocation);
        setRegion({
          ...currentLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        // Fallback to KNUST coordinates
        const fallbackLocation = { latitude: 5.637, longitude: -0.188 };
        setUserLocation(fallbackLocation);
        setRegion({
          ...fallbackLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    })();
  }, []);

  // Calculate nearby locations based on user position
  useEffect(() => {
    if (!userLocation) {
      // If no user location, still populate with default data
      setNearbyLocations(campusLocations);
      setAllLocations(campusLocations);
      return;
    }

    const nearby = campusLocations
      .map((location) => ({
        ...location,
        distance: calculateDistance(userLocation, location.coordinate),
      }))
      .filter((location) => location.distance <= 5) // Within 5km
      .sort((a, b) => a.distance - b.distance);

    const all = campusLocations
      .map((location) => ({
        ...location,
        distance: calculateDistance(userLocation, location.coordinate),
      }))
      .sort((a, b) => a.distance - b.distance);

    setNearbyLocations(nearby);
    setAllLocations(all);
  }, [userLocation]);

  // Simple distance calculation (Haversine formula simplified)
  const calculateDistance = (pos1, pos2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((pos2.latitude - pos1.latitude) * Math.PI) / 180;
    const dLng = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pos1.latitude * Math.PI) / 180) *
        Math.cos((pos2.latitude * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSetDestination = (location) => {
    setDestination(location);
    setSelectedLocation(location);
    setShowSearchResults(false);
    
    // Animate to the destination on the map
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coordinate.latitude,
        longitude: location.coordinate.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
    
    Alert.alert("Destination Set", `Navigation to ${location.title} started!`);
  };

  const handleMarkerPress = (location) => {
    setSelectedLocation(location);
    setShowSearchResults(false);
    
    // Animate to the selected location
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coordinate.latitude,
        longitude: location.coordinate.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      }, 1000);
    }
  };

  const handleSearchResultPress = (location) => {
    setSearchQuery(location.title);
    setShowSearchResults(false);
    handleMarkerPress(location);
  };

  const centerMapOnUser = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const getCurrentLocation = async () => {
    if (!locationPermission) {
      Alert.alert('Permission needed', 'Please grant location permission to use this feature');
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setUserLocation(currentLocation);
      centerMapOnUser();
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const handleAddLocation = () => {
    if (newLocation.title && newLocation.description) {
      Alert.alert("Location Added", "New location has been added successfully!");
      setShowAddLocation(false);
      setNewLocation({ title: "", description: "", category: "Academic" });
    } else {
      Alert.alert("Error", "Please fill in all fields");
    }
  };

  const renderNearbyTab = () => {
    const locationsToShow = nearbyLocations.filter(location => {
      if (searchQuery.trim() === '') return true;
      return location.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             location.description.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
      <ScrollView 
        style={styles.tabContent} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Areas (Within 5km)</Text>
          <TouchableOpacity onPress={getCurrentLocation} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
        
        {locationsToShow.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No matching locations found' : 'No locations found within 5km'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try a different search term' : 'Try refreshing your location'}
            </Text>
          </View>
        ) : (
          locationsToShow.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={styles.nearbyCard}
              onPress={() => handleMarkerPress(location)}
            >
              <Ionicons name={location.icon} size={20} color="#3B82F6" />
              <View style={styles.nearbyInfo}>
                <Text style={styles.nearbyTitle}>{location.title}</Text>
                <Text style={styles.nearbyDistance}>
                  {location.distance < 1 
                    ? `${Math.round(location.distance * 1000)}m away`
                    : `${location.distance?.toFixed(1)}km away`
                  }
                </Text>
              </View>
              <View style={styles.walkingTimeBadge}>
                <Text style={styles.walkingTimeText}>{location.walkingTime}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    );
  };

  const renderAllLocationsTab = () => {
    let locationsToShow = allLocations.length > 0 ? allLocations : campusLocations;
    
    // Apply filters
    locationsToShow = locationsToShow.filter(location => {
      const matchesCategory = selectedCategory === "All" || location.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === '' || 
        location.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <ScrollView 
        style={styles.tabContent} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.activeCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.activeCategoryButtonText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.addLocationButton}
            onPress={() => setShowAddLocation(true)}
          >
            <Ionicons name="add-outline" size={20} color="#3B82F6" />
            <Text style={styles.addLocationText}>Quick Add Location</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Campus Locations</Text>
          <Text style={styles.locationCount}>
            {locationsToShow.length} location{locationsToShow.length !== 1 ? 's' : ''}
          </Text>
        </View>
        
        {locationsToShow.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="school-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No locations found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try a different search term' : 'Try changing the category filter'}
            </Text>
          </View>
        ) : (
          locationsToShow.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.locationCard,
                selectedLocation?.id === location.id && styles.selectedCard
              ]}
              onPress={() => handleMarkerPress(location)}
            >
              <View style={styles.locationCardContent}>
                <View style={styles.locationHeader}>
                  <Ionicons 
                    name={location.icon} 
                    size={24} 
                    color="#3B82F6" 
                    style={styles.locationIcon}
                  />
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationTitle}>{location.title}</Text>
                    <Text style={styles.locationDescription}>{location.description}</Text>
                    <View style={styles.locationDetails}>
                      <Ionicons name="time-outline" size={12} color="#6B7280" />
                      <Text style={styles.detailText}>{location.openHours}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={styles.ratingText}>{location.rating}</Text>
                      {location.distance && (
                        <>
                          <Text style={styles.distanceSeparator}> • </Text>
                          <Text style={styles.distanceText}>
                            {location.distance < 1 
                              ? `${Math.round(location.distance * 1000)}m`
                              : `${location.distance.toFixed(1)}km`
                            }
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{location.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Map Area */}
      <View style={styles.mapContainer}>
        {/* Search Bar at Top */}
        <View style={styles.topSearchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.topSearchInput}
              placeholder="Search locations on map..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => {
                setSearchQuery("");
                setShowSearchResults(false);
              }} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <View style={styles.searchResultsContainer}>
              {searchResults.map((location) => (
                <TouchableOpacity
                  key={location.id}
                  style={styles.searchResultItem}
                  onPress={() => handleSearchResultPress(location)}
                >
                  <Ionicons name={location.icon} size={16} color="#3B82F6" />
                  <View style={styles.searchResultInfo}>
                    <Text style={styles.searchResultTitle}>{location.title}</Text>
                    <Text style={styles.searchResultDescription}>{location.description}</Text>
                  </View>
                  <View style={styles.searchResultCategory}>
                    <Text style={styles.searchResultCategoryText}>{location.category}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          region={userLocation ? {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          } : region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          mapType="standard"
        >
          {/* User Location Marker */}
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Your Location"
              description="You are here"
            >
              <View style={styles.userLocationMarker}>
                <View style={styles.userLocationDot} />
              </View>
            </Marker>
          )}

          {/* 5km Radius Circle */}
          {userLocation && (
            <Circle
              center={userLocation}
              radius={5000} // 5km in meters
              strokeColor="rgba(59, 130, 246, 0.5)"
              fillColor="rgba(59, 130, 246, 0.1)"
              strokeWidth={2}
            />
          )}

          {/* Campus Location Markers */}
          {(() => {
            let locationsToShow = activeTab === "nearby" ? nearbyLocations : allLocations;
            if (locationsToShow.length === 0) {
              locationsToShow = campusLocations;
            }
            
            return locationsToShow
              .filter(location => {
                if (searchQuery.trim() === '') return true;
                return location.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       location.description.toLowerCase().includes(searchQuery.toLowerCase());
              })
              .filter(location => {
                if (activeTab === "all") {
                  return selectedCategory === "All" || location.category === selectedCategory;
                }
                return true;
              })
              .map((location) => (
                <Marker
                  key={location.id}
                  coordinate={location.coordinate}
                  title={location.title}
                  description={location.description}
                  onPress={() => handleMarkerPress(location)}
                  pinColor={selectedLocation?.id === location.id ? "red" : "green"}
                />
              ));
          })()}

          {/* Route line from user to destination */}
          {destination && userLocation && (
            <Polyline
              coordinates={[userLocation, destination.coordinate]}
              strokeColor="#3B82F6"
              strokeWidth={3}
              lineDashPattern={[5, 5]}
            />
          )}
        </MapView>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={styles.mapControlButton}
            onPress={centerMapOnUser}
          >
            <Ionicons name="locate-outline" size={24} color="#3B82F6" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.mapControlButton}
            onPress={getCurrentLocation}
          >
            <Ionicons name="refresh-outline" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Destination Info Overlay */}
        {destination && (
          <View style={styles.destinationOverlay}>
            <View style={styles.navigationHeader}>
              <Ionicons name="navigate-outline" size={16} color="#10B981" />
              <Text style={styles.navigationLabel}>Navigating to:</Text>
            </View>
            <Text style={styles.navigationDestination}>{destination.title}</Text>
            <Text style={styles.navigationTime}>{destination.walkingTime} walk</Text>
          </View>
        )}
      </View>

      {/* Bottom Navigation Tabs */}
      <View style={styles.bottomContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "nearby" && styles.activeTab]}
            onPress={() => setActiveTab("nearby")}
          >
            <Ionicons 
              name="location-outline" 
              size={20} 
              color={activeTab === "nearby" ? "#3B82F6" : "#6B7280"} 
            />
            <Text style={[
              styles.tabText,
              activeTab === "nearby" && styles.activeTabText
            ]}>
              Nearby
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === "all" && styles.activeTab]}
            onPress={() => setActiveTab("all")}
          >
            <Ionicons 
              name="list-outline" 
              size={20} 
              color={activeTab === "all" ? "#3B82F6" : "#6B7280"} 
            />
            <Text style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText
            ]}>
              All Locations
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "nearby" ? renderNearbyTab() : renderAllLocationsTab()}
      </View>

      {/* Location Details Modal */}
      <Modal
        visible={selectedLocation !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedLocation(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedLocation && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>{selectedLocation.title}</Text>
                    <Text style={styles.modalDescription}>
                      {selectedLocation.description}
                    </Text>
                  </View>
                  <View style={styles.modalCategoryBadge}>
                    <Text style={styles.modalCategoryText}>
                      {selectedLocation.category}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalDetails}>
                  <View style={styles.modalDetailRow}>
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={styles.modalDetailText}>
                      {selectedLocation.openHours}
                    </Text>
                  </View>

                  <View style={styles.facilitiesContainer}>
                    {selectedLocation.facilities.map((facility) => (
                      <View key={facility} style={styles.facilityBadge}>
                        <Text style={styles.facilityText}>{facility}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.setDestinationButton}
                      onPress={() => handleSetDestination(selectedLocation)}
                    >
                      <Ionicons name="navigate-outline" size={16} color="white" />
                      <Text style={styles.setDestinationText}>Set as Destination</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setSelectedLocation(null)}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Location Modal */}
      <Modal
        visible={showAddLocation}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddLocation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addLocationModal}>
            <Text style={styles.addLocationTitle}>Add New Location</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Location name"
              value={newLocation.title}
              onChangeText={(text) => setNewLocation({ ...newLocation, title: text })}
              placeholderTextColor="#9CA3AF"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newLocation.description}
              onChangeText={(text) => setNewLocation({ ...newLocation, description: text })}
              placeholderTextColor="#9CA3AF"
              multiline
            />

            <View style={styles.addLocationActions}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddLocation}
              >
                <Text style={styles.addButtonText}>Add Location</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddLocation(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#E5F3FF',
  },
  topSearchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  topSearchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  clearButton: {
    padding: 4,
  },
  searchResultsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchResultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  searchResultTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  searchResultDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  searchResultCategory: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  searchResultCategoryText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 100,
    right: 20,
    zIndex: 1,
  },
  mapControlButton: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10,
  },
  destinationOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 130 : 110,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
  },
  navigationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  navigationLabel: {
    marginLeft: 8,
    fontWeight: '500',
    color: '#374151',
  },
  navigationDestination: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  navigationTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  bottomContainer: {
    backgroundColor: 'white',
    height: height * 0.45, // Reduced height to prevent overlap
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  locationCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  refreshButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  userLocationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  distanceSeparator: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  distanceText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterContainer: {
    marginBottom: 16,
  },
  scrollContentContainer: {
    paddingBottom: 100, // Extra padding to account for fixed bottom nav
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#3B82F6',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeCategoryButtonText: {
    color: 'white',
  },
  addLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  addLocationText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  locationCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  locationHeader: {
    flexDirection: 'row',
    flex: 1,
  },
  locationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  locationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  nearbyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  nearbyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nearbyTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  nearbyDistance: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  walkingTimeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  walkingTimeText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  modalCategoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalCategoryText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalDetails: {
    paddingTop: 16,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalDetailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  facilityBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  facilityText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  setDestinationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
  },
  setDestinationText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 8,
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  closeButtonText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  addLocationModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  addLocationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 16,
  },
  addLocationActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '500',
    fontSize: 16,
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

export default EnhancedMapScreen;