'use client';

/**
 * Available Services Component
 * Displays and allows selection of additional services for booking
 */

import React, { useEffect, useState } from 'react';
import { Checkbox } from '@/app/(components)/ui/checkbox';
import { Label } from '@/app/(components)/ui/label';
import { URL } from '@/constants/api';
import type { AvailableServicesProps, Service, ServicesApiResponse } from './AvailableServices.types';

const AvailableServices: React.FC<AvailableServicesProps> = ({
  locale,
  selectedServices = [],
  onServiceToggle,
  onServicesLoaded,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [internalSelectedServices, setInternalSelectedServices] = useState<number[]>(selectedServices);

  // Use internal state if onServiceToggle is not provided
  const currentSelectedServices = onServiceToggle ? selectedServices : internalSelectedServices;
  const handleToggle = onServiceToggle || ((serviceId: number) => {
    setInternalSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  });

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoadingServices(true);
      try {
        const response = await fetch(URL('/services/by-type?serviceAvailability=NORMAL'));

        const json: ServicesApiResponse = await response.json();

        console.log(json);
        if (json.message === 'SUCCESS' && json.data) {
          setServices(json.data);
        }
        onServicesLoaded?.(true);
      } catch (error) {
        console.error('Error fetching services:', error);
        onServicesLoaded?.(true); // Still mark as loaded even on error
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="mt-6 ">
      <h3 className="text-lg font-semibold mb-4 ">
        {locale === 'ar' ? 'أختر من الخدمات المتاحة:' : 'Choose from available services:'}
      </h3>
      {isLoadingServices ? (
        <div className="text-center py-4 text-gray-500">
          {locale === 'ar' ? 'جاري تحميل الخدمات...' : 'Loading services...'}
        </div>
      ) : services.length > 0 ? (
        <div className=" bg-[#ECEEF2]  px-4 rounded-lg overflow-hidden">
          {services.map((service, index) => {
            const isSelected = currentSelectedServices.includes(service.serviceId);
            const serviceName = locale === 'ar' ? service.nameArabic : service.nameEnglish;
            const servicePrice = service.price;
            const priceText = service.serviceType === 'DAILY'
              ? `${servicePrice.toFixed(2)} ${locale === 'ar' ? '﷼ / اليوم' : 'SAR / Day'}`
              : `${servicePrice.toFixed(2)} ${locale === 'ar' ? '﷼' : 'SAR'}`;
            const isLast = index === services.length - 1;

            return (
              <div
                key={service.serviceId}
                onClick={() => handleToggle(service.serviceId)}
                className={`flex items-center justify-between py-4 cursor-pointer hover:bg-gray-100 transition-colors ${!isLast ? 'border-b border-[#D7DDE8]' : ''}`}
              >
                <div className="flex gap-[6px]">
                  {/* Checkbox على اليمين (في RTL) */}
                  <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      id={`service-${service.serviceId}`}
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(service.serviceId)}
                      className="shrink-0 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    />
                  </div>

                  {/* اسم الخدمة في المنتصف */}
                  <div className="flex-1">
                    <Label
                      htmlFor={`service-${service.serviceId}`}
                      className="cursor-pointer text-sm md:text-base text-gray-900 block"
                    >
                      {serviceName || (locale === 'ar' ? 'أسم الخدمة بالكامل' : 'Full service name')}
                    </Label>
                  </div>

                </div>
                {/* السعر على اليسار (في RTL) */}
                <div className="text-sm md:text-base font-medium text-gray-900">
                  {priceText}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          {locale === 'ar' ? 'لا توجد خدمات متاحة' : 'No services available'}
        </div>
      )}
    </div>
  );
};

export default AvailableServices;
