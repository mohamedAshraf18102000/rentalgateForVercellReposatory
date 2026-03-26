"use client";

import * as React from "react";
import { setCookie } from "@/util/cookies";
import { loginUser } from "../services/login.service";
import type { LoginUserData } from "../types/api.types";
import { useClientStore } from "@/lib/api/stores";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface UseLoginProps {
  onSuccess?: (user: { id: string; email: string }) => void;
  onClose: () => void;
  redirectTo?: string;
  onClientInactive?: (
    email?: string,
    mobile?: string,
    channel?: "EMAIL" | "WHATSAPP",
  ) => void;
  onClientDeactivated?: (
    email?: string,
    mobile?: string,
    channel?: "EMAIL" | "WHATSAPP",
  ) => void;
}

interface UseLoginReturn {
  loginType: "mobile" | "email";
  setLoginType: (type: "mobile" | "email") => void;
  email: string;
  setEmail: (email: string) => void;
  mobile: string;
  setMobile: (mobile: string) => void;
  password: string;
  setPassword: (password: string) => void;
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
  isLoading: boolean;
  handleLogin: () => Promise<void>;
  isFormValid: boolean;
  error: string | null;
}

export const useLogin = ({
  onSuccess,
  onClose,
  redirectTo,
  onClientInactive,
  onClientDeactivated,
}: UseLoginProps): UseLoginReturn => {
  const [loginType, setLoginType] = React.useState<"mobile" | "email">(
    "mobile",
  );
  const [email, setEmail] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { fetchClientData, setClientData } = useClientStore();
  const t = useTranslations("validation.AUTH_ERRORS");

  const loginValue = loginType === "email" ? email : mobile;
  const isFormValid = !!loginValue && !!password;

  const saveUserData = (userData: LoginUserData, rememberMe: boolean) => {
    // Save bearer token
    if (userData.bearerToken) {
      if (rememberMe) {
        setCookie("authToken", userData.bearerToken, 50);
      } else {
        setCookie("authToken", userData.bearerToken);
      }
    }

    // Save user data with all available fields from login response
    if (userData.clientId) {
      const userDataToSave = {
        clientId: userData.clientId,
        clientName: userData.clientName,
        creationDate: userData.creationDate,
        mobile: userData.mobile,
        email: userData.email,
        country: userData.country,
        city: userData.city,
        status: userData.status,
        bearerToken: userData.bearerToken,
      };

      if (rememberMe) {
        setCookie("userData", JSON.stringify(userDataToSave), 30);
      } else {
        setCookie("userData", JSON.stringify(userDataToSave));
      }
    }
  };

  const handleLogin = async () => {
    if (!isFormValid) {
      toast.error(t("FILL_ALL_FIELDS") || "يرجى ملء جميع الحقول");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const payload = {
        mobile: loginValue,
        password,
      };

      const data = await loginUser(payload);

      // Check if login was successful (message: "SUCCESS" or status: true)
      if (data.data && (data.message === "SUCCESS" || data.status)) {
        // Save user data to cookies
        saveUserData(data.data, rememberMe);

        // Update Zustand store immediately with login data to avoid loading state in Header
        setClientData(data.data as any);

        // Call onSuccess callback
        onSuccess?.({
          id: String(data.data.clientId || "1"),
          email: data.data.email || loginValue,
        });

        // Show success message
        toast.success(t("LOGIN_SUCCESS") || "تم تسجيل الدخول بنجاح");

        // Fetch and save complete client data to Zustand store after successful login
        try {
          await fetchClientData();
        } catch (error) {
          // If fetching client data fails, it's not critical - we already have login data
          console.warn("Failed to fetch complete client data:", error);
        }

        // Close dialog
        onClose();
      } else {
        throw new Error(data.message || "LOGIN_FAILED");
      }
    } catch (err) {
      console.log("Login error:", err);
      const errorMessage = err instanceof Error ? err.message : "";

      // Check if error is CLIENT_INACTIVE
      if (errorMessage === "CLIENT_INACTIVE" && onClientInactive) {
        // Show toast explaining the issue
        const translatedMessage =
          t("CLIENT_INACTIVE") || "هذه البيانات غير مؤكدة برجاء تأكيد الحساب";
        toast.error(translatedMessage);

        // Determine channel based on login type
        const channel: "EMAIL" | "WHATSAPP" =
          loginType === "email" ? "EMAIL" : "WHATSAPP";
        // Call callback to handle inactive client
        onClientInactive(
          loginType === "email" ? email : undefined,
          loginType === "mobile" ? mobile : undefined,
          channel,
        );
      } else if (errorMessage === "CLIENT_DEACTIVATED" && onClientDeactivated) {
        // Determine channel based on login type
        const channel: "EMAIL" | "WHATSAPP" =
          loginType === "email" ? "EMAIL" : "WHATSAPP";
        // Call callback to handle deactivated client
        onClientDeactivated(
          loginType === "email" ? email : undefined,
          loginType === "mobile" ? mobile : undefined,
          channel,
        );
      } else {
        const errorKey =
          errorMessage === "Bad credentials" ? "BAD_CREDENTIALS" : errorMessage;
        const translatedMessage = errorKey
          ? t(errorKey as any)
          : t("LOGIN_FAILED");
        setError(translatedMessage);
        toast.error(translatedMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginType,
    setLoginType,
    email,
    setEmail,
    mobile,
    setMobile,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    handleLogin,
    isFormValid,
    error,
  };
};
