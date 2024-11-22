import LiveUserImplementation from '../repositories/implementation/LiveUserImplementation';
import { UserData } from '@/core/domains/auth/entities/FirebaseAuth';
import { UserLocation } from '@/type/User/type';

interface LiveUserUseCase {
  subscribeSellerLocation(callback: (locations: UserLocation[]) => void): () => void;
  subscribeBuyerLocation(callback: (locations: UserLocation[]) => void): () => void;
  updateLocationInFirestore(latitude: number, longitude: number, user: UserData): void;
}

const LiveUserUseCase = (
  liveUserImplementation = LiveUserImplementation()
): LiveUserUseCase => ({
  subscribeSellerLocation(callback) {
    return liveUserImplementation.subscribeSellerLocation(callback);
  },

  subscribeBuyerLocation(callback) {
    return liveUserImplementation.subscribeBuyerLocation(callback);
  },

  updateLocationInFirestore(latitude, longitude, user) {
    liveUserImplementation.updateLocationInFirestore(latitude, longitude, user);
  },
});

export default LiveUserUseCase;
