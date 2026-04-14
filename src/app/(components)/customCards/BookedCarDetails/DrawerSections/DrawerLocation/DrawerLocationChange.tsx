import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(components)";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";
import CountryPhone from "@/app/(components)/template/phone/CountryPhone";
import ProfileActionCard from "@/app/[locale]/(mainpages)/userProfile/components/ProfileActionCard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Building2,
  ChevronRight,
  LocateFixed,
  MapPin,
  MapPinPlusInside,
} from "lucide-react";
import { useEffect, useState } from "react";
import useUserAddreses from "@/hooks/api/useUserAddreses";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { addAddress } from "@/services/userProfile/addAddress.service";
import { deleteAddress } from "@/services/userProfile/useDeleteAddress.service";
import {
  userSavedLocationSchema,
  UserSavedLocationFormValues,
} from "@/schemas/userAddressSchema";
import type { UserAddress } from "@/types/userProfile/userAddress";
import {
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/(components)/ui/sheet";
import { useChangeReservationLocation } from "@/hooks/api/booking/useChangeBookingLocation";

interface DrawerLocationChangeProps {
  setShowLocationDetails: (show: boolean) => void;
  reservationId?: number;
  defaultLocationNames?: string[];
}

const DrawerLocationChange = ({
  setShowLocationDetails,
  reservationId,
  defaultLocationNames = [],
}: DrawerLocationChangeProps) => {
  const { mutate: changeReservationLocation, isPending: isChangingLocation } =
    useChangeReservationLocation();

  const [showAddForm, setShowAddForm] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const queryClient = useQueryClient();
  const { setLocation, latitude, longitude } = useLocationStore();
  const { data: userAddresses, isLoading: isLoadingAddresses } =
    useUserAddreses(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<UserSavedLocationFormValues>({
    resolver: zodResolver(userSavedLocationSchema),
    defaultValues: {
      addressName: "",
      addressType: "Home",
      street: "",
      buildingNo: "",
      floor: 0,
      flatNo: "",
      address: "",
      latitude: 0,
      longitude: 0,
      additionalInfo: "",
      mobile: "+966",
      notes: "",
    },
  });

  const { mutate: handleAddAddress, isPending } = useMutation({
    mutationFn: (values: UserSavedLocationFormValues) => addAddress(values),
    onSuccess: (data: UserAddress) => {
      toast.success("تم إضافة العنوان بنجاح");
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      setLocation(data.latitude, data.longitude, data.address);
      setShowAddForm(false);
      reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة العنوان");
    },
  });

  const onSubmit = (values: UserSavedLocationFormValues) => {
    handleAddAddress(values);
  };

  const normalizeText = (value: string) =>
    value.trim().replace(/\s+/g, " ").toLowerCase();

  const handleSaveLocation = () => {
    const selectedAddress = userAddresses?.find(
      (address) => address.addressId === selectedAddressId,
    );

    if (!selectedAddress) {
      toast.error("يرجى اختيار عنوان أولاً");
      return;
    }

    if (!reservationId) {
      toast.error("تعذر تحديد الحجز الحالي");
      return;
    }

    changeReservationLocation(
      {
        reservationId,
        receiveLatitude: selectedAddress.latitude,
        receiveLongitude: selectedAddress.longitude,
        deliverLatitude: selectedAddress.latitude,
        deliverLongitude: selectedAddress.longitude,
      },
      {
        onSuccess: () => {
          toast.success("تم حفظ الموقع بنجاح");
          setShowLocationDetails(false);
        },
        onError: (error: Error) => {
          toast.error(error.message || "حدث خطأ أثناء حفظ الموقع");
        },
      },
    );
  };

  useEffect(() => {
    if (!showAddForm) {
      reset();
    }
  }, [showAddForm, reset]);

  useEffect(() => {
    if (
      selectedAddressId ||
      !userAddresses?.length ||
      !defaultLocationNames.length
    ) {
      return;
    }

    const normalizedNames = defaultLocationNames
      .filter(Boolean)
      .map((name) => normalizeText(name));

    if (!normalizedNames.length) {
      return;
    }

    const matchingAddress =
      userAddresses.find((address) =>
        normalizedNames.some(
          (name) => normalizeText(address.addressName) === name,
        ),
      ) ||
      userAddresses.find((address) =>
        normalizedNames.some((name) => normalizeText(address.address) === name),
      ) ||
      userAddresses.find((address) =>
        normalizedNames.some((name) => {
          const normalizedAddressName = normalizeText(address.addressName);
          const normalizedAddress = normalizeText(address.address);
          return (
            normalizedAddressName.includes(name) ||
            name.includes(normalizedAddressName) ||
            normalizedAddress.includes(name) ||
            name.includes(normalizedAddress)
          );
        }),
      );

    if (matchingAddress) {
      setSelectedAddressId(matchingAddress.addressId);
    }
  }, [defaultLocationNames, selectedAddressId, userAddresses]);

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col bg-background animate-in fade-in slide-in-from-right duration-300"
      dir="rtl"
    >
      <SheetHeader className="mt-10 flex flex-row items-center gap-2 space-y-0 px-6 text-start">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => {
            if (showAddForm) {
              setShowAddForm(false);
              return;
            }
            setShowLocationDetails(false);
          }}
          aria-label="Back"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        <SheetTitle className="text-start text-xl">
          <p>
            {showAddForm ? "إضافة عنوان جديد" : "تعديل مكان الاستلام و التسليم"}
          </p>
        </SheetTitle>
      </SheetHeader>
      <form
        id="add-address-form"
        className="flex flex-1 flex-col min-h-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-1 flex-col px-6 pt-4 overflow-y-auto">
          {!showAddForm ? (
            <>
              <div className="w-full flex justify-end mb-3">
                <Button
                  type="button"
                  className="bg-transparent border-2 border-Grey200 hover:bg-transparent text-black text-sm!"
                  startIcon={<MapPinPlusInside className="w-5! h-5!" />}
                  onClick={() => setShowAddForm(true)}
                >
                  أضافة عنوان جديد
                </Button>
              </div>
              <div className="flex flex-col gap-3 mb-5">
                {isLoadingAddresses ? (
                  <div className="text-center py-10">
                    جاري تحميل العناوين...
                  </div>
                ) : userAddresses?.length === 0 ? (
                  <div className="text-center py-10 text-Grey600">
                    لا توجد عناوين مسجلة
                  </div>
                ) : (
                  userAddresses?.map((address) => {
                    return (
                      <ProfileActionCard
                        key={address.addressId}
                        active={selectedAddressId === address.addressId}
                        onClick={() => {
                          setSelectedAddressId(address.addressId);
                        }}
                        bg_gray
                        title={address.addressName}
                        description={address.address}
                      />
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="mb-5 space-y-4 px-1 scrollbar-hide">
              <div className="w-full my-2 h-[260px] rounded-xl overflow-hidden">
                <GoogleMapsLocation
                  onLocationChange={(lat, lng, address, isManual) => {
                    setValue("latitude", lat);
                    setValue("longitude", lng);
                    if (address && (isManual || !getValues("address"))) {
                      setValue("address", address);
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  {...register("addressName")}
                  labelClassName="text-base!"
                  className="text-sm! bg-Grey100!"
                  placeholder="مثال: المنزل، العمل"
                  label="اسم المكان:"
                  errorMessage={errors.addressName?.message}
                />
                <div className="flex flex-col gap-2">
                  <span className="text-base font-medium">نوع العنوان:</span>
                  <Controller
                    name="addressType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-Grey100! border-none! ">
                          <SelectValue placeholder="اختر نوع العنوان" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Home">منزل</SelectItem>
                          <SelectItem value="Work">عمل</SelectItem>
                          <SelectItem value="Other">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.addressType && (
                    <span className="text-xs text-StatusRed">
                      {errors.addressType.message}
                    </span>
                  )}
                </div>
              </div>

              <Input
                {...register("address")}
                startIcon={<MapPin />}
                labelClassName="text-base!"
                className="text-sm! bg-Grey100!"
                disabled
                placeholder="أدخل العنوان التفصيلي"
                label="العنوان بالتفصيل:"
                errorMessage={errors.address?.message}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  {...register("street")}
                  startIcon={<LocateFixed />}
                  labelClassName="text-base!"
                  className="text-sm! bg-Grey100!"
                  placeholder="اسم الحي / الشارع"
                  label="المنطقة: "
                  errorMessage={errors.street?.message}
                />
                <Input
                  {...register("buildingNo")}
                  startIcon={<Building2 />}
                  labelClassName="text-base!"
                  className="text-sm! bg-Grey100!"
                  placeholder="رقم المبني"
                  label="المبنى:"
                  errorMessage={errors.buildingNo?.message}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  {...register("floor", { valueAsNumber: true })}
                  type="number"
                  labelClassName="text-base!"
                  className="text-sm! bg-Grey100!"
                  placeholder="رقم الطابق"
                  label="الطابق:"
                  errorMessage={errors.floor?.message}
                />
                <Input
                  {...register("flatNo")}
                  labelClassName="text-base!"
                  className="text-sm! bg-Grey100!"
                  placeholder="رقم الشقة"
                  label="رقم الشقة:"
                  errorMessage={errors.flatNo?.message}
                />
              </div>

              <Controller
                name="mobile"
                control={control}
                render={({ field }) => (
                  <div className="w-full">
                    <CountryPhone
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      defaultCountry="sa"
                      labelClassName="text-base!"
                      inputClassName="text-sm! bg-Grey100!"
                      label="رقم الجوال:"
                      placeholder="أدخل رقم الجوال"
                      showValidation={true}
                      onValidationChange={setIsPhoneValid}
                    />
                    {errors.mobile && !isPhoneValid && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Input
                {...register("additionalInfo")}
                labelClassName="text-base!"
                className="text-sm! bg-Grey100!"
                placeholder="أي معلومات إضافية للوصول للموقع"
                label="معلومات إضافية:"
                errorMessage={errors.additionalInfo?.message}
              />

              <Input
                {...register("notes")}
                labelClassName="text-base!"
                className="text-sm! bg-Grey100!"
                placeholder="ملاحظات"
                label="ملاحظات:"
                errorMessage={errors.notes?.message}
              />
            </div>
          )}
        </div>

        <SheetFooter className="p-6 border-t mt-auto">
          <Button
            type="button"
            className="text-base! w-1/2 bg-transparent text-black border-2 border-Grey400 hover:bg-transparent"
            onClick={() => setShowLocationDetails(false)}
          >
            عرض حجوزاتي
          </Button>
          {showAddForm ? (
            <Button
              type="button"
              className="text-base! w-1/2"
              onClick={handleSaveLocation}
              disabled={showAddForm || !selectedAddressId || isChangingLocation}
            >
              {isChangingLocation ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
          ) : null}

          {showAddForm ? (
            <Button
              type="submit"
              className="text-base! w-1/2 border-2 "
              disabled={isPending}
            >
              {isPending ? "جاري الإضافة..." : "إضافة"}
            </Button>
          ) : null}
        </SheetFooter>
      </form>
    </div>
  );
};

export default DrawerLocationChange;
