import { useOAuth } from "@clerk/clerk-expo";
import { useCallback } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";

// Only import WebBrowser for native platforms
if (Platform.OS !== 'web') {
  const WebBrowser = require('expo-web-browser');
  WebBrowser.maybeCompleteAuthSession();
}

export default function SignIn() {
  // Only use warmup on native platforms
  if (Platform.OS !== 'web') {
    useWarmUpBrowser();
  }

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onSignInWithGoogle = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error:", err);
    }
  }, [startOAuthFlow]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FontAwesome name="map-marker" size={64} color="#4A90E2" style={styles.icon} />
        <Text style={styles.title}>Welcome to UrbanReporter</Text>
        <Text style={styles.subtitle}>
          Sign in to report and track urban issues in your community
        </Text>
        <Link href={"/sign-up"}><Text>New to UrbanReporter? Sign up</Text></Link>
      </View>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={onSignInWithGoogle}
      >
        <FontAwesome name="google" size={24} color="#4285F4" style={styles.googleIcon} />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleIcon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});
