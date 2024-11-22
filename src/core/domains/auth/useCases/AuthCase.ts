import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AuthImplementation from '../repositories/implementation/AuthImplementation';
import { FormDataLogin } from '../entities/LoginAuth';
import { AuthPayload } from '../entities/FirebaseAuth';

interface AuthUseCase {
  onGoogleSignIn(): Promise<FirebaseAuthTypes.UserCredential>;
  onAuthStateChangedHandler(userData: FirebaseAuthTypes.User | null): Promise<void>;
  onLogin(payload: AuthPayload): Promise<AuthPayload>;
  onLogout(stopWatchingPosition: () => void): Promise<string>;
  setUserOffline(callback?: () => void): Promise<void>;
  checkLogin(
    data: FormDataLogin,
    checkLocationPermission: boolean,
    requestLocationPermission: string,
    callback: () => void
  ): Promise<void>;
}

const AuthUseCase = (authImplementation = AuthImplementation()): AuthUseCase => ({
  async onGoogleSignIn() {
    const userCredential = await authImplementation.OnGoogleSignIn();
    if (!userCredential) {
      throw new Error('Google sign-in failed');
    }
    return userCredential;
  },

  async onAuthStateChangedHandler(userData: FirebaseAuthTypes.User | null) {
    return await authImplementation.OnAuthStateChangedHandler(userData);
  },

  async onLogin(payload: AuthPayload): Promise<AuthPayload> {
    const result = await authImplementation.OnLogin(payload);
    return {
      ...result,
      isOnline: true,
      lastOnline: Date.now(),
      email: payload.email,
    };
  },

  async onLogout(stopWatchingPosition: () => void) {
    return await authImplementation.OnLogout(stopWatchingPosition);
  },

  async setUserOffline(callback: () => void) {
    return await authImplementation.SetUserOffline(callback);
  },

  async checkLogin(
    data: FormDataLogin,
    checkLocationPermission: boolean,
    requestLocationPermission: string,
    callback: () => void
  ) {
    return await authImplementation.CheckLogin(data, checkLocationPermission, requestLocationPermission, callback);
  },
});

export default AuthUseCase;
