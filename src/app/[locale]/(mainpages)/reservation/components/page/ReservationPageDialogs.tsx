import ReservationDrawer from "../reservationDrawer/ReservationDrawer";
import UpdateUserSavedLocationDialog from "@/app/[locale]/(mainpages)/userProfile/components/userDialog/UpdateUserSavedLocationDialog";
import { CalculateQuotePriceResponse } from "@/services/calculateQuotePrice/calculateQuotePrice.service";
import { ReservationFormData } from "@/lib/stores/useBookedCarDetailsStore";
import { UserAddress } from "@/types/userProfile/userAddress";

interface ReservationPageDialogsProps {
  isDrawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
  calculatedQuotePricingData?: CalculateQuotePriceResponse;
  onCalculateQuote: () => void;
  isCalculating: boolean;
  showSaveAddressDialog: boolean;
  onAddressDialogOpenChange: (open: boolean) => void;
  formData: ReservationFormData;
  onAddressSaveSuccess: (address: UserAddress) => void;
}

const ReservationPageDialogs = ({
  isDrawerOpen,
  onDrawerOpenChange,
  calculatedQuotePricingData,
  onCalculateQuote,
  isCalculating,
  showSaveAddressDialog,
  onAddressDialogOpenChange,
  formData,
  onAddressSaveSuccess,
}: ReservationPageDialogsProps) => {
  return (
    <>
      <ReservationDrawer
        open={isDrawerOpen}
        onOpenChange={onDrawerOpenChange}
        reservationData={calculatedQuotePricingData}
        onCalculateQuote={onCalculateQuote}
        isCalculating={isCalculating}
      />
      <UpdateUserSavedLocationDialog
        open={showSaveAddressDialog}
        setOpen={onAddressDialogOpenChange}
        initialShowAddForm={true}
        addFormOnlyMode={true}
        initialLat={formData.pickupLat ?? undefined}
        initialLng={formData.pickupLong ?? undefined}
        initialAddress={formData.pickupName || undefined}
        onSuccess={onAddressSaveSuccess}
      />
    </>
  );
};

export default ReservationPageDialogs;
