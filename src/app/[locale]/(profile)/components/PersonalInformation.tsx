// "use client";

// import { ArrowIcon } from "@/constants/icons";
// import { useTranslations } from "next-intl";
// import { useParams } from "next/navigation";
// import { useClientStore } from "@/lib/api/stores";
// import { useDialog } from "../../(dialogs)";
// import { updateClientData } from "@/lib/api/services/client.service";
// import { toast } from "sonner";

// interface InfoRowProps {
//   label: string;
//   value: string;
//   field: string;
//   isHighlighted?: boolean;
//   lastRow?: boolean;
//   onEdit?: (field: string, label: string, value: string) => void;
// }

// function InfoRow({
//   label,
//   value,
//   field,
//   isHighlighted = false,
//   lastRow = false,
//   onEdit,
// }: InfoRowProps) {
//   const params = useParams();
//   const locale = params.locale as string;
//   const isRTL = locale === "ar";

//   const handleClick = () => {
//     if (onEdit) {
//       onEdit(field, label, value);
//     }
//   };

//   return (
//     <>
//       <div
//         className={`flex items-center justify-between cursor-pointer py-5 hover:bg-gray-50 transition-colors flex-row-reverse ${isRTL ? "flex-row-reverse" : ""}`}
//         onClick={handleClick}
//       >
//         {/* Arrow Icon */}
//         <div className={`flex items-center gap-4 ${isRTL ? "ml-3" : "mr-3"}`}>
//           {/* Value */}
//           <div className={`flex-1  `}>
//             {isHighlighted ? (
//               <span className="inline-block bg-[#C0FFDD] text-[#024E3B] px-2 py-1 rounded-[6px] text-sm  ">
//                 {value}
//               </span>
//             ) : (
//               <span className="text-[15px] max-sm:text-[12px] font-medium text-[#595959]">
//                 {value}
//               </span>
//             )}
//           </div>
//           <ArrowIcon
//             className={`w-5 h-5 max-sm:w-4 max-sm:h-4 text-[#595959] ${isRTL ? "" : "rotate-180"}`}
//           />
//         </div>

//         {/* Label */}
//         <div className={`flex-1 `}>
//           <span className="text-[16px] max-sm:text-[14px] text-[#0D0D0D]">
//             {label}
//           </span>
//         </div>
//       </div>
//       {/* Separator */}
//       {!lastRow && <div className="h-px bg-[#ECEEF2]" />}
//     </>
//   );
// }

// function formatDate(dateString: string): string {
//   if (!dateString) return "";
//   try {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   } catch {
//     return dateString;
//   }
// }

// export default function PersonalInformation() {
//   const t = useTranslations("common");
//   const params = useParams();
//   const locale = params.locale as string;
//   const isRTL = locale === "ar";
//   const { clientData, fetchClientData } = useClientStore();
//   const { openDialog } = useDialog();

//   if (!clientData) {
//     return null;
//   }

//   // Format dates
//   const birthdate = formatDate(clientData.birthdate || "");
//   const licenseExpiry = formatDate(clientData.licenseExpiration || "");

//   // Get nationality (use Arabic name if available)
//   const nationality = clientData.nationality || "";

//   // Get ID Type from clientType
//   const getClientTypeLabel = (
//     clientType: string | number | null | undefined,
//   ): string => {
//     if (!clientType) return "";

//     // Handle string values (CITIZEN, VISITOR, RESIDENT)
//     const typeStr = String(clientType).toUpperCase();
//     switch (typeStr) {
//       case "CITIZEN":
//         return t("citizen");
//       case "VISITOR":
//         return t("visitor");
//       case "RESIDENT":
//         return t("resident");
//       default:
//         // Handle numeric values if needed (legacy support)
//         if (typeStr === "1") return t("citizen");
//         return typeStr;
//     }
//   };

//   const idType = getClientTypeLabel(clientData.clientType);

//   // Extract filename only from image path
//   const getImageFilename = (
//     imagePath: string | null | undefined,
//   ): string | undefined => {
//     if (!imagePath) return undefined;
//     // If it's already just a filename, return it
//     if (!imagePath.includes("/") && !imagePath.includes("\\")) {
//       return imagePath;
//     }
//     // Extract filename from URL or path
//     const parts = imagePath.split("/");
//     const filename = parts[parts.length - 1];
//     // Remove any query parameters
//     return filename.split("?")[0];
//   };

//   const handleEdit = (field: string, label: string, currentValue: string) => {
//     // Handle license image separately
//     if (field === "licensePhoto") {
//       openDialog("EditLicenseImage", {
//         currentImageUrl: (clientData as any).licenseNumber || null,
//         onSave: async (imageFilename: string) => {
//           try {
//             // Map field names to API field names
//             const updateData: Record<string, any> = {};

//             // Set licenseNumber to the uploaded filename
//             updateData.licenseNumber = imageFilename;

//             // Add other required fields from current data
//             updateData.firstName = clientData.firstName;
//             updateData.lastName = clientData.lastName;
//             updateData.mobile = clientData.mobile;
//             updateData.countryId = clientData.countryId || undefined;
//             updateData.address = clientData.address || "";
//             if (clientData.image) {
//               updateData.image = getImageFilename(clientData.image);
//             }
//             // Ensure cityId is included if it exists
//             if (clientData.cityId) {
//               updateData.cityId = clientData.cityId;
//             }

//             const response = await updateClientData(updateData);

//             console.log("Update response:", response);

