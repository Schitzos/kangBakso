import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { mapFirebaseUserToUserData } from '@/app/utils/common';
import { useBoundStore } from '@/app/stateManagement/store';

export function useAuth() {
  const onAuthStateChanged = async (userData: FirebaseAuthTypes.User | null) => {
    const mappedUserData = mapFirebaseUserToUserData(userData);
    if (mappedUserData) {
      useBoundStore.getState().setUser(mappedUserData);
    }
  };


  return { onAuthStateChanged };
}
