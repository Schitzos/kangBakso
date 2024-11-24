import { UserData } from '../User/type';

export interface AuthPayload {
    name: string;
    location: object;
    role: string;
    isOnline: boolean;
    lastOnline: number;
    email: string;
  }


export interface SetOfflinePayload {
    user: UserData;
    payload: { isOnline: boolean };
  }
