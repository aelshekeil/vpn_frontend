"use client";

import { createContext, useContext, ReactNode, useState } from "react";

type ContextType = {
  userData: any;
  setUserData: (data: any) => void;
};

const MyContext = createContext<ContextType | null>(null);

// Export the provider
export function ContextProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState(null);
  
  return (
    <MyContext.Provider value={{ userData, setUserData }}>
      {children}
    </MyContext.Provider>
  );
}

// Export the custom hook
export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within ContextProvider");
  }
  return context;
}