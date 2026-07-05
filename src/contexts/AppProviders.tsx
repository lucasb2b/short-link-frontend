import React, { ReactNode } from 'react';
import { ToastProvider } from './ToastContext';
import { AuthProvider } from './AuthContext';
import { LinkProvider } from './LinkContext';
import { PhotoProvider } from './PhotoContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <LinkProvider>
          <PhotoProvider>
            {children}
          </PhotoProvider>
        </LinkProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
