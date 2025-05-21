// /home/ubuntu/vpn_frontend/src/app/(app)/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
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

// Type for potential error objects
type ErrorWithMessage = {
  message: string;
};

const DashboardPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Improved error type handling
  const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
    return typeof error === 'object' && error !== null && 'message' in error;
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("vpn_user_token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/user/status`, {
        headers: { "x-access-token": token },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("vpn_user_token");
          router.push("/login");
          return;
        }
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch user data");
      }

      const data: UserData = await response.json();
      setUserData(data);
      setError(null);
    } catch (err: unknown) {  // Changed from 'any' to 'unknown'
      setError(
        isErrorWithMessage(err) 
          ? err.message 
          : "An unexpected error occurred"
      );
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkPaymentStatus = () => {
      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams.get("payment_success") === "true") {
        alert("Payment successful! Your VIP plan is now active...");
        router.replace("/dashboard");
      }
      if (queryParams.get("payment_cancelled") === "true") {
        alert("Payment was cancelled. Your plan has not been changed.");
        router.replace("/dashboard");
      }
    };

    const initialize = async () => {
      await fetchUserData();
      checkPaymentStatus();
    };

    initialize();
  }, [router]);

  // Type for configuration response headers
  interface ConfigResponseHeaders extends Headers {
    get(name: "content-disposition"): string | null;
  }

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
        headers: { "x-access-token": token },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to download configuration.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      // Type-safe header handling
      const disposition = (response.headers as ConfigResponseHeaders).get("content-disposition");
      let filename = "wg_config.conf";
      
      if (disposition) {
        const filenameMatch = disposition.match(/filename=(["']?)(?<filename>.+)\1/);
        filename = filenameMatch?.groups?.filename || filename;
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setError(null);
    } catch (err: unknown) {  // Changed from 'any' to 'unknown'
      setError(
        isErrorWithMessage(err)
          ? err.message
          : "An error occurred while downloading the configuration."
      );
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
        return;
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setError("Could not retrieve Stripe Checkout URL.");
      }
    } catch (err: unknown) {  // Changed from 'any' to 'unknown'
      setError(
        isErrorWithMessage(err)
          ? err.message
          : "An error occurred during the upgrade process."
      );
    }
  };

  // ... rest of the component remains the same ...
};

export default DashboardPage;