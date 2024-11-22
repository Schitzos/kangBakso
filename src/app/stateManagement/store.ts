import { create } from 'zustand';
import { createUserSlice, UserSlice } from './slices/user-slices';

type StoreState = UserSlice;

export const useBoundStore = create<StoreState>((...a) => ({
  ...createUserSlice(...a),
}));
