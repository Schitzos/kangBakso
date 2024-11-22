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
import { useBackgroundJob } from './hooks/background/useBackgroundJob';
import useAppState from './hooks/appState/useAppState';
import AuthCase from '@/core/domains/auth/useCases/AuthCase';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: Config.WEB_CLIENT_ID,
});

function App(): React.JSX.Element {
  const { doBackgroundTask } = useBackgroundJob();
  const authUseCase = AuthCase();

  // Handle app state changes
  useAppState(() => {
    doBackgroundTask({ isBackgroundJob: true });
  });

  // Monitor authentication state
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(authUseCase.onAuthStateChangedHandler);
    return subscriber;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
