import Image from "next/image";
import { Link } from '@/i18n/routing';
import { Button } from '@/app/(components)/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BreadcrumbNav } from './BreadcrumbNav';

type BreadcrumbNavItem = {
    label: string;
    href: string;
    isCurrentPage?: boolean;
};

type HeaderPageProps = {
    imageSrc: string;
    imageAlt: string;
    backButtonHref: string;
    breadcrumbItems: BreadcrumbNavItem[];
    locale: string;
    className?: string;
    onBackClick?: () => void;
};

export function HeaderPage({
    imageSrc,
    imageAlt,
    backButtonHref,
    breadcrumbItems,
    locale,
    className,
    onBackClick,
}: HeaderPageProps) {
    return (
        <div className={`relative ${className || ''}`}>
            <Image 
                src={imageSrc} 
                alt={imageAlt} 
                className="w-full h-[200px] max-sm:h-[121px] md:h-full object-cover max-sm:object-none" 
                width={1000} 
                height={1000} 
            />
            <div className={`absolute bottom-[42px]  max-sm:bottom-4 ${locale === 'ar' ? 'right-5 sm:right-4' : 'left-2 sm:left-4'} flex items-center gap-2 sm:gap-4 z-10 flex-wrap`}>
                {onBackClick ? (
                    <Button
                        variant="ghost"
                        className="bg-white/90 hover:bg-white rounded-[8px] sm:rounded-[10px] h-8 w-8 max-sm:h-6 max-sm:w-6 p-0"
                        size="sm"
                        onClick={onBackClick}
                    >
                        <ArrowLeft className={`h-3 w-3 sm:h-4 sm:w-4 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                    </Button>
                ) : (
                    <Link href={backButtonHref}>
                        <Button
                            variant="ghost"
                            className="bg-white/90 hover:bg-white rounded-[8px] sm:rounded-[10px] h-8 w-8 max-sm:h-7 max-sm:w-7 p-0"
                            size="sm"
                        >
                            <ArrowLeft className={`h-3 w-3 sm:h-4 sm:w-4 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                        </Button>
                    </Link>
                )}
                <div className="hidden sm:block">
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
                {/* Mobile Breadcrumb - Simplified */}
                <div className="sm:hidden">
                    <BreadcrumbNav 
                        items={breadcrumbItems.length > 2 ? [breadcrumbItems[0], breadcrumbItems[breadcrumbItems.length - 1]] : breadcrumbItems} 
                    />
                </div>
            </div>
        </div>
    );
}
