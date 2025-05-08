// FinalTravelScheduleScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  SectionList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSchedule } from '../context/ScheduleContext';
import AddScheduleModal from './AddScheduleModal';
import { ScheduleItem } from '../types';
import { format } from 'date-fns';

export default function FinalTravelScheduleScreen() {
  const { schedule } = useSchedule();
  const [modalVisible, setModalVisible] = useState(false);

  const fallback: ScheduleItem[] = [
    {
      id: '1',
      title: 'Airport Pickup',
      location: 'Austin Airport',
      notes: '',
      allDay: false,
      start: new Date('2025-04-26T10:00:00'),
      end: new Date('2025-04-26T11:00:00'),
    },
    {
      id: '2',
      title: 'Dinner Reservation',
      location: "Jeffrey's Steakhouse",
      notes: '',
      allDay: false,
      start: new Date('2025-04-26T19:00:00'),
      end: new Date('2025-04-26T21:00:00'),
    },
    {
      id: '3',
      title: 'Day Trip to Wimberley',
      location: 'Wimberley, TX',
      notes: '',
      allDay: true,
      start: new Date('2025-04-27T08:00:00'),
      end: new Date('2025-04-27T18:00:00'),
    },
  ];

  const usableEvents = schedule.length > 0 ? schedule : fallback;

  const grouped = usableEvents.reduce<Record<string, ScheduleItem[]>>((acc, item) => {
    const dateKey = format(new Date(item.start), 'EEE MMM dd yyyy');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  const sections = Object.keys(grouped).map((key) => ({
    title: key,
    data: grouped[key],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Travel Schedule</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.addButton}>＋</Text>
        </TouchableOpacity>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemTime}>
              {item.allDay
                ? 'All Day'
                : `${format(new Date(item.start), 'h:mm a')} - ${format(
                    new Date(item.end),
                    'h:mm a'
                  )}`}
            </Text>
            {item.location ? (
              <Text style={styles.itemLocation}>{item.location}</Text>
            ) : null}
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
      />

      <AddScheduleModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerRow: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  addButton: {
    fontSize: 28,
    color: '#007AFF',
    marginRight: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 10,
    backgroundColor: '#EFEFEF',
    paddingVertical: 6,
    borderRadius: 6,
    color: '#333',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemLocation: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});
