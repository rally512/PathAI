// ImportantContactScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes } from '../navigation/routes';
import type { RootStackParamList } from '../types';
import { useItinerary } from '../context/ItineraryContext';

interface Contact {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export default function ImportantContactScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { importantContacts, setImportantContacts, toggleFacilityKey } = useItinerary();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');

  const handleAddContact = () => {
    if (!name || !phone || !role) return;
    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      phone,
      role,
    };
    setImportantContacts((prev) => [...prev, newContact]);
    setName('');
    setPhone('');
    setRole('');
    Keyboard.dismiss();
  };

  const openContactsPicker = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') return;

    const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
    const contacts: Contact[] = data
      .filter((c) => c.name && c.phoneNumbers?.length)
      .map((c) => ({
        id: c.id ?? Date.now().toString(),
        name: c.name,
        phone: c.phoneNumbers![0].number ?? '',
        role: '',
      }));

    setAllContacts(contacts);
    setModalVisible(true);
  };

  const handleSelectContact = (contact: Contact) => {
    setName(contact.name);
    setPhone(contact.phone);
    setModalVisible(false);
  };

  const handleDone = () => {
    toggleFacilityKey('contacts');
    navigation.goBack();
  };

  const filteredContacts = allContacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerWrapper}>
          <Text style={styles.headerTitle}>Essential Contacts</Text>
          <Text style={styles.subtitle}>
            Input crucial contact details to have all key contacts easily accessible in one place.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contact Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Who Are They? (e.g. driver, concierge)"
            value={role}
            onChangeText={setRole}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
            <Text style={styles.addButtonText}>Add Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.greenButton} onPress={openContactsPicker}>
            <Text style={styles.greenButtonText}>Add From Contacts</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={importantContacts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.contactCard} onPress={() => handleSelectContact(item)}>
              <View>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactInfo}>{item.phone}</Text>
                <Text style={styles.contactInfo}>{item.role}</Text>
              </View>
              <Ionicons name="create-outline" size={20} color="#1E90FF" style={styles.editIcon} />
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide">
          <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={styles.modalHeader}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                value={search}
                onChangeText={setSearch}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectContact(item)}>
                  <Text style={styles.modalItemText}>{item.name} ({item.phone})</Text>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  headerBar: { backgroundColor: '#1E90FF', height: 40, justifyContent: 'center', paddingLeft: 16 },
  headerWrapper: { padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#222' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  formContainer: { paddingHorizontal: 16, paddingTop: 12 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12, borderColor: '#ddd', borderWidth: 1 },
  addButton: { backgroundColor: '#1E90FF', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  greenButton: { backgroundColor: '#8ec984', padding: 14, borderRadius: 10, alignItems: 'center' },
  greenButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  contactCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  contactName: { fontSize: 16, fontWeight: '600' },
  contactInfo: { fontSize: 14, color: '#666', marginTop: 4 },
  editIcon: { marginLeft: 8 },
  doneButton: { backgroundColor: '#000', paddingVertical: 14, borderRadius: 30, marginHorizontal: 32, marginBottom: 24, alignItems: 'center' },
  doneButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: '#ccc', backgroundColor: '#fff' },
  searchInput: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 10, padding: 10, marginRight: 10, fontSize: 16 },
  modalItem: { padding: 16, borderBottomColor: '#eee', borderBottomWidth: 1 },
  modalItemText: { fontSize: 16 },
});
