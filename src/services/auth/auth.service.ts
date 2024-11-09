import firestore from '@react-native-firebase/firestore';

interface AuthPayload {
  name: string;
  location: object;
  role: string;
  isOnline: boolean;
  lastOnline: number;
  email: string;
}

const doAauth = async (payload: AuthPayload) => {
  try {
    const userRef = firestore().collection('Users').doc(payload.email);

    await userRef.set(payload, { merge: true });

    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data();

    return updatedData;

  } catch (error) {
    console.error('Error in doAauth:', error);
    throw error;
  }
};

const authService = {
  doAauth,
};

export default authService;
