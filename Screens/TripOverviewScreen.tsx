// Screens/TripOverviewScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useLocation } from '../context/LocationContext';
import { Routes } from '../navigation/routes';

type Props = NativeStackScreenProps<RootStackParamList, 'TripOverview'>;

export default function TripOverviewScreen({ navigation, route }: Props) {
  const { destination: navDestination } = route.params || {};
  const { destination: contextDestination } = useLocation();
  const destination = navDestination || contextDestination;

  const [tripStart, setTripStart] = useState<Date | null>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);

  const [tripEnd, setTripEnd] = useState<Date | null>(new Date());
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date: Date | null) => {
    return date
      ? date.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '';
  };

  if (!destination) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Trip Overview</Text>
        <Text style={styles.detail}>No destination selected.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.banner}>
        <Text style={styles.title}>Trip Overview</Text>
        <Text style={styles.subtitle}>{destination.name}</Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: destination.latitude,
          longitude: destination.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude: destination.latitude,
            longitude: destination.longitude,
          }}
          title={destination.name}
        />
      </MapView>

      <TouchableOpacity
        style={styles.picker}
        onPress={() => setShowStartPicker(true)}
      >
        <Text style={tripStart ? styles.pickerText : styles.placeholderText}>
          {tripStart ? formatDate(tripStart) : 'Select Trip Start Date'}
        </Text>
      </TouchableOpacity>

      {showStartPicker && (
        <DateTimePicker
          mode="date"
          value={tripStart || new Date()}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, date) => {
            setShowStartPicker(false);
            if (date) setTripStart(date);
          }}
        />
      )}

      <TouchableOpacity
        style={styles.picker}
        onPress={() => setShowEndPicker(true)}
      >
        <Text style={tripEnd ? styles.pickerText : styles.placeholderText}>
          {tripEnd ? formatDate(tripEnd) : 'Select Trip End Date'}
        </Text>
      </TouchableOpacity>

      {showEndPicker && (
        <DateTimePicker
          mode="date"
          value={tripEnd || new Date()}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, date) => {
            setShowEndPicker(false);
            if (date) setTripEnd(date);
          }}
        />
      )}

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate(Routes.MainTileSelection)}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      <Text
        style={styles.skipText}
        onPress={() => navigation.navigate(Routes.MainTileSelection)}
      >
        SKIP
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  detail: {
    fontSize: 16,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  map: {
    height: 250,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  picker: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 16,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  skipText: {
    marginTop: 16,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});