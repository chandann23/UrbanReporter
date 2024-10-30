import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Image,
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import { RootStackParamList } from '../app/index';
import * as Location from 'expo-location';

type Props = NativeStackScreenProps<RootStackParamList, 'Report'>;

type IssueType = {
  icon: string;
  title: string;
  description: string;
};
interface ReportData {
  title: string;
  description: string;
  location: string;
  category: string;
  image_url?: string | null;
}

const API_URL = 'http://192.168.1.100:5000/api'; // Replace with your actual IP or server address

export default function ReportScreen({ route, navigation }: Props) {
  const [selectedIssue, setSelectedIssue] = useState<IssueType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [formStep, setFormStep] = useState<'select' | 'details'>('select');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const issueTypes: IssueType[] = [
    { icon: '🕳️', title: 'Pothole', description: 'Report road damage' },
    { icon: '💡', title: 'Street Light', description: 'Report broken lights' },
    { icon: '🗑️', title: 'Waste Bin', description: 'Report overflow or damage' },
    { icon: '🚰', title: 'Water Issue', description: 'Report leaks or quality' },
    { icon: '🚸', title: 'Safety Hazard', description: 'Report dangerous conditions' },
    { icon: '', title: 'Others', description: 'Report other issues' },
  ];

  const handleIssueSelect = (issue: IssueType) => {
    setSelectedIssue(issue);
    setFormStep('details');
  };

  const handleSubmit = async (): Promise<void> => {
    if (!selectedIssue || !title || !description || !location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      let imageUrl: string | null = null;
      if (imageUri) {
        imageUrl = await uploadImage(imageUri);
      }

      const reportData: ReportData = {
        title,
        description,
        location,
        category: selectedIssue.title,
        image_url: imageUrl,
      };

      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        const createdReport = await response.json();
        console.log('Report created:', createdReport);
        Alert.alert('Success', 'Report submitted successfully');
        navigation.navigate('AllReports');
      } else {
        const errorData = await response.json();
        console.error('Error creating report:', errorData);
        Alert.alert('Error', errorData.error || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error creating report:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };


  const uploadImage = async (uri: string): Promise<string> => {
    const formData = new FormData();
    formData.append('image', {
      uri: uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);  // 'as any' is used here because the exact type is not standard

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const getLocation = async () => {
    // Request permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    // Get the current location
    let location = await Location.getCurrentPositionAsync({});
    setLocation(`${location.coords.latitude}, ${location.coords.longitude}`);
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access media library is needed.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleImageCapture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access camera is needed.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const renderIssueSelection = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.welcomeText}>{route.params.message}</Text>
      <Text style={styles.subtitle}>Select an issue type to report:</Text>

      {issueTypes.map((issue, index) => (
        <Pressable
          key={index}
          style={({ pressed }) => [
            styles.issueButton,
            pressed && styles.issueButtonPressed
          ]}
          onPress={() => handleIssueSelect(issue)}
        >
          <Text style={styles.issueIcon}>{issue.icon}</Text>
          <View style={styles.issueTextContainer}>
            <Text style={styles.issueTitle}>{issue.title}</Text>
            <Text style={styles.issueDescription}>{issue.description}</Text>
          </View>
        </Pressable>
      ))}
      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          pressed && styles.buttonPressed
        ]}
        onPress={() => navigation.navigate('AllReports')}
      >
        <Text style={styles.submitButtonText}>View all reports</Text>
      </Pressable>

    </ScrollView>
  );

  const renderDetailsForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.formContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.selectedIssueContainer}>
          <Text style={styles.issueIcon}>{selectedIssue?.icon}</Text>
          <Text style={styles.selectedIssueTitle}>{selectedIssue?.title}</Text>
          <Pressable
            onPress={() => setFormStep('select')}
            style={styles.changeButton}
          >
            <Text style={styles.changeButtonText}>Change</Text>
          </Pressable>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Brief title for the issue"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Provide detailed description of the issue"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter location or use current location"
            placeholderTextColor="#9ca3af"
          />
          <Pressable
            style={({ pressed }) => [
              styles.locationButton,
              pressed && styles.buttonPressed
            ]}
            onPress={getLocation}
          >
            <Text style={styles.locationButtonText}>Use Current Location</Text>
          </Pressable>
        </View>

        {/* Error Message if permission denied */}
        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Attach Image</Text>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          )}
          <View style={styles.imageButtons}>
            <Pressable onPress={handleImagePick} style={styles.imageButton}>
              <Text style={styles.imageButtonText}>Upload Image</Text>
            </Pressable>
            <Pressable onPress={handleImageCapture} style={styles.imageButton}>
              <Text style={styles.imageButtonText}>Take Photo</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {formStep === 'select' ? renderIssueSelection() : renderDetailsForm()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  issueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  issueButtonPressed: {
    opacity: 0.8,
  },
  issueIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  issueTextContainer: {
    flex: 1,
  },
  issueTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  issueDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  formContainer: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  imageButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  imageButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedIssueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  selectedIssueTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
  },
  changeButtonText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
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
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  locationButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  locationButtonText: { color: '#ffffff', fontSize: 16 },
  errorText: { color: 'red', marginTop: 10 },
});
