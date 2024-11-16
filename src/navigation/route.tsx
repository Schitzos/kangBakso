import React from 'react';
import { Suspensed } from './suspense';

export default {
  LoginScreen: Suspensed(React.lazy(() => import('../screens/Login'))),
  HomeScreen: Suspensed(React.lazy(() => import('../screens/Home'))),
};
