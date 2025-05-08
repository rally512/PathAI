// TranslatorScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes } from '../navigation/routes';
import type { RootStackParamList } from '../types';
import { useItinerary } from '../context/ItineraryContext';
import { Ionicons } from '@expo/vector-icons';

export default function TranslatorScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { toggleFacilityKey } = useItinerary();

  const handleOk = () => {
    toggleFacilityKey('translate');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/TranslatorConfirmation.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#fff" style={styles.backIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.overlayCard}>
          <Text style={styles.title}>Translator Added</Text>
          <Text style={styles.subtitle}>
            The language translator app will be added to your final itinerary.
          </Text>
          <TouchableOpacity style={styles.okButton} onPress={handleOk}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#1E90FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 10,
  },
  backIcon: {
    marginTop: 4,
  },
  overlayCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '90%',
    marginBottom: 40,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  okButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  okButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
