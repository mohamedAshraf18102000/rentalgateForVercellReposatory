// ============================================================================
// Components - MobileHeader
// ============================================================================

'use client';

import { useLocale } from 'next-intl';
import { Logo } from './Logo';
import { Link } from '@/i18n/routing';

export const MobileHeader: React.FC = () => {
    const locale = useLocale();


    return (
        <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-[60px]">

            {/* Main Header */}
            <div className="flex items-center justify-start px-4 h-14 py-8 bg-white text-white relative shadow-sm">
                {/* Center - Title and Logo */}
                <div className={`flex items-center  gap-3  `}>
                    {/* Logo */}
                    <div className="w-[45px] bg-white h-[45px] flex items-center justify-center   z-10 rounded-full navbar-logo-shadow-mobile">
                        <Logo href="/" src="/logo.avif" alt="logo" className="w-full h-full bg-white p-1.5 rounded-full" />
                    </div>
                    <Link href="/" className="flex flex-col items-center">
                        <h1 className="text-[#1A1A1A] font-bold text-lg leading-tight">
                            {locale === 'ar' ? 'المـــــــقــــــــــام' : 'Al Maqam'}
                        </h1>
                        <p className="text-[#1A1A1A]/80 text-[14px] leading-tight">
                            {locale === 'ar' ? 'لتأجير السيارات' : 'Car Rental'}
                        </p>
                    </Link>
                </div>
            </div>
        </header>
    );
};
