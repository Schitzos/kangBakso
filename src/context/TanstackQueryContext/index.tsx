import { queryClientConfig } from '@/config/tanstack';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = queryClientConfig;

interface TansatckContextProviderProps {
  children: React.ReactNode;
}

export default function TansatckContextProvider({
  children,
}: Readonly<TansatckContextProviderProps>): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

