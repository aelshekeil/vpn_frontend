"use client";

import { createContext, useContext, ReactNode, useState } from "react";

type MyContextType = {
  userData: any;
  setUserData: (data: any) => void;
};

// Ensure only one ContextProvider is declared
const MyContext = createContext<MyContextType | null>(null);

export function ContextProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState(null);
  
  return (
    <MyContext.Provider value={{ userData, setUserData }}>
      {children}
    </MyContext.Provider>
  );
}

// Single export for the context consumer
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within ContextProvider");
  }
  return context;
};