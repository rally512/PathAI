// context/ScheduleContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ScheduleItem } from '../types'; // ✅ Now pulling from your corrected types.ts

// Define the context type
type ScheduleContextType = {
  schedule: ScheduleItem[];
  addScheduleItem: (item: ScheduleItem) => void;
};

// Create the context
const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

// Provide the context to children
export const ScheduleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  const addScheduleItem = (item: ScheduleItem) => {
    setSchedule((prev) => [...prev, item]);
  };

  return (
    <ScheduleContext.Provider value={{ schedule, addScheduleItem }}>
      {children}
    </ScheduleContext.Provider>
  );
};

// Hook to access the schedule
export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};
