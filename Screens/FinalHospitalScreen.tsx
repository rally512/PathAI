import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useItinerary } from '../context/ItineraryContext';

export default function FinalHospitalScreen() {
  const { confirmedHospitals } = useItinerary();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Medical Facilities</Text>
            <Text style={styles.subtitle}>Click for directions or more info</Text>
          </View>
          <View style={styles.iconCircle}>
            <Ionicons name="medkit" size={24} color="#fff" />
          </View>
        </View>
      </View>

      <FlatList
        data={confirmedHospitals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          const directionsLink = `https://maps.apple.com/?daddr=${item.latlng.latitude},${item.latlng.longitude}`;
          return (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hospitalName}>{item.name}</Text>
                  {item.distanceText && item.durationText && (
                    <Text style={styles.detail}>{item.distanceText} ({item.durationText})</Text>
                  )}
                  {item.address && <Text style={styles.detail}>{item.address}</Text>}
                  {item.hours && item.hours.length > 0 && (
                    <View style={{ marginTop: 4 }}>
                      <Text style={styles.hoursLabel}>Hours:</Text>
                      {item.hours.slice(0, 2).map((h: string, idx: number) => (
                        <Text key={idx} style={styles.hoursText}>{h}</Text>
                      ))}
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => Linking.openURL(directionsLink)}
                  style={styles.mapIconWrapper}
                >
                  <Ionicons name="map-outline" size={30} color="#00BFFF" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  headerWrapper: {
    paddingHorizontal: 8, // 👈 inset from edges
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 50,
  },
  iconCircle: {
    backgroundColor: '#d32f2f',
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
  },
  subtitle: {
    fontSize: 20,
    color: '#555',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  detail: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
  },
  hoursLabel: {
    fontSize: 12,
    color: '#444',
    fontWeight: '600',
    marginTop: 6,
  },
  hoursText: {
    fontSize: 12,
    color: '#666',
  },
  mapIconWrapper: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f8ff',
  },
  doneButton: {
    position: 'absolute',
    bottom: 80,
    left: 40,
    right: 40,
    backgroundColor: '#1e8fff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  doneText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
