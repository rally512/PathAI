// App.tsx
import 'react-native-get-random-values'; // <-- This must come before any uuid usage
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from './navigation/routes';

import TravelLocationScreen from './Screens/TravelLocationScreen';
import TripOverviewScreen from './Screens/TripOverviewScreen';
import MainTileSelectionScreen from './Screens/MainTileSelectionScreen';
import HospitalMapScreen from './Screens/HospitalMapScreen';
import GovernmentFacilitiesScreen from './Screens/GovernmentFacilitiesScreen';
import TravelScheduleScreen from './Screens/TravelScheduleScreen';
import ImportantContactScreen from './Screens/ImportantContactScreen';
import TranslatorScreen from './Screens/TranslatorScreen';
import WeatherScreen from './Screens/WeatherScreen';
import TravelAdvisoryScreen from './Screens/TravelAdvisoryScreen';
import VisaRequirementsScreen from './Screens/VisaRequirementsScreen';
import FinalItineraryScreen from './Screens/FinalItineraryScreen';
import FinalTravelScheduleScreen from './Screens/FinalTravelScheduleScreen';
import FinalHospitalScreen from './Screens/FinalHospitalScreen'; // adjust path if needed


// ✅ Updated to match your actual folder: `context` (not contexts)
import { ItineraryProvider } from './context/ItineraryContext';
import { LocationProvider } from './context/LocationContext';
import { ScheduleProvider } from './context/ScheduleContext';

// ✅ You have both `types/` folder and `types.ts`, but this is most likely correct
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScheduleProvider>
        <LocationProvider>
          <ItineraryProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName={Routes.TravelLocation}
                screenOptions={{ headerShown: true }}
              >
                <Stack.Screen
                  name={Routes.TravelLocation}
                  component={TravelLocationScreen}
                  options={{ title: 'Where are you going?' }}
                />
                <Stack.Screen
                  name={Routes.FinalItinerary}
                  component={FinalItineraryScreen}
                  options={{ title: 'Final Itinerary' }}
                />
                <Stack.Screen
                  name={Routes.FinalTravelSchedule}
                  component={FinalTravelScheduleScreen}
                  options={{ title: 'Travel Schedule' }}
                />
                <Stack.Screen
                  name={Routes.TripOverview}
                  component={TripOverviewScreen}
                  options={{ title: 'Trip Overview' }}
                />
                <Stack.Screen
                  name={Routes.MainTileSelection}
                  component={MainTileSelectionScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name={Routes.HospitalMapScreen}
                  component={HospitalMapScreen}
                  options={{ title: 'Nearby Hospitals' }}
                />
                <Stack.Screen
                  name={Routes.GovernmentFacilities}
                  component={GovernmentFacilitiesScreen}
                  options={{ title: 'Government Facilities' }}
                />
                <Stack.Screen
                  name={Routes.TravelScheduleScreen}
                  component={TravelScheduleScreen}
                  options={{ title: 'Travel Schedule (Setup)' }}
                />
                <Stack.Screen
                  name={Routes.ImportantContactScreen}
                  component={ImportantContactScreen}
                  options={{ title: 'Important Contacts' }}
                />
                <Stack.Screen
                  name={Routes.TranslatorScreen}
                  component={TranslatorScreen}
                  options={{ title: 'Translator' }}
                />
                <Stack.Screen
                  name={Routes.WeatherScreen}
                  component={WeatherScreen}
                  options={{ title: 'Weather Forecast' }}
                />
                <Stack.Screen
                  name={Routes.TravelAdvisory}
                  component={TravelAdvisoryScreen}
                  options={{ title: 'Travel Advisory' }}
                />
                <Stack.Screen
                  name={Routes.VisaRequirements}
                  component={VisaRequirementsScreen}
                  options={{ title: 'Visa Requirements' }}
                />
                <Stack.Screen
                  name="FinalHospital"
                  component={FinalHospitalScreen}
                  options={{ headerShown: true, title: 'Nearby Hospitals' }} // optional styling
                />

              </Stack.Navigator>
            </NavigationContainer>
          </ItineraryProvider>
        </LocationProvider>
      </ScheduleProvider>
    </GestureHandlerRootView>
  );
}
