// Screens/VisaInformationScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useItinerary } from '../context/ItineraryContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Routes } from '../navigation/routes';

export default function VisaInformationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { toggleFacilityKey } = useItinerary();

  const handleDone = () => {
    toggleFacilityKey('visa');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/images/VisaPage.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Header overlay */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Visa Requirements</Text>
          <Text style={styles.subtitle}>Check entry rules for your destination</Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.destination}>Cabo San Lucas, Mexico</Text>
          <Text style={styles.requirements}>
            U.S. citizens traveling to Mexico for tourism or business do not require a visa for stays up to 180 days.
          </Text>

          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>DONE</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  background: { flex: 1, justifyContent: 'flex-start' },

  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },

  infoCard: {
    backgroundColor: 'white',
    marginTop: 'auto',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
    elevation: 4,
  },
  destination: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12,
  },
  requirements: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 24,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
