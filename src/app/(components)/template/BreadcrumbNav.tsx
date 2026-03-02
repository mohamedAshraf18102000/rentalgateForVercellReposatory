"use client"

import * as React from 'react';
import { useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/app/(components)/ui/breadcrumb";

type BreadcrumbNavItem = {
    label: string;
    href: string;
    isCurrentPage?: boolean;
};

type BreadcrumbNavProps = {
    items: BreadcrumbNavItem[];
    className?: string;
};

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const SeparatorIcon = isRTL ? ChevronLeft : ChevronRight;

    return (
        <Breadcrumb className={className} >
            <BreadcrumbList className="text-white text-xs sm:text-sm [&>li>a]:text-white/90 [&>li>a]:hover:text-white [&>li>span]:text-white flex-wrap">
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbItem>
                            {item.isCurrentPage ? (
                                <BreadcrumbPage className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none underline">
                                    {item.label}
                                </BreadcrumbPage>
                            ) : (
                                <Link href={item.href} className="transition-colors hover:text-white text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                                    {item.label}
                                </Link>
                            )}
                        </BreadcrumbItem>
                        {index < items.length - 1 && (
                            <BreadcrumbSeparator className="[&>svg]:text-white/70">
                                <SeparatorIcon className="size-3 sm:size-3.5" />
                            </BreadcrumbSeparator>
                        )}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

