"use client";

import { createContext, useContext, ReactNode, useState } from "react";

type MyContextType = {
  // Add your context values here
  userData: any;
  setUserData: (data: any) => void;
};

const MyContext = createContext<MyContextType | undefined>(undefined);

export function ContextProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any>(null);

  return (
    <MyContext.Provider value={{ userData, setUserData }}>
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