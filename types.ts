// types.ts

// 📚 Defines the parameters each screen expects
export type RootStackParamList = {
  TravelLocation: undefined;
  TripOverview: {
    destination: { name: string; latitude: number; longitude: number };
  };
  MainTileSelection: undefined;
  HospitalMapScreen: undefined;
  GovernmentFacilities: {
    keyword: string;
    destLat: number;
    destLng: number;
  };
  TravelScheduleScreen: undefined;
  ImportantContactScreen: undefined;
  TranslatorScreen: undefined;
  WeatherScreen: undefined;
  TravelAdvisory: undefined;
  VisaRequirements: undefined;
  FinalItinerary: undefined;
  FinalTravelSchedule: undefined;
  FinalHospital: undefined;
};

// 📚 Defines what a single schedule item looks like
export type ScheduleItem = {
  id: string;         // ✅ Added properly
  title: string;
  location?: string;
  notes?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
};
