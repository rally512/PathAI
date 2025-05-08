// components/HospitalInfoModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HospitalInfoModalProps {
  visible: boolean;
  onClose: () => void;
  hospital: {
    name: string;
    location: string;
    phone?: string;
    directionsLink: string;
  } | null;
}

export default function HospitalInfoModal({ visible, onClose, hospital }: HospitalInfoModalProps) {
  if (!hospital) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.hospitalName}>{hospital.name}</Text>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={20} color="#00BFFF" style={{ marginRight: 6 }} />
            <Text style={styles.infoText}>{hospital.location}</Text>
          </View>

          {hospital.phone && (
            <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(`tel:${hospital.phone}`)}>
              <Ionicons name="call-outline" size={20} color="#00BFFF" style={{ marginRight: 6 }} />
              <Text style={[styles.infoText, { textDecorationLine: 'underline', color: '#4EA1F3' }]}>
                Call Emergency Room
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => Linking.openURL(hospital.directionsLink)}
          >
            <Text style={styles.buttonText}>Get Directions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1e1e1e',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    alignItems: 'center',
    position: 'relative',
  },
  hospitalName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    color: '#ccc',
    fontSize: 14,
  },
  directionsButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});
