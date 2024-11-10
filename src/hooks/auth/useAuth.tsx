import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useBoundStore } from '@/store/store';
import { useLocation } from '../user/useLocation';
import { useCallback } from 'react';
import BackgroundJob from 'react-native-background-actions';
import { mapFirebaseUserToUserData } from '@/utils/common';
import authService from '@/services/auth/auth.service';

export function useAuth() {
  const {clearUser, setProfile} = useBoundStore.getState();
  const {stopWatchingPosition} = useLocation();

  const onGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const {data} = response;
        const idToken = data?.idToken;
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
      }
    } catch (error) {
      console.log('Google Sign-In Error:', error);
      throw error;
    }
  };

  const onLogout = async () => {
    try {
      const user = useBoundStore.getState().user;
      const payload = {
        isOnline: false,
      };
      if(user){
        await authService.setOffline({user, payload});
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

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    const userData = mapFirebaseUserToUserData(user);
    if (userData) {
      useBoundStore.getState().setUser(userData);
    }
  };

  const setUserOffline = useCallback(async () => {
    const task = async () => {
      const {user} = useBoundStore.getState();
      if(user){
        setTimeout(() => {
          authService.setOffline({user: user, payload: {isOnline: false}});
          setProfile(null);
        }, 1000 * 5);
      }
      console.log('Background task is running...');
      await new Promise<void>((resolve) => setTimeout(resolve, 10000)); // Simulate a task (10 seconds)
      console.log('Background task completed');
    };

    const options = {
      taskName: 'BackgroundSync', // Use a fixed task name for now
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
      await BackgroundJob.start(task, options);
      console.log('Background task started');
    } catch (error) {
      console.log('Error starting background task:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { onGoogleSignIn, onLogout, onAuthStateChanged, setUserOffline};
}
