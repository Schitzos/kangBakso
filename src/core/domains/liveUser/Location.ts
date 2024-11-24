export type LocationPermissionStatus = 'granted' | 'denied' | 'pending';



export interface UserLocation {
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    role: string;
  }
