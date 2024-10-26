import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ReportList } from '../components/ReportList';
import { NavigationProp } from '@react-navigation/native';

interface ReportsScreenProps {
  navigation: NavigationProp<any>;
}
export default function Reports() {
  return (
    <View style={styles.container}>
      <ReportList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
});
