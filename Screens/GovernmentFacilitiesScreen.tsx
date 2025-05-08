// GovernmentFacilitiesScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useItinerary } from '../context/ItineraryContext';

const { width } = Dimensions.get('window');
const GAP = 16;
const COLS = 2;
const TILE_W = (width - GAP * (COLS + 1)) / COLS;
const TILE_H = TILE_W * 1.0;

const AGENCY_OPTIONS = [
  { key: 'police', label: 'Police / Sheriff', icon: 'shield-checkmark-outline' },
  { key: 'fire_ems', label: 'Fire/EMS', icon: 'flame-outline' },
  { key: 'embassy', label: 'U.S. Embassy', icon: 'flag-outline' },
  { key: 'consulate', label: 'U.S. Consulate', icon: 'briefcase-outline' },
  { key: 'fbi', label: 'F.B.I. Office', icon: 'lock-closed-outline' },
  { key: 'un', label: 'U.N. Office', icon: 'globe-outline' },
  { key: 'interpol', label: 'Interpol', icon: 'navigate-outline' },
  { key: 'passport', label: 'Passport Office', icon: 'document-text-outline' },
  { key: 'tourism', label: 'Tourism Police', icon: 'airplane-outline' },
];

export default function GovernmentFacilitiesScreen({ navigation }: any) {
  const {
    selectedAgencies,
    setSelectedAgencies,
    toggleFacilityKey,
  } = useItinerary();

  const [selected, setSelected] = useState<string[]>(selectedAgencies || []);

  useEffect(() => {
    setSelected(selectedAgencies || []);
  }, [selectedAgencies]);

  const toggleSelection = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleDone = () => {
    setSelectedAgencies(selected);
    toggleFacilityKey('government');
    navigation.goBack();
  };

  const renderTile = ({ item }: { item: typeof AGENCY_OPTIONS[0] }) => {
    const isSelected = selected.includes(item.key);
    return (
      <TouchableOpacity
        style={[styles.tile, isSelected && styles.tileSelected]}
        onPress={() => toggleSelection(item.key)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={item.icon as any}
          size={28}
          color={isSelected ? '#007AFF' : '#333'}
          style={styles.icon}
        />
        <Text style={[styles.label, isSelected && { color: '#007AFF' }]} numberOfLines={2}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcons}>
          <Ionicons name="arrow-back" size={24} color="#333" onPress={() => navigation.goBack()} />
        </View>
        <Text style={styles.title}>Government Agencies</Text>
        <Text style={styles.sub}>Select the tiles you want to include in your itinerary.</Text>
      </View>

      <FlatList
        key={COLS}
        data={AGENCY_OPTIONS}
        numColumns={COLS}
        renderItem={renderTile}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.grid}
      />

      <TouchableOpacity style={styles.finalizeButton} onPress={handleDone}>
        <Text style={styles.finalizeText}>Done</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F0' },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: GAP,
    paddingTop: GAP * 2,
    paddingBottom: GAP * 1.5,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    zIndex: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: GAP,
  },
  title: { fontSize: 24, fontWeight: '600', color: '#111' },
  sub: { marginTop: 4, fontSize: 14, color: '#666' },
  grid: {
    padding: GAP,
    paddingBottom: GAP * 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tile: {
    width: TILE_W,
    height: TILE_H,
    margin: GAP / 2,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tileSelected: {
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  icon: { marginBottom: 8 },
  label: { fontSize: 14, color: '#333', textAlign: 'center' },
  finalizeButton: {
    position: 'absolute',
    bottom: GAP * 2.5,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  finalizeText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
