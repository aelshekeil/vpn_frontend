// /home/ubuntu/vpn_frontend/src/app/(app)/layout.tsx
import React from "react";
import Navbar from "@/components/Navbar"; // Assuming a shared or adapted Navbar
import Footer from "@/components/Footer"; // Assuming a shared or adapted Footer
import { appWithTranslation } from "next-i18next";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  // This layout could include a sidebar or different navigation for authenticated users
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

export default appWithTranslation(AppLayout);
