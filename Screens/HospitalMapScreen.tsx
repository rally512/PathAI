// HospitalMapScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Linking,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useItinerary } from '../context/ItineraryContext';
import { GOOGLE_API_KEY } from '../config';

const { height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'HospitalMapScreen'>;

type Hospital = {
  id: string;
  name: string;
  latlng: { latitude: number; longitude: number };
  rating?: number;
  address?: string;
  phoneNumber?: string;
  hours?: string[];
  distanceText?: string;
  durationText?: string;
};

export default function HospitalMapScreen({ navigation }: Props) {
  const {
    destination,
    setSelectedHospitals,
    toggleFacilityKey,
    confirmedHospitals,
    setConfirmedHospitals,
  } = useItinerary();

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    if (!destination) return;

    const fetchHospitals = async () => {
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=emergency+room+near+${encodeURIComponent(
        destination.name
      )}&key=${GOOGLE_API_KEY}`;

      try {
        const searchRes = await fetch(searchUrl);
        const searchJson = await searchRes.json();

        const filtered = searchJson.results.filter((place: any) => {
          const name = place.name.toLowerCase();
          return (
            name.includes('emergency') &&
            !name.includes('clinic') &&
            !name.includes('urgent')
          );
        });

        const enrichedHospitals = await Promise.all(
          filtered.map(async (place: any) => {
            const placeId = place.place_id;
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,geometry,opening_hours&key=${GOOGLE_API_KEY}`;
            const detailsRes = await fetch(detailsUrl);
            const detailsJson = await detailsRes.json();

            const loc = place.geometry.location;
            const destStr = encodeURIComponent(destination.name);
            const originStr = `${loc.lat},${loc.lng}`;
            const matrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${destStr}&destinations=${originStr}&key=${GOOGLE_API_KEY}`;

            const matrixRes = await fetch(matrixUrl);
            const matrixJson = await matrixRes.json();
            const leg = matrixJson.rows?.[0]?.elements?.[0];

            return {
              id: placeId,
              name: place.name,
              latlng: { latitude: loc.lat, longitude: loc.lng },
              rating: place.rating,
              address: detailsJson.result.formatted_address,
              phoneNumber: detailsJson.result.formatted_phone_number,
              hours: detailsJson.result.opening_hours?.weekday_text || [],
              distanceText: leg?.distance?.text || null,
              durationText: leg?.duration?.text || null,
            };
          })
        );

        setHospitals(enrichedHospitals);
      } catch (err) {
        console.error('Error fetching hospitals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [destination]);

  const handleConfirm = () => {
    if (
      selectedHospital &&
      !confirmedHospitals.some((h) => h.id === selectedHospital.id)
    ) {
      setConfirmedHospitals([...confirmedHospitals, selectedHospital]);
    }
  };

  const handleDone = () => {
    setSelectedHospitals(confirmedHospitals);
    toggleFacilityKey('hospitals');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#1E90FF" />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: destination?.latitude || 30.2672,
            longitude: destination?.longitude || -97.7431,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {hospitals.map((h) => (
            <Marker
              key={h.id}
              coordinate={h.latlng}
              title={h.name}
              pinColor={
                confirmedHospitals.some((s) => s.id === h.id) ? 'blue' : 'red'
              }
              onPress={() => setSelectedHospital(h)}
            />
          ))}
        </MapView>
      )}

      {selectedHospital && (
        <View style={styles.infoCard}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedHospital(null)}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.name}>{selectedHospital.name}</Text>
          <Text style={styles.details}>🏥 Emergency Room</Text>
          <Text style={styles.details}>📍 {selectedHospital.address}</Text>

          {selectedHospital.rating && (
            <Text style={styles.details}>
              ⭐ {selectedHospital.rating.toFixed(1)} Google rating
            </Text>
          )}

          {selectedHospital.distanceText && selectedHospital.durationText && (
            <Text style={styles.details}>
              🚗 {selectedHospital.distanceText} away ({selectedHospital.durationText})
            </Text>
          )}

          {selectedHospital.hours && selectedHospital.hours.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={[styles.details, { fontWeight: '600', marginBottom: 2 }]}>Hours:</Text>
              {selectedHospital.hours.map((h, idx) => (
                <Text key={idx} style={styles.details}>
                  {h}
                </Text>
              ))}
            </View>
          )}

          {confirmedHospitals.some((h) => h.id === selectedHospital.id) ? (
            <Text style={{ color: 'green', marginTop: 10 }}>
              ✔️ Added to itinerary
            </Text>
          ) : (
            <TouchableOpacity onPress={handleConfirm} style={styles.button}>
              <Text style={styles.buttonText}>Add to Itinerary</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  infoCard: {
    position: 'absolute',
    bottom: 200,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  details: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  doneButton: {
    position: 'absolute',
    bottom: 95,
    left: 100,
    right: 100,
    backgroundColor: '#2e2828',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  doneText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#666',
  },
});
