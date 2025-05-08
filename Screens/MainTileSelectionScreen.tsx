// Screens/MainTileSelectionScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Routes } from '../navigation/routes';
import { RootStackParamList } from '../types';
import Tile from '../components/Tile';
import { useItinerary } from '../context/ItineraryContext';

export default function MainTileSelectionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { selectedFacilityKeys } = useItinerary();

  const isSelected = (key: string) => selectedFacilityKeys.includes(key as any);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Blue Menu Bar */}
      <View style={styles.topMenu}>
        <Ionicons name="menu" size={24} color="#fff" />
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </View>

      {/* Title Banner */}
      <View style={styles.bannerCard}>
        <Text style={styles.header}>Personalize Your Trip</Text>
        <Text style={styles.subheader}>
          Click on the tiles you'd like in your final itinerary. We will find and organize everything for you.
        </Text>
      </View>

      {/* Tiles */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.grid}>
          <Tile
            icon="medkit-outline"
            labelTop="Nearby"
            labelBottom="Hospitals"
            onPress={() => navigation.navigate(Routes.HospitalMapScreen)}
            isSelected={isSelected('hospitals')}
          />
          <Tile
            icon="calendar-outline"
            labelTop="Travel"
            labelBottom="Schedule"
            onPress={() => navigation.navigate(Routes.TravelScheduleScreen)}
            isSelected={isSelected('schedule')}
          />
          <Tile
            icon="person-circle-outline"
            labelTop="Important"
            labelBottom="Contacts"
            onPress={() => navigation.navigate(Routes.ImportantContactScreen)}
            isSelected={isSelected('contacts')}
          />
          <Tile
            icon="business-outline"
            labelTop="Government"
            labelBottom="Facilities"
            onPress={() =>
              navigation.navigate(Routes.GovernmentFacilities, {
                keyword: '',
                destLat: 0,
                destLng: 0,
              })
            }
            isSelected={isSelected('government')}
          />
          <Tile
            icon="globe-outline"
            labelTop="Language"
            labelBottom="Translator"
            onPress={() => navigation.navigate(Routes.TranslatorScreen)}
            isSelected={isSelected('translate')}
          />
          <Tile
            icon="cloud-outline"
            labelTop="Check"
            labelBottom="Weather"
            onPress={() => navigation.navigate(Routes.WeatherScreen)}
            isSelected={isSelected('weather')}
          />
          <Tile
            icon="alert-circle-outline"
            labelTop="Travel"
            labelBottom="Advisory"
            onPress={() => navigation.navigate(Routes.TravelAdvisory)}
            isSelected={isSelected('advisory')}
          />
          <Tile
            icon="document-text-outline"
            labelTop="Visa"
            labelBottom="Requirements"
            onPress={() => navigation.navigate(Routes.VisaRequirements)}
            isSelected={isSelected('visa')}
          />
        </View>

        {/* Finalize Itinerary Button */}
        <TouchableOpacity
          style={styles.finalizeButton}
          onPress={() => navigation.navigate({ name: Routes.FinalItinerary, params: undefined })}
        >
          <Text style={styles.finalizeText}>Finalize Itinerary</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  topMenu: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  bannerCard: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  subheader: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 24,
  },
  finalizeButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 30,
    marginHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  finalizeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
