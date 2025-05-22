"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import { useMyContext } from "@/context/MyContext";

interface UserData {
  email: string;
  plan: string;
  status: string;
  expires_at: string | null;
  bandwidthUsed: string;
  bandwidthLimit: string;
  is_vip: boolean;
}

type ErrorWithMessage = {
  message: string;
};

const isUserData = (data: any): data is UserData => {
  return (
    typeof data.email === "string" &&
    typeof data.plan === "string" &&
    typeof data.status === "string" &&
    (typeof data.expires_at === "string" || data.expires_at === null) &&
    typeof data.bandwidthUsed === "string" &&
    typeof data.bandwidthLimit === "string" &&
    typeof data.is_vip === "boolean"
  );
};

const DashboardPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { setUserData, userData } = useMyContext();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

  const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
    return !!error && typeof error === "object" && "message" in error;
  };

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem("vpn_user_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${apiUrl}/api/user/status`, {
        headers: { "x-access-token": token },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("vpn_user_token");
          router.push("/login");
          return;
        }

        const errorData: { message?: string } = await response.json();
        throw new Error(errorData.message || "Failed to fetch user data");
      }

      const data = await response.json();

      if (isUserData(data)) {
        setUserData(data);
        setError(null);
      } else {
        throw new Error("Invalid user data returned from API");
      }
    } catch (err: unknown) {
      setError(
        isErrorWithMessage(err)
          ? err.message
          : t("errors.unexpected_error")
      );
    } finally {
      setIsLoading(false);
    }
  }, [router, setUserData, t, apiUrl]);

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

    void initialize();
  }, [router, fetchUserData]);

  const handleDownloadConfig = async () => {
    const token = localStorage.getItem("vpn_user_token");
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/user/config`, {
        method: "GET",
        headers: { "x-access-token": token },
      });

      if (!response.ok) {
        const errorData: { message?: string } = await response.json();
        throw new Error(errorData.message || "Failed to download configuration.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const disposition = response.headers.get("content-disposition");
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
    } catch (err: unknown) {
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
      const response = await fetch(`${apiUrl}/api/payment/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      const data: { checkout_url?: string; error?: string } = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create payment session.");
        return;
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setError("Could not retrieve Stripe Checkout URL.");
      }
    } catch (err: unknown) {
      setError(
        isErrorWithMessage(err)
          ? err.message
          : "An error occurred during the upgrade process."
      );
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">{t("loading")}</div>;
  }

  if (error && !userData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        {t("error")}: {error}
        <button 
          onClick={() => router.push("/login")} 
          className="text-blue-500 underline ml-2"
        >
          {t("go_to_login")}
        </button>
      </div>
    );
  }

  if (!userData) {
    return <div className="container mx-auto px-4 py-8 text-center">{t("no_user_data")}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background">
      <header className="mb-8 border-b border-border pb-4">
        <h1 className="text-3xl font-bold text-foreground">{t("nav_dashboard")}</h1>
      </header>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">{t("account_info")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>{t("email")}:</strong> {userData.email}</p>
          <p><strong>{t("current_plan")}:</strong> {userData.plan}</p>
          <p>
            <strong>{t("status")}:</strong>
            <span className={`font-semibold ${userData.status === "Active" ? "text-green-600" : "text-red-600"}`}>
              {userData.status}
            </span>
          </p>
          <p>
            <strong>{t("subscription_expires")}:</strong>{" "}
            {userData.expires_at
              ? new Date(userData.expires_at).toLocaleDateString()
              : userData.is_vip
              ? t("na_vip")
              : t("na")}
          </p>
          <p><strong>{t("bandwidth_used")}:</strong> {userData.bandwidthUsed}</p>
          <p><strong>{t("bandwidth_limit")}:</strong> {userData.bandwidthLimit}</p>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{t("actions")}</h2>
        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex items-center">
          <button 
            onClick={handleDownloadConfig}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            {t("download_config")}
          </button>

          {!userData.is_vip && (
            <button 
              onClick={handleUpgradePlan}
              className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              {t("upgrade_vip")}
            </button>
          )}

          <button 
            onClick={() => {
              localStorage.removeItem("vpn_user_token");
              router.push("/login");
            }}
            className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            {t("logout")}
          </button>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
