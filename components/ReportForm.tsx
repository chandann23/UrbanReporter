import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

interface ReportFormProps {
  onSubmit: (report: any) => void;
}

export function ReportForm({ onSubmit }: ReportFormProps) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address[0]) {
        const loc = `${address[0].street || ''} ${address[0].name || ''}, ${address[0].city || ''}`;
        setLocation(loc.trim());
      }
    } catch (error) {
      Alert.alert('Error getting location');
    }
  };

  const handleSubmit = () => {
    if (!type || !description || !location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    onSubmit({
      type,
      description,
      location,
      image,
      status: 'pending',
      date: new Date().toISOString(),
    });

    setType('');
    setDescription('');
    setLocation('');
    setImage(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Issue Type *</Text>
        <TextInput
          style={styles.input}
          value={type}
          onChangeText={setType}
          placeholder="e.g., Pothole, Streetlight, Waste"
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the issue..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Location *</Text>
        <View style={styles.locationContainer}>
          <TextInput
            style={[styles.input, styles.locationInput]}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter address"
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
          >
            <Ionicons name="location" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Ionicons name="camera" size={24} color="#3b82f6" />
          <Text style={styles.imageButtonText}>Add Photo</Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  locationContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  locationInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  locationButton: {
    backgroundColor: '#3b82f6',
    width: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 8,
    marginBottom: 16,
  },
  imageButtonText: {
    marginLeft: 8,
    color: '#3b82f6',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
