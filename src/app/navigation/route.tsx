import React from 'react';
import { Suspensed } from './suspense';

export default {
  LoginScreen: Suspensed(React.lazy(() => import('../features/login/screens/Login'))),
  HomeScreen: Suspensed(React.lazy(() => import('../features/liveUsers/screens/LiveUser'))),
};
