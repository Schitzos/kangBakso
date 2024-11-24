// slices/user-slices.ts
import { ProfileData, UserData } from '@/core/domains/auth/entities/FirebaseAuth';
import { LocationPermissionStatus } from '@/core/domains/liveUser/Location';
import MMKVstorage from '@/infrastructure/storage/mmkv';
import { PermissionsAndroid } from 'react-native';
import { StateCreator } from 'zustand';

export interface UserSlice {
  user: UserData | null; // User can be null if not logged in
  profile: ProfileData | null;
  isAuthenticated: boolean; // Authentication status
  locationPermissions: LocationPermissionStatus;

  setUser: (userData: UserData) => void;
  setProfile: (profileData: ProfileData|null) => void;
  clearUser: () => void;
  updateUser: (updatedData: Partial<UserData>) => void; // Allow partial updates
  setLocationPermissions: (permissions: LocationPermissionStatus) => void;
}


// Create the user slice
export const createUserSlice: StateCreator<UserSlice> = (set) => {
  // Load user from MMKV on initialization
  const savedUser = MMKVstorage.getString('user');
  const parsedUser = savedUser ? JSON.parse(savedUser) : null;

  return {
    user: parsedUser,
    isAuthenticated: !!parsedUser, // Set authentication status based on loaded user
    profile: null,
    locationPermissions: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION as LocationPermissionStatus,

    // Action to set user details
    setUser: (userData: UserData) => {
      set({ user: userData, isAuthenticated: true });
      MMKVstorage.set('user', JSON.stringify(userData)); // Save user data in MMKV
    },

    // Action to set role
    setProfile: (profileData: ProfileData| null) => {
      set({ profile: profileData });
    },

    // Action to clear user details
    clearUser: () => {
      set({ user: null, isAuthenticated: false });
      MMKVstorage.delete('user'); // Remove user data from MMKV
    },

    // Action to update user details
    updateUser: (updatedData: Partial<UserData>) => {
      set((state) => {
        const updatedUser = state.user ? { ...state.user, ...updatedData } : null;
        if (updatedUser) {
          MMKVstorage.set('user', JSON.stringify(updatedUser)); // Update user data in MMKV
        }
        return { user: updatedUser };
      });
    },

    setLocationPermissions: (permissions: LocationPermissionStatus) => {
      set({ locationPermissions: permissions });
    },
  };
};
