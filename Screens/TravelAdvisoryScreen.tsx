import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useItinerary } from '../context/ItineraryContext';
import { getCityAdvisory } from '../utils/getCityAdvisory';
import SafetyBriefModal from '../components/SafetyBriefModal';

const RISK_LEVELS = [
  { label: '🟢 Chill Zone (Very Safe)', color: '#4CAF50' },
  { label: '👀 Eyes Open (Slight Risk)', color: '#FFEB3B' },
  { label: '⚠️ Stay Sharp (Moderate Risk)', color: '#FF9800' },
  { label: '🚨 Tense Terrain (High Risk)', color: '#F44336' },
  { label: '🔴 Red Zone (Extreme Risk)', color: '#B71C1C' },
];

export default function TravelAdvisoryScreen() {
  const navigation = useNavigation();
  const {
    toggleFacilityKey,
    travelAdvisory,
    setTravelAdvisory,
    destination,
  } = useItinerary();

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Always calculate level index from actual level to match modal
  const levelIndex = travelAdvisory?.riskLevel
    ? Math.min(Math.max(travelAdvisory.riskLevel - 1, 0), 4)
    : 2; // Default to middle level

  useEffect(() => {
    async function fetchAdvisory() {
      if (!travelAdvisory && destination?.name) {
        setLoading(true);
        try {
          const advisory = await getCityAdvisory(destination.name);
          console.log('🛰️ Advisory fetched:', advisory);

          setTravelAdvisory({
            riskLevel: advisory.level,
            summary: advisory.summary,
          });
        } catch (err) {
          console.error('Advisory fetch failed:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchAdvisory();
  }, [destination]);

  const handleDone = () => {
    toggleFacilityKey('advisory');
    navigation.goBack();
  };

  const renderRiskBar = () => (
    <View style={styles.riskBar}>
      {RISK_LEVELS.map((level, index) => (
        <View
          key={index}
          style={[
            styles.riskSegment,
            { backgroundColor: index <= levelIndex ? level.color : '#eee' },
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ImageBackground
        source={require('../assets/images/TravelAdvisory.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Travel Advisory</Text>
          <Text style={styles.subtitle}>Check safety levels for your destination</Text>
        </View>

        <View style={styles.bottomCard}>
          <Text style={styles.location}>{destination?.name || 'Selected Location'}</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>Calculating risk level...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.riskLevelText}>{RISK_LEVELS[levelIndex]?.label}</Text>
              {renderRiskBar()}
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.linkText}>View full PathAI Advisory</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>DONE</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <SafetyBriefModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        advisory={travelAdvisory ?? null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 2,
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  titleContainer: {
    position: 'absolute',
    top: 70,
    left: 24,
    right: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
  },
  bottomCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  location: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 10,
    textAlign: 'center',
  },
  riskLevelText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  riskBar: {
    flexDirection: 'row',
    width: '100%',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 16,
  },
  riskSegment: {
    flex: 1,
    height: '100%',
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
});
