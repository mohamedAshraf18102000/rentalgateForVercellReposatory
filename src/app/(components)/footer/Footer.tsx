'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Instagram, Facebook, Linkedin, MapPinned, Phone } from 'lucide-react';
import Marquee from 'react-fast-marquee';
import { StarIcon } from '@/constants/icons';
import { useSharedStore } from '@/lib/api/stores';
import { ContactUsDialog } from '../ContactUsDialog';

export default function Footer() {
  const t = useTranslations('common');
  const marqueeTexts = t.raw('footerMarqueeTexts') as string[];
  const locale = useLocale();
  const { sharedData } = useSharedStore();
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  // Get first contact from contacts array
  const contact = sharedData?.contacts?.[0];

  // Format phone number for Saudi Arabia
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, "");
    // Format as +966 XX XXX XXXX if starts with 966
    if (cleaned.startsWith("966")) {
      const rest = cleaned.substring(3);
      return `+966 ${rest.substring(0, 2)} ${rest.substring(2, 5)} ${rest.substring(5)}`;
    }
    // If already has +966, format it
    if (phone.startsWith("+966")) {
      const cleaned = phone.replace(/\D/g, "");
      const rest = cleaned.substring(3);
      return `+966 ${rest.substring(0, 2)} ${rest.substring(2, 5)} ${rest.substring(5)}`;
    }
    return phone;
  };

  return (
    <footer className="bg-[#1A1A1A] text-white mt-8 md:mt-[60px] pb-20 md:pb-0">
      {/* Orange Marquee Banner */}
      <div className="bg-primary py-2 md:py-3 overflow-hidden relative" dir='ltr'>
        <Marquee
          speed={50}
          gradient={false}
          pauseOnHover={true}
          direction={locale === 'ar' ? 'right' : 'left'}
          autoFill={true}
        >
          {marqueeTexts.map((text, i) => (
            <div key={i} className="flex items-center mx-4 md:mx-8" style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
              <span className="text-white text-xs md:text-sm font-medium" style={{ color: 'white' }}>
                {text}
              </span>
              <StarIcon className="ml-2 md:ml-4 text-white" />
            </div>
          ))}
        </Marquee>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-5">
        {/* Mobile Layout - Vertical Stack */}
        <div className="md:hidden flex flex-col items-center gap-6 py-4">
          {/* Logo & Brand - Centered */}
          <div className="flex flex-col items-center gap-3">
            <Link href={'/'} className="w-[60px] h-[60px] bg-white p-2 rounded-full">
              <Image
                src="/logo.png"
                alt="logo"
                width={60}
                height={60}
                className="w-full h-full object-contain"
              />
            </Link>
            <div className="flex flex-col items-center text-center">
              <h3 className="text-white text-xl font-bold">{t('companyName')}</h3>
              <p className="text-white text-sm">{t('carRental')}</p>
            </div>
          </div>

          {/* Social Media & Phone - Centered */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-4">
              {contact?.instagram && (
                <a 
                  href={contact.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={t('visitInstagram')}
                  className="text-white hover:text-orange-500 transition-colors"
                >
                  <Instagram className="w-6 h-6" aria-hidden="true" />
                </a>
              )}
              {contact?.facebook && (
                <a 
                  href={contact.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={t('visitFacebook')}
                  className="text-white hover:text-orange-500 transition-colors"
                >
                  <Facebook className="w-6 h-6" aria-hidden="true" />
                </a>
              )}
              {contact?.linkedin && (
                <a 
                  href={contact.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={t('visitLinkedIn')}
                  className="text-white hover:text-orange-500 transition-colors"
                >
                  <Linkedin className="w-6 h-6" aria-hidden="true" />
                </a>
              )}
              {contact?.twitter && (
                <a 
                  href={contact.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={t('visitTwitter')}
                  className="text-white hover:text-orange-500 transition-colors flex items-center justify-center"
                >
                  <svg fillRule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="x" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M921 912L601.11 445.75l.55.43L890.08 112H793.7L558.74 384 372.15 112H119.37l298.65 435.31-.04-.04L103 912h96.39L460.6 609.38 668.2 912zM333.96 184.73l448.83 654.54H706.4L257.2 184.73z"></path>
                  </svg>
                </a>
              )}
            </div>
            {contact?.phone && (
              <div className="text-white">
                <a href={`tel:${contact.phone}`} dir='ltr' target='_blank' rel="noopener noreferrer" className="text-sm text-white hover:text-orange-500 transition-colors">
                  {formatPhoneNumber(contact.phone)}
                </a>
              </div>
            )}
          </div>

          {/* Address - Centered */}
          <div className="flex items-start justify-center gap-2 max-w-sm px-4">
            <MapPinned className="w-5 h-5 text-white mt-0.5 shrink-0" strokeWidth={1} />
            <a href={`https://www.google.com/maps/place/%D9%85%D8%B1%D9%83%D8%B2+%D8%A7%D9%84%D8%B7%D8%A7%D8%B3%D8%A7%D9%86+%D8%A7%D9%84%D8%AA%D8%AC%D8%A7%D8%B1%D9%8A+%D8%A7%D9%84%D8%A5%D8%AF%D8%A7%D8%B1%D9%8A%E2%80%AD/@21.4346534,39.7879187,17z/data=!3m1!4b1!4m6!3m5!1s0x15c21b6ecfb7ab07:0xea55a137872519a4!8m2!3d21.4346484!4d39.7904936!16s%2Fg%2F11csrs7yrh?coh=277533&entry=tts&g_ep=EgoyMDI2MDExMy4wIPu8ASoKLDEwMDc5MjA2OUgBUAM%3D&skid=57f2aff0-9d87-4d04-a03e-7c218c1cf69b`} target='_blank' rel="noopener noreferrer" className="text-white text-sm leading-relaxed text-center">
              {t('mainBranchAddress')}
            </a>
          </div>
        </div>

        {/* Desktop Layout - Grid */}
        <div className="hidden md:grid grid-cols-3 gap-8 py-8">
          {/* Right Column - Logo & Brand */}
          <div className="flex items-center gap-4 justify-start">
            <Link href={'/'} className="w-[60px] h-[60px] bg-white p-2 rounded-full shrink-0">
              <Image
                src="/logo.png"
                alt="logo"
                width={60}
                height={60}
                className="w-full h-full object-contain"
              />
            </Link>
            <div className="flex flex-col">
              <h3 className="text-white text-xl font-bold mb-1">{t('companyName')}</h3>
              <p className="text-white text-sm">{t('carRental')}</p>
            </div>
          </div>

          {/* Middle Column - Social Media & Phone */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
              {contact?.instagram && (
                <a 
                  href={contact.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={t('visitInstagram')}
                  className="text-white hover:text-orange-500 transition-colors"
                >
                  <Instagram className="w-6 h-6" aria-hidden="true" />
                </a>
              )}
              {contact?.facebook && (
                <a 
                  href={contact.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={t('visitFacebook')}
                  className="text-white hover:text-orange-500 transition-colors"
                >
                  <Facebook className="w-6 h-6" aria-hidden="true" />
                </a>
              )}
              {contact?.linkedin && (
                <a 
                  href={contact.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={t('visitLinkedIn')}
                  className="text-white hover:text-orange-500 transition-colors"
                >
                  <Linkedin className="w-6 h-6" aria-hidden="true" />
                </a>
              )}
              {contact?.twitter && (
                <a 
                  href={contact.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={t('visitTwitter')}
                  className="text-white hover:text-orange-500 transition-colors flex items-center justify-center"
                >
                  <svg fillRule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="x" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M921 912L601.11 445.75l.55.43L890.08 112H793.7L558.74 384 372.15 112H119.37l298.65 435.31-.04-.04L103 912h96.39L460.6 609.38 668.2 912zM333.96 184.73l448.83 654.54H706.4L257.2 184.73z"></path>
                  </svg>
                </a>
              )}
            </div>
            {contact?.phone && (
              <div className="text-white">
                <a href={`tel:${contact.phone}`} dir='ltr' target='_blank' rel="noopener noreferrer" className="text-sm text-white hover:text-orange-500 transition-colors">
                  {formatPhoneNumber(contact.phone)}
                </a>
              </div>
            )}
          </div>

          {/* Left Column - Address */}
          <div className="flex items-start gap-3 px-8">
            <MapPinned className="w-5 h-5 text-white mt-1 shrink-0" strokeWidth={1} />
            <a href={`https://www.google.com/maps/place/%D9%85%D8%B1%D9%83%D8%B2+%D8%A7%D9%84%D8%B7%D8%A7%D8%B3%D8%A7%D9%86+%D8%A7%D9%84%D8%AA%D8%AC%D8%A7%D8%B1%D9%8A+%D8%A7%D9%84%D8%A5%D8%AF%D8%A7%D8%B1%D9%8A%E2%80%AD/@21.4346534,39.7879187,17z/data=!3m1!4b1!4m6!3m5!1s0x15c21b6ecfb7ab07:0xea55a137872519a4!8m2!3d21.4346484!4d39.7904936!16s%2Fg%2F11csrs7yrh?coh=277533&entry=tts&g_ep=EgoyMDI2MDExMy4wIPu8ASoKLDEwMDc5MjA2OUgBUAM%3D&skid=57f2aff0-9d87-4d04-a03e-7c218c1cf69b`} target='_blank' rel="noopener noreferrer" className="text-white text-sm leading-relaxed">
              {t('mainBranchAddress')}
            </a>
          </div>
        </div>

      </div>
      {/* Bottom Copyright Section */}
      <div className="border-t border-white/20  py-6 w-full">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright - Centered on mobile */}
          <div className="text-white text-xs md:text-sm text-center md:text-left">
            {t('copyrightText')}
          </div>

          {/* Navigation Links - Centered on mobile */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-white text-xs md:text-sm">
            <Link href="/branches" className="hover:text-orange-500 transition-colors underline">
              {t('ourBranches')}
            </Link>
            <Link href="/cars" className="hover:text-orange-500 transition-colors underline">
              {t('cars')}
            </Link>
            <button
              onClick={() => setIsContactDialogOpen(true)}
              className="hover:text-orange-500 transition-colors underline cursor-pointer bg-transparent border-none p-0 text-inherit"
            >
              {t('talkToUs')}
            </button>
          </div>
        </div>
      </div>

      {/* Contact Us Dialog */}
      <ContactUsDialog
        open={isContactDialogOpen}
        onOpenChange={setIsContactDialogOpen}
      />
    </footer>
  );
}

