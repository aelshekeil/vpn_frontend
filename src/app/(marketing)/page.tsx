// /home/ubuntu/vpn_frontend/src/app/(marketing)/page.tsx (Home Page)
"use client";

import React from "react";
import { useTranslation } from "next-i18next";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const HomePage: NextPage = () => {
  const { t } = useTranslation("common");

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">{t("product_name")}</h1>
        <p className="text-xl text-gray-600">
          Your fast, secure, and reliable VPN solution.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-center mb-6">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Global Servers</h3>
            <p>Access content from anywhere in the world with our wide network of servers.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Top-tier Security</h3>
            <p>Protect your online activity with military-grade encryption.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Blazing Speeds</h3>
            <p>Enjoy seamless streaming and browsing with our high-speed connections.</p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-6">Ready to get started?</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
          Sign Up for Free Trial
        </button>
      </section>
    </div>
  );
};


export default HomePage;
