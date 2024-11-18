import { useCallback, useEffect, useRef } from 'react';
import BackgroundJob from 'react-native-background-actions';
import { AppState, AppStateStatus } from 'react-native';
import Config from 'react-native-config';
import authService from '@/services/auth/auth.service';
import { useBoundStore } from '@/store/store';

export function useBackgroundJob() {
  let timerId = useRef<NodeJS.Timeout | null>(null);
  const { setProfile, user } = useBoundStore.getState();

  const doBackgroundTask = useCallback(//make function background service
    async ({ isBackgroundJob = false }: { isBackgroundJob?: boolean }) => {
      const options = {
        taskName: 'BackgroundSync',
        taskTitle: 'Syncing Data',
        taskDesc: 'Syncing your app data in the background',
        taskIcon: {
          name: 'ic_launcher',
          type: 'mipmap',
        },
        taskTimeout: 1000 * 60 * 15, // 15 minutes
        forceAllow: true,
      };

      try {
        if (isBackgroundJob) {
          console.log('Starting background job...');
          await BackgroundJob.start(setOfflineFromBackground, options);
        } else {
          if (timerId.current) {
            clearTimeout(timerId.current); // Clear the timer when stopping the job
          }
          if (user) {
            await BackgroundJob.stop();
            console.log('Background job stopped');
            authService.setOffline({ user, payload: { isOnline: false } });
            setProfile(null);
          }
        }
      } catch (error) {
        console.log('Error managing background task:', error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  const setOfflineFromBackground = async () => {
    if (user) {
      console.log('Running background task for setting user offline...');
      const delay = 1000 * Number(Config.BACKGROUND_TASK_TIMEOUT);

      await new Promise((resolve) => {
        timerId.current = setTimeout(async () => {
          console.log('Timeout reached, setting user offline...');
          if(AppState.currentState !== 'active'){
            await authService.setOffline({ user, payload: { isOnline: false } });
            setProfile(null);
            console.log('User set to offline in background.');
            await BackgroundJob.stop(); // Stop the background job when complete
            resolve(true); // Ensure the task completes
          }
        }, delay);
      });
    }
  };


  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        console.log('App is now in foreground, canceling timer...');
        if (timerId.current) {
          clearTimeout(timerId.current); // Cancel the timer if app is in foreground
        }
        BackgroundJob.stop().catch((error) => {
          console.log('Error stopping background job on foreground:', error);
        });
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

  }, [timerId]);

  return { doBackgroundTask };
}
