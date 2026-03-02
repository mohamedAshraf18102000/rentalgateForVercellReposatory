"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/ui";
import { Mail } from "lucide-react";
import { PhoneIcon } from "@/icons";
import { useTranslations } from "next-intl";

interface LoginTabsProps {
  value: "mobile" | "email";
  onValueChange: (value: "mobile" | "email") => void;
}

export const LoginTabs: React.FC<LoginTabsProps> = ({ value, onValueChange }) => {
  const t = useTranslations('auth.login.tabs');
  
  return (
    <Tabs 
      value={value} 
      onValueChange={(newValue) => onValueChange(newValue as "mobile" | "email")}
      className="login-tabs-container"
    >
      <TabsList className="login-tabs-list">
        <TabsTrigger 
          value="mobile" 
          icon={<PhoneIcon className="h-4 w-4 login-tab-icon" />}
          className="login-tab-trigger"
        >
          <span className="login-tab-text">{t('mobile')}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="email" 
          icon={<Mail className="h-4 w-4 login-tab-icon" />}
          className="login-tab-trigger"
        >
          <span className="login-tab-text">{t('email')}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

