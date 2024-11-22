import React from 'react';
import TansatckContextProvider from './TanstackQueryContext';

export default function ContextProvider({ children }: Readonly<{ children: React.ReactNode }>): React.ReactNode {
  return <TansatckContextProvider>{children}</TansatckContextProvider>;
}

