import React, { useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import Navigation from '@/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import { useAuth } from './hooks/auth/useAuth';
import useAppState from './hooks/appState/useAppState';
import ContextProvider from './context';
import Toast from 'react-native-toast-message';

GoogleSignin.configure({
  webClientId: Config.WEB_CLIENT_ID,
});

function App(): React.JSX.Element {
  const { onAuthStateChanged, setUserOffline } = useAuth();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  useAppState(() => {
    setUserOffline({ isBackgroundJob: true });
  });

  return (
    <GestureHandlerRootView>
      <ContextProvider>
        <Navigation />
        <Toast />
      </ContextProvider>
    </GestureHandlerRootView>
  );
}

export default App;
