import { UserData } from '@/core/domains/auth/entities/FirebaseAuth';
import LiveUserUseCase from '@/core/domains/liveUser/useCases/LiveUserUseCase';
import { useRef } from 'react';
import Geolocation from 'react-native-geolocation-service';

interface LocationData {
  latitude: number;
  longitude: number;
  error?: string;
}

export function useLocation() {
  let watchId: number | null = null;
  const userLocationRef = useRef<{ latitude: number; longitude: number }>({ latitude: 0, longitude: 0 });
  const liveUserUseCase = LiveUserUseCase();

  const getLocation = async (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location error:', error.message);
          reject(new Error(error.message));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });
  };

  const watchPosition = (user: UserData, setLocation: (location: { latitude: number, longitude: number }) => void) => {
    watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const moved = hasMoved(
          latitude,
          longitude,
          userLocationRef.current.latitude,
          userLocationRef.current.longitude
        );

        if (moved) {
          liveUserUseCase.updateLocationInFirestore(latitude, longitude, user);
          userLocationRef.current = { latitude, longitude };
          setLocation({ latitude, longitude });
          return { latitude, longitude };
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 5, // Update location every time it changes
        interval: 5, // Update every 5 seconds
      }
    );
  };

  const stopWatchingPosition = () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      watchId = null;
    }
  };

  const hasMoved = (
    newLat: number,
    newLon: number,
    oldLat: number,
    oldLon: number,
    threshold: number = 5
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters

    // Convert latitudes and longitudes from degrees to radians
    const lat1 = toRad(oldLat);
    const lat2 = toRad(newLat);
    const deltaLat = toRad(newLat - oldLat);
    const deltaLon = toRad(newLon - oldLon);

    // Haversine formula calculation
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters


    // Check if the distance is greater than the threshold
    return distance > threshold;
  };

  return { getLocation, watchPosition, stopWatchingPosition, hasMoved };
}
