import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import { useSchedule } from '../context/ScheduleContext';

type AddScheduleModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AddScheduleModal({ visible, onClose }: AddScheduleModalProps) {
  const { addScheduleItem } = useSchedule();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [allDay, setAllDay] = useState(false);

  const handleAdd = () => {
    if (!title.trim()) return;

    const newItem = {
      id: uuid.v4() as string,
      title,
      location,
      notes,
      start: startDate,
      end: endDate,
      allDay,
    };

    addScheduleItem(newItem);
    onClose();
    resetFields();
  };

  const resetFields = () => {
    setTitle('');
    setLocation('');
    setNotes('');
    setStartDate(new Date());
    setEndDate(new Date());
    setAllDay(false);
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>New Schedule Item</Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Location"
          placeholderTextColor="#888"
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          style={styles.input}
          placeholder="Notes"
          placeholderTextColor="#888"
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity style={styles.checkbox} onPress={() => setAllDay(!allDay)}>
          <Ionicons
            name={allDay ? 'checkbox-outline' : 'square-outline'}
            size={22}
            color="#007AFF"
          />
          <Text style={styles.checkboxLabel}>All Day</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Start:</Text>
        <TouchableOpacity style={styles.pickerToggle} onPress={() => setShowStartPicker(!showStartPicker)}>
          <Text style={styles.pickerToggleText}>{startDate.toLocaleString()}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              if (date) setStartDate(date);
            }}
          />
        )}

        <Text style={styles.label}>End:</Text>
        <TouchableOpacity style={styles.pickerToggle} onPress={() => setShowEndPicker(!showEndPicker)}>
          <Text style={styles.pickerToggleText}>{endDate.toLocaleString()}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              if (date) setEndDate(date);
            }}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  input: {
    backgroundColor: '#f2f2f2',
    color: '#000',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  label: { color: '#333', marginTop: 12, marginBottom: 4 },
  checkbox: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkboxLabel: { color: '#000', marginLeft: 8 },
  pickerToggle: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  pickerToggleText: {
    color: '#000',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { marginTop: 16, alignItems: 'center' },
  cancelButtonText: { color: '#007AFF', fontSize: 16 },
});
