import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import BackgroundJob from 'react-native-background-actions';

type AppStateChangeHandler = (nextAppState: AppStateStatus) => void;

const useAppState = (onBackground: AppStateChangeHandler) => {
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      console.log('AppState changed to:', nextAppState); // Debugging line to check app state

      if (nextAppState === 'background') {
        console.log('App has gone to the background.');
        onBackground(nextAppState); // This should trigger your background task
      } else if (nextAppState === 'active') {
        console.log('App has come to the foreground!');
        try {
          await BackgroundJob.stop(); // Stop the background job when app is active
          console.log('Background job stopped');
        } catch (error) {
          console.log('Error stopping background job:', error);
        }
      }
    };

    // Subscribe to app state changes
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup on component unmount
    return () => {
      appStateListener.remove(); // Clean up listener on unmount
    };
  }, [onBackground]);

};

export default useAppState;
