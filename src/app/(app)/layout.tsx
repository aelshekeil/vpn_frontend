// src/app/(app)/layout.tsx
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Add authenticated user specific layout elements here, e.g., sidebar */}
        {children}
      </main>
      <Footer />
    </>
  );
};

export default AppLayout;


export default appWithTranslation(AppLayout);
