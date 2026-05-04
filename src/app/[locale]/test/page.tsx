"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  reservationSchema,
  ReservationFormValues,
} from "@/lib/validations/reservationSchema";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { buildInitialReservationValues } from "@/app/[locale]/(mainpages)/reservation/components/form/stepContentFormValues";
import StepTwo from "@/app/[locale]/(mainpages)/reservation/components/form/StepTwo";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { useClientStore } from "@/lib/api/stores";

export default function TestPage() {
  const { formData } = useBookedCarDetailsStore();
  const { filters } = useUserPreferedFiltersStore();

  const {
    control,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: buildInitialReservationValues({
      formData,
      filters,
      isForOtherReservation: false,
    }),
  });

  const { clientData } = useClientStore();

  console.log("client Data", clientData);

  return (
    <WrapperContainer exceedNav className="container max-w-3xl p-8 bg-white">
      <StepTwo
        control={control}
        errors={errors}
        setValue={setValue}
        trigger={trigger}
      />
    </WrapperContainer>
  );
}

// <div>
// <DatePicker
//   className="bg-[#eceef2]! rounded-lg"
//   label={"تاريخ انتهاء "}
//   value={new Date()}
//   onChange={() => {}}
//   fromYear={new Date().getFullYear()}
//   toYear={new Date().getFullYear() + 20}
// />
// </div>
