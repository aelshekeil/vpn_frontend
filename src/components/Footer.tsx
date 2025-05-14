// /home/ubuntu/vpn_frontend/src/components/Footer.tsx
import React from "react";
import { useTranslation } from "next-i18next";

const Footer = () => {
  const { t } = useTranslation("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-8">
      <p>
        &copy; {currentYear} {t("product_name")}. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
