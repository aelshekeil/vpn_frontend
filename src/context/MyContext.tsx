"use client";

import { createContext, useContext, ReactNode } from "react";

interface MyContextType {
  // Define your context properties here
}

const MyContext = createContext<MyContextType | null>(null);

export function ContextProvider({ children }: { children: ReactNode }) {
  // Add your context value here
  const value = {};

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a ContextProvider");
  }
  return context;
}