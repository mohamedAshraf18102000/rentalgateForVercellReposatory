'use client';

/**
 * Reservation Services Section Component
 * Displays the selected services for the reservation (read-only)
 */ 
import { PriceIcon } from '@/constants/icons';
import { formatPrice } from '../utils/formatters';
import { ReservationService } from '@/lib/api/reservation-details';
import { normalizeImageUrl } from '@/util/image';

interface ReservationServicesSectionProps {
  services: ReservationService[];
  locale: string;
}

export default function ReservationServicesSection({
  services,
  locale,
}: ReservationServicesSectionProps) {
  const isArabic = locale === 'ar';

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isArabic ? 'الخدمات المحددة:' : 'Selected Services:'}
      </h3>
      <div className="bg-[#ECEEF2] px-4 rounded-lg overflow-hidden">
        {services.map((service, index) => {
          const isLast = index === services.length - 1;
          const serviceName = isArabic ? service.nameArabic : service.nameEnglish;
          const servicePrice = service.price;
          const iconUrl = service.iconUrl ? normalizeImageUrl(service.iconUrl) : null;

          return (
            <div
              key={service.serviceId}
              className={`flex items-center justify-between py-4 ${!isLast ? 'border-b border-[#D7DDE8]' : ''}`}
            >
              <div className="flex items-center gap-3 flex-1">
           
                {/* Service Name */}
                <div className="flex-1">
                  <span className="text-sm md:text-base text-gray-900 block">
                    {serviceName}
                  </span>
                  {service.detailsEnglish || service.detailsArabic ? (
                    <span className="text-xs text-gray-600 block mt-1">
                      {isArabic ? service.detailsArabic : service.detailsEnglish}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Price */}
              <div className="text-sm md:text-base font-medium text-gray-900 flex items-center gap-1">
                {formatPrice(servicePrice > 0 ? servicePrice : 0)}
                <PriceIcon className="w-4 h-4" />
                {service.serviceType === 'DAILY' && (
                  <span className="text-sm text-gray-600">
                    {isArabic ? '/ يوم ' : '/ Day'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

