import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useBoundStore } from '@/store/store';
import { useLocation } from '../user/useLocation';
import { useCallback, useEffect } from 'react';
import BackgroundJob from 'react-native-background-actions';
import { mapFirebaseUserToUserData } from '@/utils/common';
import authService, { AuthPayload } from '@/services/auth/auth.service';
import Config from 'react-native-config';
import { GeoPoint } from '@react-native-firebase/firestore';
import { AppState, AppStateStatus } from 'react-native';

export function useAuth() {
  const { clearUser, setProfile, user } = useBoundStore.getState();
  const { stopWatchingPosition } = useLocation();
  const { getLocation } = useLocation();
  let timerId: NodeJS.Timeout | null = null; // Reference for the timer

  const onGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { data } = response;
        const idToken = data?.idToken;
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
      }
    } catch (error) {
      console.log('Google Sign-In Error:', error);
      throw error;
    }
  };

  const onLogin = async (data: any) => {
    try {
      const location = await getLocation();
      const payload = {
        name: data.name,
        location: new GeoPoint(location.latitude, location.longitude),
        role: data.role,
        isOnline: true,
        lastOnline: Date.now(),
        email: user?.email,
      };
      const dataAuth = await authService.doAauth(payload as AuthPayload);
      const profile =  { role: dataAuth?.role, location: dataAuth?.location, name: dataAuth?.name };

      useBoundStore.setState({ profile: profile });
      return profile;

    } catch (error) {
      console.log('Login Error:', error);
      throw error;
    }
  };

  const onLogout = async () => {
    try {
      const payload = {
        isOnline: false,
      };
      if(user){
        await authService.setOffline({ user, payload });
      }
      clearUser();
      setProfile(null);
      stopWatchingPosition();
      await auth().signOut();
      await GoogleSignin.signOut();
    } catch (error) {
      console.log('Sign-Out Error:', error);
      throw error;
    }
  };

  const onAuthStateChanged = async (userData: FirebaseAuthTypes.User | null) => {
    const mappedUserData = mapFirebaseUserToUserData(userData);
    if (mappedUserData) {
      useBoundStore.getState().setUser(mappedUserData);
    }
  };

  const setUserOffline = useCallback(//make function background service
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
          if (timerId) {
            clearTimeout(timerId); // Clear the timer when stopping the job
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
        timerId = setTimeout(async () => {
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
        if (timerId) {
          clearTimeout(timerId); // Cancel the timer if app is in foreground
        }
        BackgroundJob.stop().catch((error) => {
          console.log('Error stopping background job on foreground:', error);
        });
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

  }, [timerId]);

  return { onGoogleSignIn, onLogout, onAuthStateChanged, setUserOffline, onLogin };
}
