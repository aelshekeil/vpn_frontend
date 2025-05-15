// /home/ubuntu/vpn_frontend/src/app/(app)/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next"; // Assuming next-i18next is configured for App Router
import { useRouter } from "next/navigation";

interface UserData {
  email: string;
  plan: string;
  status: string;
  expires_at: string | null; 
  bandwidthUsed: string;
  bandwidthLimit: string;
  is_vip: boolean;
}

const DashboardPage = () => { // Removed NextPage type as it's less common with App Router's default server components, though this is a client component.
  const { t } = useTranslation("common");
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    const token = localStorage.getItem("vpn_user_token");
    if (!token) {
      router.push("/login");
      return;
    }
    setIsLoading(true);
    try {
      // IMPORTANT: Replace with your actual API URL, ideally from an environment variable
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; 
      const response = await fetch(`${apiUrl}/api/user/status`, {
        headers: { "x-access-token": token },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("vpn_user_token");
          router.push("/login");
        }
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch user data");
      }
      const data: UserData = await response.json();
      setUserData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("payment_success") === "true") {
        alert("Payment successful! Your VIP plan is now active or will be shortly after webhook processing.");
        router.replace("/dashboard", undefined);
        fetchUserData(); 
    }
    if (queryParams.get("payment_cancelled") === "true") {
        alert("Payment was cancelled. Your plan has not been changed.");
        router.replace("/dashboard", undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleDownloadConfig = async () => {
    const token = localStorage.getItem("vpn_user_token");
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      router.push("/login");
      return;
    }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/user/config`, {
        method: "GET",
        headers: {
          "x-access-token": token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to download configuration.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = response.headers.get("content-disposition");
      let filename = "wg_config.conf";
      if (disposition && disposition.indexOf("attachment") !== -1) {
        const filenameRegex = /filename[^;=\n]*=(([""])(.*?)\2|([^;\n]*))/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[3]) {
          filename = matches[3];
        } else if (matches != null && matches[4]) {
          filename = matches[4];
        }
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred while downloading the configuration.");
    }
  };

  const handleUpgradePlan = async () => {
    const token = localStorage.getItem("vpn_user_token");
    if (!token) {
      router.push("/login");
      return;
    }
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/payment/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create payment session.");
      } else if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setError("Could not retrieve Stripe Checkout URL.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during the upgrade process.");
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading dashboard...</div>;
  }

  if (error && !userData) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error: {error} <button onClick={() => router.push("/login")} className="text-blue-500 underline ml-2">Go to Login</button></div>;
  }

  if (!userData) {
    return <div className="container mx-auto px-4 py-8 text-center">No user data found. Please try logging in again.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{t("nav_dashboard")}</h1>
      </header>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Current Plan:</strong> {userData.plan}</p>
          <p><strong>Status:</strong> <span className={`font-semibold ${userData.status === "Active" ? "text-green-600" : "text-red-600"}`}>{userData.status}</span></p>
          <p><strong>Subscription Expires:</strong> {userData.expires_at ? new Date(userData.expires_at).toLocaleDateString() : (userData.is_vip ? "N/A (VIP)" : "N/A")}</p>
          <p><strong>Bandwidth Used:</strong> {userData.bandwidthUsed}</p>
          <p><strong>Bandwidth Limit:</strong> {userData.bandwidthLimit}</p>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex items-center">
          <button 
            onClick={handleDownloadConfig}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Download VPN Configuration
          </button>
          {!userData.is_vip && (
            <button 
              onClick={handleUpgradePlan}
              className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Upgrade to VIP
            </button>
          )}
          <button 
            onClick={() => {
              localStorage.removeItem("vpn_user_token");
              router.push("/login");
            }}
            className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Logout
          </button>
        </div>
      </section>
    </div>
  );
};

// Removed the getStaticProps function as it is not supported in App Router

export default DashboardPage;

