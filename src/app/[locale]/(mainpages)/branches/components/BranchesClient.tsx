// /**
//  * BranchesClient Component
//  * Main client component for branches page
//  * Manages state and displays city/branch selection with map
//  */

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useTranslations } from 'next-intl';
// import { useSharedStore } from '@/lib/api/stores/shared.store';
// import { useBranchesData } from '../hooks/useBranchesData';
// import { CityPanel } from './CityPanel';
// import { BranchesMap } from './BranchesMap';
// import type { Branch } from '../types/branch.types';

// interface BranchesClientProps {
//   locale: string;
// }

// export const BranchesClient: React.FC<BranchesClientProps> = ({ locale }) => {
//   const t = useTranslations('common');
//   const { sharedData, fetchSharedData } = useSharedStore();

//   const {
//     branchesData,
//     allBranches,
//     isLoading,
//     fetchCityBranches,
//     fetchAllBranches,
//   } = useBranchesData();

//   const [openedCityId, setOpenedCityId] = useState<number | null>(null);
//   const [activeBranchId, setActiveBranchId] = useState<number | null>(null);
//   const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

//   // Fetch shared data (includes cities)
//   useEffect(() => {
//     if (!sharedData) {
//       fetchSharedData();
//     }
//   }, [sharedData, fetchSharedData]);

//   // Fetch all branches once cities are loaded
//   useEffect(() => {
//     if (sharedData && sharedData.city && sharedData.city.length > 0) {
//       fetchAllBranches(sharedData.city);
//     }
//   }, [sharedData, fetchAllBranches]);

//   // Handle city click
//   const handleCityClick = (cityId: number) => {
//     if (openedCityId === cityId) {
//       // Close if already open
//       setOpenedCityId(null);
//       setActiveBranchId(null);
//       setSelectedBranch(null);
//     } else {
//       // Open new city and fetch its branches
//       setOpenedCityId(cityId);
//       setActiveBranchId(null);
//       setSelectedBranch(null);
//       fetchCityBranches(cityId);
//     }
//   };

//   // Handle branch click
//   const handleBranchClick = (branch: Branch) => {
//     if (activeBranchId === branch.branchId) {
//       // Close if already active
//       setActiveBranchId(null);
//       setSelectedBranch(null);
//     } else {
//       // Activate new branch
//       setActiveBranchId(branch.branchId);
//       setSelectedBranch(branch);
//     }
//   };

//   // Get cities from shared data
//   const cities = sharedData?.city || [];

//   return (
//     <div>
//       {/* Screen reader only heading */}
//       <h1 className="sr-only">
//         {locale === 'ar'
//           ? 'فروعنا - رينتال جيت لتأجير السيارات'
//           : 'Our Branches - Rental Gate Car Rental'
//         }
//       </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
//           {/* Cities & Branches List - Shows second on mobile, first on desktop */}
//           <div className="lg:col-span-5 col-span-12 mt-4 md:mt-[30px] order-1 lg:order-1 px-4 md:px-6 lg:px-[50px]">
//             <div className="lg:sticky lg:top-24">
//               {/* Title */}
//               <div className="mb-4 md:mb-6">
//                 <h2 className="text-2xl md:text-3xl font-bold text-foreground">
//                   {locale === 'ar' ? 'فروعنا' : 'Our Branches'}
//                 </h2>
//                 <p className="text-muted-foreground mt-2 text-xs md:text-sm">
//                   {locale === 'ar'
//                     ? 'اختر المدينة لعرض الفروع المتاحة'
//                     : 'Select a city to view available branches'
//                   }
//                 </p>
//               </div>

//               {/* Cities List */}
//               <div className="space-y-2 pr-2">
//                 {cities.length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
//                     <p className="text-muted-foreground">
//                       {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
//                     </p>
//                   </div>
//                 ) : (
//                   cities.map((city) => (
//                     <CityPanel
//                       key={city.cityId}
//                       city={city}
//                       branches={openedCityId === city.cityId ? branchesData : []}
//                       locale={locale}
//                       isOpen={openedCityId === city.cityId}
//                       activeBranchId={activeBranchId}
//                       onCityClick={handleCityClick}
//                       onBranchClick={handleBranchClick}
//                     />
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//           {/* Map Section - Shows first on mobile, second on desktop */}
//           <div className="col-span-12 lg:col-span-7 order-2 lg:order-2 px-4 md:px-0">
//             <div className="h-[400px] md:h-[500px] lg:h-[calc(100vh-140px)] w-full overflow-hidden rounded-lg md:rounded-none">
//               <BranchesMap
//                 branches={openedCityId ? branchesData : allBranches}
//                 selectedBranch={selectedBranch}
//                 locale={locale}
//               />
//             </div>
//           </div>
//         </div>
     
//     </div>
//   );
// };

// export default BranchesClient;


const BranchesClient = () => {
  return (
    <div>BranchesClient</div>
  )
}

export default BranchesClient