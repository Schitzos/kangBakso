import React from 'react';
import {
  NavigationContainer,
} from '@react-navigation/native';
import { RootStackParamList } from './types';
import { createStackNavigator } from '@react-navigation/stack';
import route from './route';
import { useBoundStore } from '@/store/store';

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { user, profile } = useBoundStore((state) => state); // Subscribe to user state changes
  const handleInitialRouter = () => {
    if (user && profile) {
      return 'Home';
    }
    return 'Login';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
        initialRouteName={handleInitialRouter()}>
        <Stack.Screen
          name="Login"
          component={route.LoginScreen}
        />
        <Stack.Screen
          name="Home"
          component={route.HomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
