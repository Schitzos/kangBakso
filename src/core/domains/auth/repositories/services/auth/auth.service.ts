import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import { AuthPayload, SetOfflinePayload } from '@/core/domains/auth/entities/FirebaseAuth';

const doAauth = async (payload: AuthPayload) => {
  try {
    const userRef = firestore().collection('Users').doc(payload.email);
    await userRef.set(payload, { merge: true });

    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data();

    return updatedData;

  } catch (error) {
    crashlytics().log(`Error ${error as Error}`);
    crashlytics().recordError(error as Error);
    console.error('Error in doAauth:', error);
    throw error;
  }
};

const setOffline = async ({ user, payload }: SetOfflinePayload) => {
  try{
    const userRef = firestore().collection('Users').doc(user?.email);
    await userRef.set(payload, { merge: true });
    console.log(`${user?.email} is now offline`);
  }catch (error) {
    console.error('Error in setOffline:', error);
  }
};

const authService = {
  doAauth, setOffline,
};

export default authService;
