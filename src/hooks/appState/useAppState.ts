// hooks/useAppState.ts
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

type AppStateChangeHandler = (nextAppState: AppStateStatus) => void;

const useAppState = (onBackground: AppStateChangeHandler) => {

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('AppState changed to:', nextAppState); // Debugging line to check app state

      if (nextAppState === 'background') {
        console.log('App has gone to the background.');
        onBackground(nextAppState); // This should trigger your background task
      } else if (nextAppState === 'active') {
        console.log('App has come to the foreground!');
      }
    };

    // Subscribe to app state changes
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup on component unmount
    return () => {
      appStateListener.remove(); // Clean up listener on unmount
    };
  }, [onBackground]); // Ensure onBackground is updated properly

};

export default useAppState;
