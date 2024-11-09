import theme from '@/styles/theme';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import TextView from '../TextView';

const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <TextView>Loading ...</TextView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: for a slight overlay effect
  },
});

export default Loading;
