import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function BottomNav({ navigation }) {
  return (
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
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#B3D0F7',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#dbeafe',
    width: '100%',
  },
});