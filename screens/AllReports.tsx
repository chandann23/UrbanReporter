import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BACKEND_URL } from '@env';

interface Report {
  id: number;
  created_at: string;
  title: string;
  description: string;
  location: string;
  category: string;
  image_url: string | null;
  status: 'pending' | 'in_progress' | 'resolved';
}

export function ReportList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  ;
  const fetchReports = async () => {
    try {
      setLoading(true);
      // Make sure this matches your backend URL
      const response = await fetch('http://localhost:3000/api/reports');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Error', 'Failed to fetch reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#eab308';
      case 'in_progress': return '#2563eb';
      case 'resolved': return '#16a34a';
      default: return '#71717a';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'in_progress': return 'construct-outline';
      case 'resolved': return 'checkmark-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const renderItem = ({ item }: { item: Report }) => (
    <View style={styles.card}>
      {item.image_url && (
        <Image
          source={{ uri: item.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.statusContainer}>
            <Ionicons
              name={getStatusIcon(item.status)}
              size={16}
              color={getStatusColor(item.status)}
              style={styles.statusIcon}
            />
            <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
              {item.status.replace('_', ' ')}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.footer}>
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={reports}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.container}
      onRefresh={fetchReports}
      refreshing={loading}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontWeight: '600',
    color: '#1f2937',
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
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  category: {
    fontSize: 12,
    color: '#9ca3af',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
