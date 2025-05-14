// /home/ubuntu/vpn_frontend/src/app/(marketing)/pricing/page.tsx
"use client";

import React from "react";
import { useTranslation } from "next-i18next";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const PricingPage: NextPage = () => {
  const { t } = useTranslation("common");

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t("nav_pricing")}</h1>
        <p className="text-lg text-gray-600">
          Choose the plan that best suits your needs.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan Card */}
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-3">Free Trial</h2>
          <p className="text-gray-600 mb-4">
            Get started with our basic features, completely free.
          </p>
          <div className="text-4xl font-bold mb-4">
            $0 <span className="text-lg font-normal">/ month</span>
          </div>
          <ul className="space-y-2 text-gray-700 mb-6">
            <li>✅ Limited Bandwidth</li>
            <li>✅ Limited Speed</li>
            <li>✅ Access to 3 Locations</li>
            <li>✅ Basic Support</li>
          </ul>
          <button className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg">
            Start Free Trial
          </button>
        </div>

        {/* VIP Plan Card */}
        <div className="bg-blue-600 text-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-3">VIP Plan</h2>
          <p className="opacity-90 mb-4">
            Unlock the full power of our VPN service with premium features.
          </p>
          <div className="text-4xl font-bold mb-4">
            $9.99 <span className="text-lg font-normal">/ month</span>
          </div>
          <ul className="space-y-2 opacity-90 mb-6">
            <li>✅ Unlimited Bandwidth</li>
            <li>✅ Blazing Fast Speed</li>
            <li>✅ Access to All Locations</li>
            <li>✅ Priority Support</li>
            <li>✅ Ad Blocker</li>
          </ul>
          <button className="w-full bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-lg">
            Go VIP
          </button>
        </div>
      </section>
    </div>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default PricingPage;
