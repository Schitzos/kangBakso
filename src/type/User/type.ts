import { GeoPoint } from '@react-native-firebase/firestore';

type UserMetadata = {
  creationTime: number;
  lastSignInTime: number;
};

type MultiFactor = {
  enrolledFactors: any[]; // Use specific type here if the factors are more detailed
};

type ProviderData = {
  providerId: string;
  uid: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
};

export type UserData = {
  displayName: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: UserMetadata;
  multiFactor: MultiFactor;
  phoneNumber: string | null;
  photoURL: string | null;
  providerData: ProviderData[];
  providerId: string;
  tenantId: string | null;
  uid: string;
  role?: string;
};

export type RoleType = 'Buyer' | 'Seller' | undefined;

export type ProfileData = {
  role: RoleType;
  location: GeoPoint;
  name: string;
}

export interface UserLocation {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  role: string;
}
