import { UpdateLocationInFirestorePayload } from '@/type/User/type';
import firestore, { GeoPoint } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { UserLocation } from '@/type/Location/Location';

const updateLocationInFirestore = ({ latitude, longitude, user }: UpdateLocationInFirestorePayload) => {
  if (user) {
    firestore()
      .collection('Users')
      .doc(user.email)
      .update({
        location: new GeoPoint(latitude, longitude),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      })
      .catch((error) => console.error('Error updating location:', error));
  }
};

const subscribeSellerLocation = (callback: (locations: UserLocation[]) => void) => {
  if (!auth().currentUser) {
    console.warn('User not authenticated, not setting up Firestore listener.');
    return () => {};
  }

  return firestore()
    .collection('Users')
    .where('isOnline', '==', true)
    .where('role', '==', 'Seller')
    .onSnapshot(
      (querySnapshot) => {
        const onlineUsers = querySnapshot.docs
          .map((doc) => {
            const { location, name, role } = doc.data();
            if (location) {
              return {
                id: doc.id,
                latitude: location.latitude,
                longitude: location.longitude,
                name,
                role,
              };
            }
            return null;
          })
          .filter((userLoc): userLoc is UserLocation => userLoc !== null);

        callback(onlineUsers);
      },
      () => {
        return;
      }
    );
};

const subscribeBuyerLocation = (callback: (locations: UserLocation[]) => void) => {
  if (!auth().currentUser) {
    console.warn('User not authenticated, not setting up Firestore listener.');
    return () => {};
  }

  return firestore()
    .collection('Users')
    .where('isOnline', '==', true)
    .where('role', '==', 'Buyer')
    .onSnapshot(
      (querySnapshot) => {
        const onlineUsers = querySnapshot.docs
          .map((doc) => {
            const { location, name, role } = doc.data();
            if (location) {
              return {
                id: doc.id,
                latitude: location.latitude,
                longitude: location.longitude,
                name,
                role,
              };
            }
            return null;
          })
          .filter((userLoc): userLoc is UserLocation => userLoc !== null);

        callback(onlineUsers);
      },
      () => {
        return;
      }
    );
};

const userService = {
  updateLocationInFirestore,
  subscribeSellerLocation,
  subscribeBuyerLocation,
};

export default userService;
