import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useBoundStore } from '@/store/store';
import { UserData } from '@/type/User/type';
import firestore from '@react-native-firebase/firestore';
import { useLocation } from '../user/useLocation';

export function useAuth() {
  const clearUser = useBoundStore.getState().clearUser;
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
    console.log('called');
    try {
      const user = useBoundStore.getState().user;
      const payload = {
        isOnline: false,
      };
      const userRef = firestore().collection('Users').doc(user?.email);
      await userRef.set(payload, { merge: true });

      clearUser();
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

  return { onGoogleSignIn, onLogout, onAuthStateChanged };
}

function mapFirebaseUserToUserData(user: FirebaseAuthTypes.User | null): UserData | null {
  if (!user) {return null;}

  return {
    displayName: user.displayName ?? '',
    email: user.email ?? '',
    emailVerified: user.emailVerified,
    isAnonymous: user.isAnonymous,
    metadata: {
      creationTime: user.metadata.creationTime ? new Date(user.metadata.creationTime).getTime() : 0,
      lastSignInTime: user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).getTime() : 0,
    },
    multiFactor: { enrolledFactors: user?.multiFactor?.enrolledFactors || [] },
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL,
    providerData: user.providerData.map((provider) => ({
      providerId: provider.providerId,
      uid: provider.uid,
      displayName: provider.displayName,
      email: provider.email,
      phoneNumber: provider.phoneNumber,
      photoURL: provider.photoURL,
    })),
    providerId: user.providerId,
    tenantId: null,
    uid: user.uid,
  };
}