//             // Check if response is successful (message: "SUCCESS" or status: true)
//             if (response.message === "SUCCESS" || response.status === true) {
//               const successMessage = t("updateSuccess");
//               console.log("Success message:", successMessage);
//               toast.success(successMessage);
//               // Refresh client data
//               await fetchClientData();
//             } else {
//               toast.error(
//                 response.message || t("updateError") || "فشل التحديث",
//               );
//             }
//           } catch (error) {
//             console.error("Update error:", error);
//             toast.error(
//               error instanceof Error
//                 ? error.message
//                 : t("updateError") || "فشل التحديث",
//             );
//           }
//         },
//       });
//       return;
//     }

//     openDialog("EditPersonalInfo", {
//       field,
//       label,
//       currentValue,
//       onSave: async (newValue: string) => {
//         try {
//           // Map field names to API field names
//           const updateData: Record<string, any> = {};

//           switch (field) {
//             case "email":
//               updateData.email = newValue;
//               break;
//             case "city":
//               // Note: cityId should be set from a city selection dialog
//               // For now, we keep the current cityId
//               if (clientData.cityId) {
//                 updateData.cityId = clientData.cityId;
//               }
//               // When updating city, send address as the new value
//               updateData.address = newValue || "";
//               break;
//             case "licenseExpiryDate":
//               // Convert DD/MM/YYYY to YYYY-MM-DD
//               const [day, month, year] = newValue.split("/");
//               if (day && month && year) {
//                 updateData.licenseExpiration = `${year}-${month}-${day}`;
//               }
//               break;
//             case "versionNumber":
//               // copyNum is not in the new API, so we skip it
//               break;
//             default:
//               // For other fields, you may need to add more cases
//               break;
//           }

//           // Add other required fields from current data
//           updateData.firstName = clientData.firstName;
//           updateData.lastName = clientData.lastName;
//           updateData.mobile = clientData.mobile;
//           updateData.countryId = clientData.countryId || undefined;
//           // Only set address if it wasn't already set (e.g., when updating city)
//           if (updateData.address === undefined) {
//             updateData.address = clientData.address || "";
//           }
//           if (clientData.image) {
//             updateData.image = getImageFilename(clientData.image);
//           }
//           // Ensure cityId is included if it exists
//           if (clientData.cityId && !updateData.cityId) {
//             updateData.cityId = clientData.cityId;
//           }
//           // Include licenseNumber if it exists
//           if ((clientData as any).licenseNumber) {
//             updateData.licenseNumber = getImageFilename(
//               (clientData as any).licenseNumber,
//             );
//           }

//           const response = await updateClientData(updateData);

//           console.log("Update response:", response);

//           // Check if response is successful (message: "SUCCESS" or status: true)
//           if (response.message === "SUCCESS" || response.status === true) {
//             const successMessage = t("updateSuccess");
//             console.log("Success message:", successMessage);
//             toast.success(successMessage);
//             // Refresh client data
//             await fetchClientData();
//           } else {
//             toast.error(response.message || t("updateError") || "فشل التحديث");
//           }
//         } catch (error) {
//           console.error("Update error:", error);
//           toast.error(
//             error instanceof Error
//               ? error.message
//               : t("updateError") || "فشل التحديث",
//           );
//         }
//       },
//     });
//   };

//   return (
//     <div className="mt-[24px]">
//       {/* Header */}
//       <h3
//         className={`text-[18px] font-bold text-[#1A1A1A] mb-4 ${isRTL ? "text-right" : "text-left"}`}
//       >
//         {t("personalInformation")}:
//       </h3>
//       <div className="referral-card-wrapper rounded-[18px]">
//         <div className="referral-card-inner rounded-[18px] overflow-hidden w-full h-full">
//           {/* Information Rows */}
//           <div className="space-y-0 px-3">
//             <InfoRow
//               label={t("nationality")}
//               value={nationality}
//               field="nationality"
//               // onEdit={handleEdit}
//             />
//             <InfoRow
//               label={t("dateOfBirth")}
//               value={birthdate}
//               field="dateOfBirth"
//               // onEdit={handleEdit}
//             />
//             <InfoRow
//               label={t("idType")}
//               value={idType}
//               field="idType"
//               // onEdit={handleEdit}
//             />
//             <InfoRow
//               label={t("idNumber")}
//               value={clientData.nationalId || ""}
//               field="idNumber"
//               // onEdit={handleEdit}
//             />
//             <InfoRow
//               label={t("licenseExpiryDate")}
//               value={licenseExpiry}
//               field="licenseExpiryDate"
//               onEdit={handleEdit}
//             />
//             {/* <InfoRow
//                             label={t("licensePhoto")}
//                             value={t("added")}
//                             isHighlighted={true}
//                             field="licensePhoto"
//                         /> */}
//             <InfoRow
//               label={t("email")}
//               value={clientData.email || ""}
//               field="email"
//               onEdit={handleEdit}
//             />
//             {clientData.address && (
//               <InfoRow
//                 label={t("address")}
//                 value={clientData.address || ""}
//                 field="address"
//                 onEdit={handleEdit}
//               />
//             )}
//             {/* License Image */}
//             {(clientData as any).licenseNumber && (
//               <InfoRow
//                 label={t("licensePhoto") || "صورة الرخصة"}
//                 value={locale === "ar" ? "تم أضافتها" : "Added"}
//                 field="licensePhoto"
//                 isHighlighted={true}
//                 onEdit={handleEdit}
//               />
//             )}
//             <InfoRow
//               label={t("versionNumber")}
//               value={clientData.copyNum || ""}
//               field="versionNumber"
//               // onEdit={handleEdit}
//               lastRow={true}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

const PersonalInformation = () => {
  return <div>PersonalInformation</div>;
};

export default PersonalInformation;
