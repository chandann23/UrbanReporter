import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ReportForm } from '../components/ReportForm';
import { NavigationProp } from '@react-navigation/native';

interface NewReportScreenProps {
  navigation: NavigationProp<any>;
}

export default function NewReportScreen({ navigation }: NewReportScreenProps) {
  const handleSubmit = (report: any) => {
    // Here you would typically send the report to your backend 
    console.log('New report:', report);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ReportForm onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
});
