import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, FlatList, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes } from '../navigation/routes';
import { RootStackParamList } from '../types';
import GovernmentFacilityModal from '../components/GovernmentFacilityModal';
import FinalWeatherTile from '../components/FinalWeatherTile';

export default function FinalItineraryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [governmentExpanded, setGovernmentExpanded] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<{ name: string; location: string; phone?: string; website?: string; directionsLink: string } | null>(null);
  const [facilityModalVisible, setFacilityModalVisible] = useState(false);

  const governmentFacilities = [
    { id: '1', name: 'U.S. Embassy', location: 'Mexico City', phone: '+525555080200', website: 'https://mx.usembassy.gov/', directionsLink: 'https://maps.apple.com/?q=U.S.+Embassy+Mexico+City' },
    { id: '2', name: 'U.S. Consulate', location: 'Tijuana', phone: '+526646777000', website: 'https://mx.usembassy.gov/embassy-consulates/tijuana/', directionsLink: 'https://maps.apple.com/?q=U.S.+Consulate+Tijuana' },
    { id: '3', name: 'U.S. Consulate', location: 'Guadalajara', phone: '+523336268100', website: 'https://mx.usembassy.gov/embassy-consulates/guadalajara/', directionsLink: 'https://maps.apple.com/?q=U.S.+Consulate+Guadalajara' },
    { id: '4', name: 'U.S. Consulate', location: 'Monterrey', phone: '+528183456000', website: 'https://mx.usembassy.gov/embassy-consulates/monterrey/', directionsLink: 'https://maps.apple.com/?q=U.S.+Consulate+Monterrey' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Final Itinerary</Text>
      <Image source={require('../assets/images/FinalItinerary.jpg')} style={styles.mapImage} resizeMode="cover" />
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.locationText}>Cabo San Lucas, Mexico</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.flexTile}><FinalWeatherTile /></View>

        <View style={styles.tile}>
          <Text style={styles.tileTitle}>Visa Requirements</Text>
          <Ionicons name="document-text-outline" size={50} color="#00BFFF" style={{ marginVertical: 8 }} />
          <Text style={styles.tileSubtitle}>No Visa Needed</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://travel.state.gov')}>
            <Text style={styles.tileLink}>Full Requirements Here</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.advisoryTile}>
        <Text style={styles.advisoryTitle}>Travel Advisory</Text>
        <View style={styles.advisoryBar}>
          <View style={[styles.barSection, { backgroundColor: '#4CAF50', flex: 1 }]} />
          <View style={[styles.barSection, { backgroundColor: '#FFEB3B', flex: 1 }]} />
          <View style={[styles.barSection, { backgroundColor: '#FF9800', flex: 1 }]} />
          <View style={[styles.barSection, { backgroundColor: '#B0BEC5', flex: 2 }]} />
        </View>
        <Text style={styles.advisoryLevel}>Level 3: Reconsider Travel</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://travel.state.gov')}>
          <Text style={styles.advisoryLink}>Get the full U.S. State Department report here.</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={[styles.tile, { backgroundColor: '#fad11b' }]} onPress={() => navigation.navigate(Routes.FinalTravelSchedule)}>
          <Text style={styles.tileTitle}>Travel Schedule</Text>
          <Ionicons name="calendar-outline" size={32} color="#BB86FC" style={{ marginVertical: 8 }} />
          <Text style={styles.tileSubtitle}>Tap to view itinerary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tile, { backgroundColor: '#32ad70' }]} onPress={() => console.log('Pressed Important Contacts')}>
          <Text style={styles.tileTitle}>Important Contacts</Text>
          <Ionicons name="call-outline" size={32} color="#4DB6AC" style={{ marginVertical: 8 }} />
          <Text style={styles.tileSubtitle}>Emergency contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tile, { backgroundColor: '#f58905' }]} onPress={() => navigation.navigate(Routes.FinalHospital)}>
          <Text style={styles.tileTitle}>Nearby Hospitals</Text>
          <Ionicons name="medkit-outline" size={32} color="#FF6F61" style={{ marginVertical: 8 }} />
          <Text style={styles.tileSubtitle}>Tap to view emergency rooms</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.sectionHeader} onPress={() => setGovernmentExpanded(!governmentExpanded)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="business-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Government Facilities</Text>
        </View>
        <Ionicons name={governmentExpanded ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#fff" />
      </TouchableOpacity>

      {governmentExpanded && (
        <FlatList scrollEnabled={false} data={governmentFacilities} keyExtractor={(item) => item.id} renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => {
            setSelectedFacility(item);
            setFacilityModalVisible(true);
          }}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#00BFFF" style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.listItemTitle}>{item.name}</Text>
              <Text style={styles.listItemSubtitle}>{item.location}</Text>
            </View>
          </TouchableOpacity>
        )} />
      )}

      <GovernmentFacilityModal visible={facilityModalVisible} onClose={() => setFacilityModalVisible(false)} facility={selectedFacility} />
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 40, paddingHorizontal: 16 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  mapImage: { width: '100%', height: 180, borderRadius: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationText: { color: '#ccc', fontSize: 14 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 24, gap: 16 },
  flexTile: { flex: 1 },
  tile: { flexBasis: '30%', backgroundColor: '#1e1e1e', padding: 16, borderRadius: 12, alignItems: 'center' },
  tileTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  tileSubtitle: { color: '#ccc', fontSize: 13, textAlign: 'center' },
  tileLink: { color: '#4EA1F3', fontSize: 12, marginTop: 4, textDecorationLine: 'underline', textAlign: 'center' },
  advisoryTile: { marginTop: 24, backgroundColor: '#1e1e1e', padding: 16, borderRadius: 12 },
  advisoryTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 12 },
  advisoryBar: { flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
  barSection: { height: '100%' },
  advisoryLevel: { color: '#ccc', fontSize: 13, marginBottom: 8 },
  advisoryLink: { color: '#4EA1F3', fontSize: 12, textDecorationLine: 'underline' },
  sectionHeader: { marginTop: 30, flexDirection: 'row', backgroundColor: '#1e1e1e', padding: 16, borderRadius: 12, justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  listItem: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  listItemTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  listItemSubtitle: { color: '#aaa', fontSize: 12 },
});
