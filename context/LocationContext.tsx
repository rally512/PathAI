import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the Destination type locally
interface Destination {
  name: string;
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  destination: Destination;
  setDestination: (d: Destination) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [destination, setDestination] = useState<Destination>({
    name: '',
    latitude: 0,
    longitude: 0,
  });

  return (
    <LocationContext.Provider value={{ destination, setDestination }}>
      {children}
    </LocationContext.Provider>
  );
};

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error('useLocation must be used within a <LocationProvider>');
  }
  return ctx;
}

