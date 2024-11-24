export interface LocationData {
    latitude: number;
    longitude: number;
    error?: string;
  }

export interface UserLocation {
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    role: string;
  }
