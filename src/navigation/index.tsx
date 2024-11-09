import React from 'react';
import {
  NavigationContainer,
} from '@react-navigation/native';
import {RootStackParamList} from './types';
import {createStackNavigator} from '@react-navigation/stack';
import route from './route';
import { useBoundStore } from '@/store/store';

const Stack = createStackNavigator<RootStackParamList>();

/**
 * The main navigation component for the app.
 *
 * It uses the React Navigation library to handle navigation between the login
 * screen and the home screen.
 *
 * The `initialRouteName` property is set to a function that will determine which
 * screen to show initially, based on whether the user is logged in or not.
 *
 * The `screenOptions` property is set to an object that disables the header and
 * gesture navigation for all screens.
 *
 * @returns A JSX element representing the navigation container.
 */
export default function Navigation() {
  const {user, role} = useBoundStore((state) => state); // Subscribe to user state changes

  /**
   * Determine which screen to show initially, based on whether the user is
   * logged in or not.
   *
   * If the user is logged in, show the Home screen. Otherwise, show the Login
   * screen.
   *
   * @returns The name of the screen to show initially.
   */
  const handleInitialRouter = () => {
    if (user && role) {
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
