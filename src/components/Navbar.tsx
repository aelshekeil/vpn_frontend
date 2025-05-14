// /home/ubuntu/vpn_frontend/src/components/Navbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation"; // Corrected import for App Router

const Navbar = () => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // No need to manually push router for language change with middleware or proper setup
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          {t("product_name")}
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-300">{t("nav_home")}</Link>
          <Link href="/pricing" className="hover:text-gray-300">{t("nav_pricing")}</Link>
          <Link href="/register" className="hover:text-gray-300">{t("nav_register")}</Link>
          <Link href="/login" className="hover:text-gray-300">{t("nav_login")}</Link>
          <Link href="/dashboard" className="hover:text-gray-300">{t("nav_dashboard")}</Link>
          {/* Language Switcher */}
          <button onClick={() => changeLanguage(i18n.language === "en" ? "ar" : "en")}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded">
            {i18n.language === "en" ? "العربية" : "English"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
