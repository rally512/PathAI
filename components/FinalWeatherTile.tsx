// FinalWeatherTile.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useItinerary } from '../context/ItineraryContext';
import { getWeatherForecast, DailyForecast } from '../utils/getWeatherForecast';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getWeatherIconName } from '../utils/getWeatherIconName';

export default function FinalWeatherTile() {
  const { destination } = useItinerary();
  const [forecast, setForecast] = useState<DailyForecast[] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      if (destination?.latitude && destination?.longitude) {
        const result = await getWeatherForecast(destination.latitude, destination.longitude);
        if (result) {
          setForecast(result.forecast);
        }
      }
    }
    fetchWeather();
  }, [destination]);

  const current = forecast?.[0];

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <ImageBackground
          source={require('../assets/images/FinalWeatherTile.jpg')}
          style={styles.tile}
          imageStyle={{ borderRadius: 16 }}
        >
          <Text style={styles.tileText}>Weather Forecast</Text>
        </ImageBackground>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Weather Forecast</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.location}>{destination?.name}</Text>

            {current && (
              <View style={styles.currentBox}>
                <MaterialCommunityIcons
                  name={getWeatherIconName(current.condition)}
                  size={48}
                  color="#555"
                  style={{ marginBottom: 6 }}
                />
                <Text style={styles.currentTemp}>
                  {current.high}° / {current.low}°
                </Text>
                <Text style={styles.currentCondition}>{current.condition}</Text>
              </View>
            )}

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
              {forecast?.map((day, index) => (
                <View key={index} style={styles.dayCard}>
                  <Text style={styles.dayDate}>
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                  <MaterialCommunityIcons
                    name={getWeatherIconName(day.condition)}
                    size={28}
                    color="#333"
                    style={{ marginVertical: 6 }}
                  />
                  <Text style={styles.dayTemp}>
                    {day.high}° / {day.low}°
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  tile: {
    height: 150,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  tileText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  currentBox: {
    alignItems: 'center',
    marginVertical: 10,
  },
  currentTemp: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  currentCondition: {
    fontSize: 16,
    color: '#444',
    marginTop: 4,
    textAlign: 'center',
  },
  scrollRow: {
    marginVertical: 10,
  },
  dayCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    width: 80,
  },
  dayDate: {
    fontSize: 13,
    fontWeight: '600',
  },
  dayTemp: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});
