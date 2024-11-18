import React, { useEffect, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import Navigation from '@/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import { useAuth } from './hooks/auth/useAuth';
import useAppState from './hooks/appState/useAppState';
import ContextProvider from './context';
import Toast from 'react-native-toast-message';
import { useBackgroundJob } from './hooks/background/useBackgroundJob';
import { LogBox } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import TextView from './components/elements/TextView';
import BottomSheetModal from './components/elements/BottomSheet';

GoogleSignin.configure({
  webClientId: Config.WEB_CLIENT_ID,
});

function App(): React.JSX.Element {
  const { onAuthStateChanged } = useAuth();
  const { doBackgroundTask } = useBackgroundJob();
  const [isOnline, setIsOnline] = useState(true);

  useAppState(() => {
    doBackgroundTask({ isBackgroundJob: true });
  });

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  useEffect(() => {
    // Fetch connection status first time when app loads as listener is added afterwards
    NetInfo.fetch().then(state => {
      if (isOnline !== state.isConnected) {
        setIsOnline(!!state.isConnected && !!state.isInternetReachable);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  NetInfo.addEventListener(state => {
    console.log('state.isConnected', state.isConnected);
    if (isOnline !== state.isConnected) {
      setIsOnline(!!state.isConnected && !!state.isInternetReachable);
    }
  });

  LogBox.ignoreAllLogs();

  return (
    <GestureHandlerRootView>
      <ContextProvider>
        <TextView>{isOnline ? 'App is online' : 'App is offline'}</TextView>
        <Navigation />
        <Toast />
        {!isOnline && <BottomSheetModal onClose={() => {}} snapPoints={[ '40%', '40%']} enablePanDownToClose={false} pressBehavior="none">
          <TextView>{isOnline ? 'App is online' : 'App is offline'}</TextView>
        </BottomSheetModal>}
      </ContextProvider>
    </GestureHandlerRootView>
  );
}

export default App;
