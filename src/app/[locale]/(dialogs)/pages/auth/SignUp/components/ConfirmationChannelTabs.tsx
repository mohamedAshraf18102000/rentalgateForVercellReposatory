"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/ui";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

interface ConfirmationChannelTabsProps {
  value: "EMAIL" | "WHATSAPP";
  onValueChange: (value: "EMAIL" | "WHATSAPP") => void;
}

// WhatsApp Icon - Black version like Mail icon
const WhatsAppIconBlack: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8 14.6667C11.6818 14.6667 14.6667 11.6818 14.6667 8C14.6667 4.31818 11.6818 1.33333 8 1.33333C4.31818 1.33333 1.33333 4.31818 1.33333 8C1.33333 9.33548 1.77073 10.6065 2.54545 11.6364L1.33333 14.6667L4.36364 13.4545C5.39345 14.2293 6.66452 14.6667 8 14.6667Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M5.72545 8.25182L6.30609 7.53073C6.55073 7.22682 6.85327 6.94382 6.877 6.53909C6.88291 6.43695 6.81109 5.97805 6.66718 5.06023C6.61073 4.69953 6.27391 4.66698 5.98227 4.66698C5.60209 4.66698 5.41205 4.66698 5.22327 4.7532C4.98478 4.86216 4.73982 5.16855 4.68618 5.42518C4.64364 5.6283 4.67523 5.76825 4.73845 6.04809C5.00691 7.23682 5.63655 8.41091 6.613 9.38736C7.58945 10.3638 8.76355 10.9935 9.95227 11.2618C10.2321 11.3251 10.372 11.3567 10.5752 11.3142C10.8318 11.2605 11.1382 11.0156 11.2472 10.777C11.3334 10.5882 11.3334 10.3982 11.3334 10.018C11.3334 9.72636 11.3009 9.38955 10.9402 9.33309C10.0224 9.18918 9.56355 9.11736 9.46127 9.12327C9.05655 9.147 8.77355 9.44955 8.46964 9.69418L7.74855 10.2747"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

export const ConfirmationChannelTabs: React.FC<ConfirmationChannelTabsProps> = ({ 
  value, 
  onValueChange 
}) => {
  const t = useTranslations('auth.signUp.confirmationChannel');
  
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-foreground">
        {t('label')}
      </label>
      <Tabs 
        value={value} 
        onValueChange={(newValue) => onValueChange(newValue as "EMAIL" | "WHATSAPP")}
        className="login-tabs-container"
      >
        <TabsList className="login-tabs-list w-full">
          <TabsTrigger 
            value="EMAIL" 
            icon={<Mail className="h-4 w-4 login-tab-icon" />} 
            className="login-tab-trigger flex-1"
          >
            <span className="login-tab-text">{t('email')}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="WHATSAPP" 
            icon={<WhatsAppIconBlack className="h-4 w-4 login-tab-icon" />} 
            className="login-tab-trigger flex-1"
          >
            <span className="login-tab-text">{t('whatsapp')}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

