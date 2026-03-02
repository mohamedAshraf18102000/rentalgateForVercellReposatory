"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { DialogWrapper } from "./ui/dialog-wrapper";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { sendContactMessage } from "@/lib/api/services/contact.service";
import { toast } from "sonner";

interface ContactUsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function ContactUsDialog({
  open,
  onOpenChange,
  trigger,
}: ContactUsDialogProps) {
  const t = useTranslations("contact");
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    mobile: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'ar';
      toast.error(locale === 'ar' ? 'يرجى إدخال الاسم بالكامل' : 'Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'ar';
      toast.error(locale === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email');
      return;
    }
    if (!formData.message.trim()) {
      const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'ar';
      toast.error(locale === 'ar' ? 'يرجى إدخال نص الرسالة' : 'Please enter your message');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'ar';
      toast.error(locale === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address');
      return;
    }

    setLoading(true);

    try {
      await sendContactMessage({
        messageName: formData.message,
        fullName: formData.fullName,
        mobile: formData.mobile || "",
        email: formData.email,
      });

      toast.success(t("form.success"));
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        message: "",
      });

      // Close dialog
      onOpenChange?.(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("form.error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <DialogWrapper
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      header={{
        mainTitle: t("title"),
      }}
      content={
        <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t("form.fullName")}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder={t("form.fullNamePlaceholder")}
            required
            disabled={loading}
          />

          <Input
            label={t("form.email")}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("form.emailPlaceholder")}
            required
            disabled={loading}
          />

          <Input
            label={t("form.mobile")}
            name="mobile"
            type="tel"
            value={formData.mobile}
            onChange={handleChange}
            placeholder={t("form.mobilePlaceholder")}
            disabled={loading}
          />

          <div className="space-y-1.5 w-full">
            <label className="text-sm font-medium text-foreground">
              {t("form.message")}
            </label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t("form.messagePlaceholder")}
              required
              disabled={loading}
              className="min-h-24"
            />
          </div>
        </form>
      }
      footer={
        <Button
          type="submit"
          form="contact-form"
          loading={loading}
          disabled={loading}
          className="mt-4 w-full"
          size="lg"
        >
          {loading ? t("form.sending") : t("form.send")}
        </Button>
      }
    />
  );
}

