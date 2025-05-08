// Updated DocumentsScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes } from '../navigation/routes';
import { useItinerary } from '../context/ItineraryContext';
import type { RootStackParamList } from '../types';

const { width } = Dimensions.get('window');
const GAP = 16;
const COLS = 2;
const TILE_W = (width - GAP * (COLS + 1)) / COLS;
const TILE_H = TILE_W * 1.2;

const exampleImages = [
  require('../assets/images/ExamplePassport.jpg'),
  require('../assets/images/ExampleVisa.jpg'),
  require('../assets/images/ExampleReservation.jpg'),
];

export default function DocumentsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { documents, setDocuments, toggleFacilityKey } = useItinerary();

  const pickImage = async (fromCamera: boolean) => {
    let result;
    if (fromCamera) {
      result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    }

    if (!result.canceled && result.assets.length > 0) {
      setDocuments(prev => [...prev, result.assets[0].uri]);
    }
  };

  const handleDone = () => {
    toggleFacilityKey('documents');
    navigation.goBack();
  };

  const renderTile = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.docTile}>
      <Image source={{ uri: item }} style={styles.docImage} />
      <Text style={styles.docLabel}>Document {index + 1}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.topBarText}>Travel Documents</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.headerSection}>
        <Text style={styles.title}>Travel Documents</Text>
        <Text style={styles.subtitle}>Upload photos of important documents like your passport, visa, or reservations.</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cameraButton} onPress={() => pickImage(true)}>
            <Ionicons name="camera-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Take a Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(false)}>
            <Ionicons name="cloud-upload-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Upload from Files</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={documents.length > 0 ? documents : exampleImages.map((_, i) => Image.resolveAssetSource(exampleImages[i]).uri)}
        keyExtractor={(item, index) => index.toString()}
        numColumns={COLS}
        renderItem={renderTile}
        contentContainerStyle={styles.docGrid}
      />

      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  topBar: {
    backgroundColor: '#1E90FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  topBarText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  headerSection: { padding: 16, backgroundColor: 'white', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  buttonRow: { flexDirection: 'row', marginTop: 16, justifyContent: 'space-between' },
  cameraButton: { flexDirection: 'row', backgroundColor: '#1E90FF', borderRadius: 10, padding: 12, alignItems: 'center', flex: 0.48, justifyContent: 'center' },
  uploadButton: { flexDirection: 'row', backgroundColor: '#8ec984', borderRadius: 10, padding: 12, alignItems: 'center', flex: 0.48, justifyContent: 'center' },
  buttonText: { color: 'white', marginLeft: 8, fontWeight: '600' },
  docGrid: { padding: GAP },
  docTile: {
    width: TILE_W,
    height: TILE_H,
    margin: GAP / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  docImage: { width: '100%', height: '80%', resizeMode: 'cover' },
  docLabel: { fontSize: 14, color: '#333', marginTop: 8, fontWeight: '600' },
  doneButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 30,
    margin: 32,
    alignItems: 'center',
  },
  doneButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
