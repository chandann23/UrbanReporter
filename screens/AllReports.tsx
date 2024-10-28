import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Report {
  id: string;
  type: string;
  description: string;
  location: string;
  status: 'pending' | 'inProgress' | 'resolved';
  date: string;
  image?: string;
}

export function ReportList() {
  const [reports] = React.useState<Report[]>([
    {
      id: '1',
      type: 'Pothole',
      description: 'Large pothole on Main Street',
      location: '123 Main St',
      status: 'pending',
      date: new Date().toISOString(),
      image: 'https://via.placeholder.com/300'
    },
    {
      id: '2',
      type: 'Graffiti',
      description: 'Graffiti on public park wall',
      location: '456 Elm St',
      status: 'inProgress',
      date: new Date().toISOString(),
      image: 'https://via.placeholder.com/300'
    },
    {
      id: '3',
      type: 'Broken Streetlight',
      description: 'Streetlight not working on Oak Avenue',
      location: '789 Oak Ave',
      status: 'resolved',
      date: new Date().toISOString(),
      image: 'https://via.placeholder.com/300'
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#eab308';
      case 'inProgress': return '#2563eb';
      case 'resolved': return '#16a34a';
      default: return '#71717a';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'inProgress': return 'construct-outline';
      case 'resolved': return 'checkmark-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const renderItem = ({ item }: { item: Report }) => (
    <View style={styles.card}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.type}</Text>
          <View style={styles.statusContainer}>
            <Ionicons 
              name={getStatusIcon(item.status)} 
              size={16} 
              color={getStatusColor(item.status)} 
              style={styles.statusIcon}
            />
            <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.footer}>
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text style={styles.location}>{item.location}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={reports}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
});

