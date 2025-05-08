import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1) Hospital type (✅ extended with missing fields)
export interface Hospital {
  id: string;
  name: string;
  rating?: number;
  reviews?: number;
  type?: string;
  timeAway?: string;
  latlng: { latitude: number; longitude: number };
  address?: string;
  phoneNumber?: string;
  hours?: string[];
  distanceText?: string;
  durationText?: string;
}

// 2) Contact type
export interface Contact {
  id: string;
  name: string;
  phone: string;
  role: string;
}

// 3) Document type
export type Document = string;

// 4) FacilityKey type
export type FacilityKey =
  | 'hospitals'
  | 'contacts'
  | 'government'
  | 'documents'
  | 'schedule'
  | 'transportation'
  | 'translate'
  | 'weather'
  | 'advisory'
  | 'visa';

// 5) TravelAdvisory type
export interface TravelAdvisory {
  riskLevel: number;
  summary: string;
  source?: string;
}

// 6) Destination type
export interface Destination {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

// 7) Context shape
export interface ItineraryContextType {
  selectedHospital: Hospital | null;
  setSelectedHospital: (h: Hospital | null) => void;

  selectedHospitals: Hospital[];
  setSelectedHospitals: React.Dispatch<React.SetStateAction<Hospital[]>>;

  confirmedHospitals: Hospital[];
  setConfirmedHospitals: React.Dispatch<React.SetStateAction<Hospital[]>>;

  destination: Destination | null;
  setDestination: React.Dispatch<React.SetStateAction<Destination | null>>;

  travelAdvisory: TravelAdvisory | null;
  setTravelAdvisory: React.Dispatch<React.SetStateAction<TravelAdvisory | null>>;

  selectedFacilityKeys: FacilityKey[];
  toggleFacilityKey: (key: FacilityKey) => void;

  importantContacts: Contact[];
  setImportantContacts: React.Dispatch<React.SetStateAction<Contact[]>>;

  selectedAgencies: string[];
  setSelectedAgencies: React.Dispatch<React.SetStateAction<string[]>>;

  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}

// 8) Create context
const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

// 9) Provider
export const ItineraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedHospital, _setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedHospitals, setSelectedHospitals] = useState<Hospital[]>([]);
  const [confirmedHospitals, setConfirmedHospitals] = useState<Hospital[]>([]);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [travelAdvisory, setTravelAdvisory] = useState<TravelAdvisory | null>(null);
  const [selectedFacilityKeys, setSelectedFacilityKeys] = useState<FacilityKey[]>([]);
  const [importantContacts, setImportantContacts] = useState<Contact[]>([]);
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  const setSelectedHospital = (h: Hospital | null) => {
    _setSelectedHospital(h);
  };

  const toggleFacilityKey = (key: FacilityKey) => {
    setSelectedFacilityKeys((prev) =>
      prev.includes(key) ? prev : [...prev, key]
    );
  };

  return (
    <ItineraryContext.Provider
      value={{
        selectedHospital,
        setSelectedHospital,
        selectedHospitals,
        setSelectedHospitals,
        confirmedHospitals,
        setConfirmedHospitals,
        destination,
        setDestination,
        travelAdvisory,
        setTravelAdvisory,
        selectedFacilityKeys,
        toggleFacilityKey,
        importantContacts,
        setImportantContacts,
        selectedAgencies,
        setSelectedAgencies,
        documents,
        setDocuments,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};

// 10) Hook for consumption
export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
}
