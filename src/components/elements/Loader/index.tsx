import theme from '@/styles/theme';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import TextView from '../TextView';

/**
 * A functional component that renders a loading indicator.
 * It consists of an activity indicator with a specified size
 * and color, and a text message indicating a loading state.
 *
 * @returns {JSX.Element} The rendered component with a loading indicator and text.
 */
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
    backgroundColor: 'transparent',
    padding: 16,
    minHeight: 72,
    gap: 8,
  },
});

export default Loading;
