// Screens/WeatherScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useItinerary } from '../context/ItineraryContext';
import { Routes } from '../navigation/routes';
import type { RootStackParamList } from '../types';

export default function WeatherScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { toggleFacilityKey } = useItinerary();

  const handleOk = () => {
    toggleFacilityKey('weather');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Blue menu bar with white back arrow */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Image with overlay card */}
      <ImageBackground
        source={require('../assets/images/WeatherTile.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlayCard}>
          <Text style={styles.title}>Weather Forecast Added</Text>
          <Text style={styles.subtitle}>
            The weather forecast for your destination will be included in your final itinerary.
          </Text>
          <TouchableOpacity style={styles.okButton} onPress={handleOk}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    backgroundColor: '#1E90FF',
    height: 50,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlayCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '90%',
    marginBottom: 40,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  okButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  okButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
