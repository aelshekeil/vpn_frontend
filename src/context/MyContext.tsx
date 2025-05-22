"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface ContextType {
  userData: {
    email: string;
    plan: string;
    status: string;
    expires_at: string | null;
    bandwidthUsed: string;
    bandwidthLimit: string;
    is_vip: boolean;
  } | null;
  setUserData: (data: ContextType['userData']) => void;
}

const MyContext = createContext<ContextType | null>(null);

export function ContextProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<ContextType['userData']>(null);
  
  return (
    <MyContext.Provider value={{ userData, setUserData }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within ContextProvider");
  }
  return context;
}