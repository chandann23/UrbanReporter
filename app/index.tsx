import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import { ReportList } from '../screens/AllReports';
import SignIn from '../screens/sign-in';
import Constants from 'expo-constants';

export type RootStackParamList = {
  Home: undefined;
  SignIn: undefined;
  Report: { message: string };
  AllReports: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const frontendApi = Constants.manifest?.extra?.clerkPublishableKey;

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >

      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Report"
          component={ReportScreen}
          options={{
            title: 'Report Issue',
          }}
        />
        <Stack.Screen
          name="AllReports"
          component={ReportList}
          options={{
            title: 'All Reports',
          }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </ClerkProvider>
  );
}

