import React, { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import Navigation from '@/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import { useAuth } from './hooks/auth/useAuth';
import useAppState from './hooks/appState/useAppState';

GoogleSignin.configure({
  webClientId: Config.WEB_CLIENT_ID,
});

function App(): React.JSX.Element {
  const { onAuthStateChanged, setUserOffline } = useAuth();
  const [, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  useAppState((nextAppState) => {
    setUserOffline();
    setAppState(nextAppState);
  });

  return (
    <GestureHandlerRootView>
      <Navigation />
    </GestureHandlerRootView>
  );
}

export default App;
