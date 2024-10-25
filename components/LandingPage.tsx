import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';
import { Camera, MapPin, Zap, Bell, Users, ThumbsUp } from 'lucide-react';
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const FeatureCard = ({ Icon, title, description }: { Icon: React.ElementType; title: string; description: string }) => (
  <View style={styles.featureCard}>
    <Icon width={48} height={48} stroke="#4A90E2" />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
  </View>
);

const LandingPage: React.FC = () => {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>UrbanReporter</Text>
          <View style={styles.nav}>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navButtonText}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navButtonText}>Features</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navButtonText}>Contact</Text>
            </TouchableOpacity>

            <SignedIn>
              <View style={styles.userSection}>
                <Text style={styles.welcomeText}>Welcome, {user?.firstName}</Text>
                <TouchableOpacity style={styles.navButtonOutline} onPress={handleSignOut}>
                  <Text style={styles.navButtonTextOutline}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </SignedIn>

            <SignedOut>
              <TouchableOpacity style={styles.navButtonOutline} onPress={handleSignIn}>
                <Text style={styles.navButtonTextOutline}>Sign In</Text>
              </TouchableOpacity>
            </SignedOut>
          </View>
        </View>

        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1920&q=80' }}
          style={styles.heroImage}
        >
          <View style={styles.overlay}>
            <Text style={styles.heroTitle}>Empower Your Community</Text>
            <Text style={styles.heroSubtitle}>
              Report and track urban issues in real-time. Together, let's build a better city for everyone.
            </Text>
            <SignedOut>
              <TouchableOpacity style={styles.ctaButton} onPress={handleSignIn}>
                <Text style={styles.ctaButtonText}>Get Started</Text>
              </TouchableOpacity>
            </SignedOut>
            <SignedIn>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => router.push("/Reports")}
              >
                <Text style={styles.ctaButtonText}>Go to Dashboard</Text>
              </TouchableOpacity>
            </SignedIn>
          </View>
        </ImageBackground>

        {/* Rest of your component remains the same */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.featureGrid}>
            <FeatureCard Icon={Camera} title="Capture" description="Snap a photo of the urban issue you've encountered." />
            <FeatureCard Icon={MapPin} title="Locate" description="Our app automatically tags the precise location." />
            <FeatureCard Icon={Zap} title="Report" description="Submit your report with just a tap. It's that simple!" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featureGrid}>
            <FeatureCard Icon={Bell} title="Real-time Updates" description="Stay informed with notifications on the status of your reports." />
            <FeatureCard Icon={Users} title="Community Driven" description="Connect with neighbors and see issues reported in your area." />
            <FeatureCard Icon={ThumbsUp} title="Impact Tracking" description="See the tangible impact of your reports on the community." />
          </View>
        </View>

        <View style={styles.sectionBlue}>
          <Text style={styles.sectionTitleWhite}>Ready to make a difference?</Text>
          <Text style={styles.sectionSubtitleWhite}>
            Join thousands of active citizens who are shaping their cities, one report at a time.
          </Text>
          <SignedOut>
            <TouchableOpacity style={styles.ctaButtonSecondary} onPress={handleSignIn}>
              <Text style={styles.ctaButtonText}>Join Now</Text>
            </TouchableOpacity>
          </SignedOut>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  navButtonText: {
    color: '#4A90E2',
    fontSize: 16,
  },
  navButtonOutline: {
    borderWidth: 1,
    borderColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  navButtonTextOutline: {
    color: '#4A90E2',
    fontSize: 16,
  },
  heroImage: {
    height: 300,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  heroTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  sectionBlue: {
    backgroundColor: '#4A90E2',
    padding: 20,
    alignItems: 'center',
  },
  sectionTitleWhite: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  sectionSubtitleWhite: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  ctaButtonSecondary: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#4A90E2',
  },
});


export default LandingPage;


