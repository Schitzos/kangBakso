import { GeoPoint } from '@react-native-firebase/firestore';

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
