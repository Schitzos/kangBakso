import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { UserData } from '../../entities/FirebaseAuth';

export function FirebaseAuthMapper(user: FirebaseAuthTypes.User | null): UserData | null {
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
