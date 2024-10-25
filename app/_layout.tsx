import { Colors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Slot, Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { Stack } from "expo-router";

// Token cache implementation for Clerk
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Layout component that wraps the tabs
function TabsLayout() {
  const theme = useColorScheme() ?? "light";

  return (
    <>
      <SignedIn>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[theme].tint,
            tabBarStyle: {
              backgroundColor: Colors[theme].background,
            },
          }}>
       <Slot /> 
      
        </Tabs>
      </SignedIn>
      
      <SignedOut>
        <Stack>
           <Slot />  
        </Stack>
      </SignedOut>
    </>
  );
}

// Root layout that provides Clerk context
export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <TabsLayout />
    </ClerkProvider>
  );
}
