import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

interface Advisory {
  riskLevel: number;
  summary: string;
}

interface Props {
  advisory: Advisory | null;
  isVisible: boolean;
  onClose: () => void;
}

const RISK_LEVELS = [
  { label: '🟢 Chill Zone (Very Safe)', color: '#4CAF50' },
  { label: '👀 Eyes Open (Slight Risk)', color: '#FFEB3B' },
  { label: '⚠️ Stay Sharp (Moderate Risk)', color: '#FF9800' },
  { label: '🚨 Tense Terrain (High Risk)', color: '#F44336' },
  { label: '🔴 Red Zone (Extreme Risk)', color: '#B71C1C' },
];

const SafetyBriefModal: React.FC<Props> = ({ advisory, isVisible, onClose }) => {
  const rawLevel = advisory?.riskLevel ?? 3;
  const levelIndex = Math.min(Math.max(rawLevel - 1, 0), 4);
  const riskInfo = RISK_LEVELS[levelIndex];

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>PathAI Safety Brief</Text>

            <View style={styles.riskBar}>
              {RISK_LEVELS.map((level, index) => (
                <View
                  key={index}
                  style={[
                    styles.riskSegment,
                    {
                      backgroundColor: index <= levelIndex ? level.color : '#eee',
                    },
                  ]}
                />
              ))}
            </View>

            <Text style={styles.riskLevelLabel}>{riskInfo.label}</Text>

            <Text style={styles.summary}>
              {advisory?.summary || 'No advisory available.'}
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SafetyBriefModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  riskBar: {
    flexDirection: 'row',
    width: '100%',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  riskSegment: {
    flex: 1,
    height: '100%',
  },
  riskLevelLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  summary: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
