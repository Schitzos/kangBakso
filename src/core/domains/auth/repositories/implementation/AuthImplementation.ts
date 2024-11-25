import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import { useBoundStore } from '@/app/stateManagement/store';
import { Alert, Linking, Platform } from 'react-native';
import { FirebaseAuthMapper } from '../mapper/FirebaseAuthMapper';
import { AuthPayload, FormDataLogin } from '../../entities/auth';
import firestore from '@react-native-firebase/firestore';

const AuthImplementation = () => {
  const OnGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { data } = response;
        const idToken = data?.idToken;
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return await auth().signInWithCredential(googleCredential);
      }
    } catch (error) {
      crashlytics().log(`Error ${error as Error}`);
      crashlytics().recordError(error as Error);
      console.log('Google Sign-In Error:', error);
      throw error;
    }
  };

  const OnAuthStateChangedHandler = async (userData: FirebaseAuthTypes.User | null) => {
    const mappedUserData = FirebaseAuthMapper(userData);
    if (mappedUserData) {
      useBoundStore.getState().setUser(mappedUserData);
    }
  };

  const OnLogin = async (
    payload:AuthPayload
  ) => {
    try {
      const userRef = firestore().collection('Users').doc(payload.email!);
      await userRef.set(payload, { merge: true });

      const updatedDoc = await userRef.get();
      const updatedData = updatedDoc.data();

      if (!updatedData) {throw new Error('Authentication failed.');}

      const modProfile = { role: updatedData.role, location: updatedData.location, name: updatedData.name };
      useBoundStore.setState({ profile: modProfile });

      return modProfile;

    } catch (error:any) {
      crashlytics().log(`Login Error: ${error.message}`);
      crashlytics().recordError(error);
      console.error('Login Error:', error);
      throw error;
    }
  };

  const OnLogout = async (stopWatchingPosition: () => void) => {
    const { clearUser, setProfile, user } = useBoundStore.getState();
    try {

      if (user) {
        await SetUserOffline();
      }

      clearUser();
      setProfile(null);
      stopWatchingPosition();

      await auth().signOut();
      await GoogleSignin.signOut();

      return 'Logout successful';
    } catch (error) {
      crashlytics().log(`Error ${error as Error}`);
      crashlytics().recordError(error as Error);
      console.error('Sign-Out Error:', error);
      throw error;
    }
  };

  const SetUserOffline = async (callback?:()=>void)=>{
    const { setProfile, user } = useBoundStore.getState();
    if(user){
      const payload = { isOnline: false };
      const userRef = firestore().collection('Users').doc(user?.email);
      await userRef.set(payload, { merge: true });
      setProfile(null);
      callback && callback();
    }
  };

  const CheckLogin = async (data:FormDataLogin, checkLocationPermission: boolean, requestLocationPermission:string, callback:()=>void) => {
    const granted = checkLocationPermission;
    if(!granted){
      const isAllow = requestLocationPermission;
      if(isAllow === 'granted'){
        CheckLogin(data, checkLocationPermission, requestLocationPermission, callback);
      }else{
        Alert.alert(
          'Location Permission Needed',
          `Location access is needed to find nearby Bakso ${data.role === 'Seller' ? 'Customers' : 'Vendors'}. Please enable location permissions in settings.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');  // Opens app settings on iOS
                } else if (Platform.OS === 'android') {
                  Linking.openSettings(); // Opens settings on Android
                }
              },
            },
          ]
        );
      }
    }else{
      callback && callback();
    }
  };


  return{
    OnGoogleSignIn,
    OnAuthStateChangedHandler,
    OnLogin,
    OnLogout,
    SetUserOffline,
    CheckLogin,
  };
};

export default AuthImplementation;
