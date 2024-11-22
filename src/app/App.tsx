import React, { useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import { LogBox } from 'react-native';
import Navigation from './navigation';
import ContextProvider from './utils/context';
import Offline from './components/elements/Offline';
import { useAuth } from './hooks/auth/useAuth';
import { useBackgroundJob } from './hooks/background/useBackgroundJob';
import useAppState from './hooks/appState/useAppState';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: Config.WEB_CLIENT_ID,
});

function App(): React.JSX.Element {
  const { onAuthStateChanged } = useAuth();
  const { doBackgroundTask } = useBackgroundJob();

  // Handle app state changes
  useAppState(() => {
    doBackgroundTask({ isBackgroundJob: true });
  });

  // Monitor authentication state
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on component unmount
  }, [onAuthStateChanged]);

  LogBox.ignoreAllLogs();

  return (
    <GestureHandlerRootView>
      <ContextProvider>
        <Navigation />
        <Toast />
        <Offline/>
      </ContextProvider>
    </GestureHandlerRootView>
  );
}

export default App;
