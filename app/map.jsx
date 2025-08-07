import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const campusRegion = {
  latitude: 5.637, // Example location (e.g., KNUST)
  longitude: -0.188,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

const MapScreen = () => {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webMapContainer}>
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=Kwame+Nkrumah+University+of+Science+and+Technology`}
        />
      </View>
    );
  }

  return (
    // <MapView
    //   style={styles.map}
    //   initialRegion={campusRegion}
    //   showsUserLocation
    // >
    //   <Marker
    //     coordinate={{ latitude: 5.637, longitude: -0.188 }}
    //     title="KNUST"
    //     description="Campus Location"
    //   />
    // </MapView>
    <View></View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width,
    height,
  },
  webMapContainer: {
    flex: 1,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
