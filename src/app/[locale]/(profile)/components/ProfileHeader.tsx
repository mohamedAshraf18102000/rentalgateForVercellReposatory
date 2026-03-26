// "use client";

// import { useTranslations } from "next-intl";
// import { useParams } from "next/navigation";
// import { useClientStore } from "@/lib/api/stores";
// import { getUserDisplayName } from "@/app/(components)/navbar/utils";
// import { Edit } from "lucide-react";
// import Image from "next/image";
// import { PhoneIcon } from "@/constants/icons";
// import { useDialog } from "../../(dialogs)";
// import { updateClientData } from "@/lib/api/services/client.service";
// import { toast } from "sonner";
// import { useEffect, useRef } from "react";
// import { isAuthenticated } from "@/util/auth";

// export default function ProfileHeader() {
//     const t = useTranslations("profile");
//     const params = useParams();
//     const locale = params.locale as string;
//     const isRTL = locale === "ar";
//     const { clientData, fetchClientData, isLoading } = useClientStore();
//     const { openDialog } = useDialog();
//     const hasFetchedRef = useRef(false);

//     // Fetch client data when component mounts
//     useEffect(() => {
//         if (isAuthenticated() && !isLoading && !hasFetchedRef.current) {
//             hasFetchedRef.current = true;
//             fetchClientData();
//         }
//     }, [fetchClientData, isLoading]);

//     if (!clientData) {
//         return null;
//     }

//     const displayName = getUserDisplayName(clientData);
//     const userImage = clientData.image;
//     const mobile = clientData.mobile || "";

//     // Format phone number
//     const formatPhoneNumber = (phone: string) => {
//         if (!phone) return "";
//         // Remove any non-digit characters
//         const cleaned = phone.replace(/\D/g, "");
//         // Format as +966 XX XXX XXXX if starts with 966
//         if (cleaned.startsWith("966")) {
//             const rest = cleaned.substring(3);
//             return `+966 ${rest.substring(0, 2)} ${rest.substring(2, 5)} ${rest.substring(5)}`;
//         }
//         return phone;
//     };

//     // Extract filename only from image path
//     const getImageFilename = (imagePath: string | null | undefined): string | undefined => {
//         if (!imagePath) return undefined;
//         // If it's already just a filename, return it
//         if (!imagePath.includes('/') && !imagePath.includes('\\')) {
//             return imagePath;
//         }
//         // Extract filename from URL or path
//         const parts = imagePath.split('/');
//         const filename = parts[parts.length - 1];
//         // Remove any query parameters
//         return filename.split('?')[0];
//     };

//     const handleEdit = () => {
//         openDialog("EditBasicInfo", {
//             onSave: async (data) => {
//                 try {
//                     // Get image filename only
//                     const imageFilename = data.image
//                         ? getImageFilename(data.image)
//                         : getImageFilename(clientData.image);

//                     const updateData = {
//                         firstName: data.firstName,
//                         lastName: data.lastName,
//                         mobile: data.mobile,
//                         email: clientData.email,
//                         cityId: clientData.cityId || undefined,
//                         countryId: clientData.countryId || undefined,
//                         address: clientData.address || "",
//                         licenseExpiration: clientData.licenseExpiration,
//                         image: imageFilename,
//                     };

//                     const response = await updateClientData(updateData);

//                     // Check if response is successful (message: "SUCCESS" or status: true)
//                     if (response.message === "SUCCESS" || response.status === true) {
//                         toast.success(t("updateSuccess"));
//                         await fetchClientData();
//                     } else {
//                         toast.error(response.message || t("updateError"));
//                     }
//                 } catch (error) {
//                     console.error("Update error:", error);
//                     toast.error(error instanceof Error ? error.message : t("updateError"));
//                 }
//             },
//         });
//     };

//     return (
//         <div className="relative rounded-[16px] overflow-hidden bg-[#2C2C2C] h-[200px] md:h-[220px] flex items-center justify-center p-4 md:p-6 lg:p-8">
//             <Image
//                 src="/profile/bgProfile2.png"
//                 alt="Profile Header Background"
//                 width={1000}
//                 height={1000}
//                 quality={100}
//                 className="absolute top-0 left-0 w-full h-full object-fill"
//             />
//             {/* Edit Button */}
//             <button
//                 onClick={handleEdit}
//                 className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm`}
//                 aria-label={t("edit")}
//             >
//                 <Edit size={15} strokeWidth={1.5} className="text-white" />
//             </button>

//             <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full">
//                 {/* Profile Picture */}
//                 <div className="relative mb-3">
//                     <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-lg avatar-gradient-border">
//                         {userImage ? (
//                             <Image
//                                 src={userImage}
//                                 alt={displayName}
//                                 width={96}
//                                 height={96}
//                                 className="w-full h-full object-cover"
//                             />
//                         ) : (
//                             <div className="w-full h-full bg-gray-600 flex items-center justify-center">
//                                 <span className="text-white text-xl font-bold">
//                                     {displayName.charAt(0).toUpperCase()}
//                                 </span>
//                             </div>
//                         )}
//                     </div>

//                 </div>

//                 {/* User Name */}
//                 <h2 className="text-white text-lg md:text-xl font-bold mb-2">
//                     {displayName || t("defaultName")}
//                 </h2>

//                 {/* Phone Number */}
//                 {mobile && (
//                     <div className="flex items-center justify-center gap-2 text-white/90">
//                         <PhoneIcon width={18} height={18} className="text-white -mt-1" />
//                         <span className="text-sm md:text-base " dir="ltr">{formatPhoneNumber(mobile)}</span>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

const ProfileHeader = () => {
  return <div>ProfileHeader</div>;
};

export default ProfileHeader;
