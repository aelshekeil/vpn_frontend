"use client";
import { createContext, useContext } from "react";

const MyContext = createContext<string>("");

export function ContextProvider({ children }: { children: React.ReactNode }) {
  return <MyContext.Provider value="some-value">{children}</MyContext.Provider>;
}

export function useMyContext() {
  return useContext(MyContext);
}
