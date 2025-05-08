import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type TileProps = {
  icon: keyof typeof Ionicons.glyphMap;
  labelTop: string;
  labelBottom: string;
  onPress: () => void;
  isSelected: boolean;
};

const { width } = Dimensions.get('window');
const TILE_MARGIN = 12;
const TILE_SIZE = (width - TILE_MARGIN * 4) / 2.25; // ← slightly tighter than 2.1

const Tile: React.FC<TileProps> = ({ icon, labelTop, labelBottom, onPress, isSelected }) => {
  return (
    <TouchableOpacity
      style={[styles.tileContainer, isSelected && styles.selectedTile]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons
        name={icon}
        size={28}
        color={isSelected ? '#007AFF' : '#333'}
        style={styles.icon}
      />
      <Text style={[styles.labelTop, isSelected && styles.selectedText]}>{labelTop}</Text>
      <Text style={[styles.labelBottom, isSelected && styles.selectedText]}>{labelBottom}</Text>
    </TouchableOpacity>
  );
};

export default Tile;

const styles = StyleSheet.create({
  tileContainer: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 20,
    margin: TILE_MARGIN / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  selectedTile: {
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  icon: {
    marginBottom: 10,
  },
  labelTop: {
    color: '#333',
    fontSize: 14,
  },
  labelBottom: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#007AFF',
  },
});
