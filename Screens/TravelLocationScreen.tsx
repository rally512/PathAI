// TravelLocationScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useItinerary } from '../context/ItineraryContext';

const GOOGLE_API_KEY = 'AIzaSyBnNm71339K5KRSgA0Gggw68wxbZ35qXZM';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TravelLocation'>;

type Suggestion = {
  place_id: string;
  description: string;
};

export default function TravelLocationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { setDestination } = useItinerary();

  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  const fetchSuggestions = async (text: string) => {
    setInput(text);
    if (!text) return setSuggestions([]);

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      text
    )}&key=${GOOGLE_API_KEY}`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json.status === 'OK') setSuggestions(json.predictions);
      else console.warn('Google API Error:', json.status, json.error_message);
    } catch (err) {
      console.error('Autocomplete error:', err);
    }
  };

  const fetchPlaceDetails = async (placeId: string) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      setSelectedPlace(json.result);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (item: Suggestion) => {
    setInput(item.description);
    setSuggestions([]);
    fetchPlaceDetails(item.place_id);
  };

  const handleNext = () => {
    if (selectedPlace?.geometry?.location) {
      const destination = {
        name: selectedPlace.name || selectedPlace.formatted_address || input,
        latitude: selectedPlace.geometry.location.lat,
        longitude: selectedPlace.geometry.location.lng,
      };
      setDestination(destination);
      navigation.navigate('TripOverview', { destination });
    } else {
      alert('Please select a destination from the list.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/PastelPlane.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoiding}
        >
          <View style={styles.banner}>
            <Text style={styles.title}>Where are you going?</Text>
            <Text style={styles.subtitle}>
              Be as specific as possible. Start typing the hotel name or address if known.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Destination</Text>
              <TextInput
                value={input}
                onChangeText={fetchSuggestions}
                placeholder="Enter your destination (City, Hotel, Address, etc)"
                style={styles.textInput}
                placeholderTextColor="#666"
              />
              {suggestions.length > 0 && (
                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item.place_id}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelect(item)}>
                      <Text style={styles.suggestion}>{item.description}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  banner: {
    marginTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1d4ed8',
    textShadowColor: 'rgba(128, 128, 128, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
    padding: 20,
  },
  inputLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 16,
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  suggestion: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  nextButton: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 40,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
