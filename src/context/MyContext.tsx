// src/context/MyContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState } from 'react';

type ContextType = {
  testValue: string;
};

const MyContext = createContext<ContextType>({ testValue: 'default' });

export function ContextProvider({ children }: { children: ReactNode }) {
  return (
    <MyContext.Provider value={{ testValue: 'test' }}>
      {children}
    </MyContext.Provider>
  );
}