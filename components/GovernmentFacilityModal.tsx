// components/GovernmentFacilityModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GovernmentFacilityModalProps {
  visible: boolean;
  onClose: () => void;
  facility: {
    name: string;
    location: string;
    phone?: string;
    website?: string;
    directionsLink: string;
  } | null;
}

export default function GovernmentFacilityModal({ visible, onClose, facility }: GovernmentFacilityModalProps) {
  if (!facility) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.facilityName}>{facility.name}</Text>

          <View style={styles.row}>
            <Ionicons name="location-outline" size={20} color="#00BFFF" style={{ marginRight: 6 }} />
            <Text style={styles.infoText}>{facility.location}</Text>
          </View>

          {facility.phone && (
            <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(`tel:${facility.phone}`)}>
              <Ionicons name="call-outline" size={20} color="#00BFFF" style={{ marginRight: 6 }} />
              <Text style={[styles.infoText, { textDecorationLine: 'underline', color: '#4EA1F3' }]}>
                Call Facility
              </Text>
            </TouchableOpacity>
          )}

{facility.website && (
  <TouchableOpacity
    style={styles.row}
    onPress={() => {
      if (facility.website) {
        Linking.openURL(facility.website);
      }
    }}
  >
    <Ionicons name="globe-outline" size={20} color="#00BFFF" style={{ marginRight: 6 }} />
    <Text style={[styles.infoText, { textDecorationLine: 'underline', color: '#4EA1F3' }]}>
      Visit Website
    </Text>
  </TouchableOpacity>
)}

          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => Linking.openURL(facility.directionsLink)}
          >
            <Text style={styles.buttonText}>Open in Maps</Text>
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
  facilityName: {
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
