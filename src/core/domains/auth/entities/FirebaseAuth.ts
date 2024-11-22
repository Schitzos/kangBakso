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

export interface AuthPayload {
  name: string;
  location: object;
  role: string;
  isOnline: boolean;
  lastOnline: number;
  email: string | null;
}

export interface SetOfflinePayload {
    user: UserData;
    payload: { isOnline: boolean };
  }

