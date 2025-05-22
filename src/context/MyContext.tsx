"use client";

import { createContext, useContext, ReactNode, useState } from "react";

type ContextValue = {
  userData: any;
  setUserData: (data: any) => void;
};

const MyContext = createContext<ContextValue | null>(null);

export function ContextProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState(null);
  return (
    <MyContext.Provider value={{ userData, setUserData }}>
      {children}
    </MyContext.Provider>
  );
}

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) throw new Error("useMyContext must be used within ContextProvider");
  return context;
};