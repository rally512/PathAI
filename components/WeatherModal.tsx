import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useItinerary } from '../context/ItineraryContext';
import { DailyForecast } from '../utils/getWeatherForecast';
import { getWeatherIconName } from '../utils/getWeatherIconName';


interface WeatherModalProps {
  visible: boolean;
  onClose: () => void;
  forecast: DailyForecast[];
  externalUrl: string;
}

const WeatherModal: React.FC<WeatherModalProps> = ({ visible, onClose, forecast, externalUrl }) => {
  const { destination } = useItinerary();
  const current = forecast?.[0];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Weather Forecast</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.location}>{destination?.name}</Text>

          {current && (
            <View style={styles.currentBox}>
              <Text style={styles.currentTemp}>{current.high}°</Text>
              <View style={styles.conditionRow}>
                <MaterialCommunityIcons
                  name={getWeatherIconName(current.condition)}
                  size={20}
                  color="#666"
                />
                <Text style={styles.currentCondition}> {current.condition}</Text>
              </View>
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
            {forecast?.slice(0, 5).map((day, index) => (
              <View key={index} style={styles.dayCard}>
                <Text style={styles.dayDate}>
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
                <MaterialCommunityIcons
                  name={getWeatherIconName(day.condition)}
                  size={24}
                  color="#333"
                  style={styles.emoji}
                />
                <Text style={styles.dayTemp}>{day.high}° / {day.low}°</Text>
              </View>
            ))}
          </ScrollView>

          {externalUrl && (
            <TouchableOpacity onPress={() => Linking.openURL(externalUrl)}>
              <Text style={styles.link}>View Full Forecast</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default WeatherModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  currentBox: {
    alignItems: 'center',
    marginVertical: 10,
  },
  currentTemp: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  currentCondition: {
    fontSize: 16,
    color: '#444',
  },
  scrollRow: {
    marginVertical: 10,
  },
  dayCard: {
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    alignItems: 'center',
    width: 80,
  },
  dayDate: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  emoji: {
    marginVertical: 4,
  },
  dayTemp: {
    fontSize: 14,
  },
  link: {
    textAlign: 'center',
    color: '#1d4ed8',
    fontWeight: '600',
    marginTop: 14,
    textDecorationLine: 'underline',
  },
});
