// src/app/(app)/layout.tsx
'use client';

import React from 'react';
import { ContextProvider } from '@/context/MyContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContextProvider>
      {children}
    </ContextProvider>
  );
}