'use client';

/**
 * Car Image Section Component
 * Displays the car image
 */ 

import Image from 'next/image';
import { normalizeImageUrl } from '@/util/image';

interface CarImageSectionProps {
  carImage: string;
  carName?: string;
}

export default function CarImageSection({ carImage, carName }: CarImageSectionProps) {
  const normalizedImageUrl = normalizeImageUrl(carImage);

  return (
    <div className="md:col-span-5 xl:col-span-4 md:sticky md:top-[100px] md:self-start md:z-10 order-1 md:order-3">
      <div className="relative bg-[#ECEEF2] rounded-[20px] overflow-hidden mx-auto w-full h-[300px] md:w-full md:h-[400px] border-3 border-white">
        <Image
          src={normalizedImageUrl}
          alt={carName || 'Car image'}
          fill
          className="object-contain w-full h-full"
          priority
        />
      </div>
    </div>
  );
}

