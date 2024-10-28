import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { RootStackParamList } from '../app/index';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: HomeScreenProps) {

 const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };



  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1000' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/NativeScript/code-samples/main/demo-react/app/assets/ns.png' }}
            style={styles.logo}
          />
<SignedOut>
            <Pressable
              style={styles.signInButton}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </Pressable>
          </SignedOut>
          <SignedIn>
            <Pressable
              style={styles.registerButton}
              onPress={handleSignOut}
            >
              <Text style={styles.registerText}>Sign Out</Text>
            </Pressable>
          </SignedIn>
               </View>

        <View style={styles.content}>
          <View style={styles.heroSection}>
            <Text style={styles.title}>UrbanFix</Text>
            <Text style={styles.subtitle}>
              Make your city better, one report at a time
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚧</Text>
              <View>
                <Text style={styles.featureTitle}>Report Issues</Text>
                <Text style={styles.featureDescription}>
                  Quickly report urban problems
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📍</Text>
              <View>
                <Text style={styles.featureTitle}>Location Tracking</Text>
                <Text style={styles.featureDescription}>
                  Precise GPS location
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📸</Text>
              <View>
                <Text style={styles.featureTitle}>Photo Evidence</Text>
                <Text style={styles.featureDescription}>
                  Add photos to reports
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionSection}>
            <Pressable
              style={({ pressed }) => [
                styles.getStartedButton,
                pressed && styles.buttonPressed
              ]}
              onPress={() => navigation.navigate('Report', { message: 'Welcome to UrbanFix!' })}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </Pressable>
            
            <Pressable
              style={({ pressed }) => [
                styles.registerButton,
                pressed && styles.buttonPressed
              ]}
              onPress={() => {/* Handle registration */}}
            >
              <Text style={styles.registerText}>Create Account</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    width: 40,
    height: 40,
    tintColor: '#ffffff',
  },
  signInButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  signInText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
  featuresContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginVertical: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 40,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionSection: {
    gap: 12,
  },
  getStartedButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  registerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.9,
  },
});
