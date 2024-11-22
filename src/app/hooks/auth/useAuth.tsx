import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useLocation } from '../user/useLocation';
import { mapFirebaseUserToUserData } from '@/utils/common';
import authService, { AuthPayload } from '@/services/auth/auth.service';
import { GeoPoint } from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import { useBoundStore } from '@/app/store/store';

export function useAuth() {
  const { clearUser, setProfile, user } = useBoundStore.getState();
  const { stopWatchingPosition } = useLocation();
  const { getLocation } = useLocation();

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
      crashlytics().log(`Error ${error as Error}`);
      crashlytics().recordError(error as Error);
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
      crashlytics().log(`Error ${error as Error}`);
      crashlytics().recordError(error as Error);
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
      crashlytics().log(`Error ${error as Error}`);
      crashlytics().recordError(error as Error);
      console.log('Sign-Out Error:', error);
      throw error;
    }
  };

  const setUserOffline = async ()=>{
    if(user){
      await authService.setOffline({ user, payload: { isOnline: false } });
      setProfile(null);
    }
  };

  const onAuthStateChanged = async (userData: FirebaseAuthTypes.User | null) => {
    const mappedUserData = mapFirebaseUserToUserData(userData);
    if (mappedUserData) {
      useBoundStore.getState().setUser(mappedUserData);
    }
  };


  return { onGoogleSignIn, onLogout, onAuthStateChanged, onLogin, setUserOffline };
}
