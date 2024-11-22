import React from 'react';
import { SafeAreaView, Text, View, StyleSheet, Button } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/types';

export default function OfflinnScreen(){
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Offline'>>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.offlineContent}>
        <Text style={styles.offlineText}>
            You must be connected to the internet to use this app.
        </Text>
        <Button title="Retry" onPress={() => NetInfo.fetch().then(state => state.isConnected && navigation.goBack())} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  offlineContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8d7da',
    borderRadius: 8,
  },
  offlineText: {
    fontSize: 18,
    color: '#721c24',
    marginBottom: 20,
  },
});
