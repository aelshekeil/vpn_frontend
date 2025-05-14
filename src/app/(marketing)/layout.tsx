// /home/ubuntu/vpn_frontend/src/app/(marketing)/layout.tsx
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { appWithTranslation } from "next-i18next";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default appWithTranslation(MarketingLayout);
