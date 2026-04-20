import {
  Button,
  DialogWrapper,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(components)";
import ProfileActionCard from "../ProfileActionCard";
import {
  Building2,
  ChevronRight,
  LocateFixed,
  MapPin,
  MapPinPlusInside,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CountryPhone from "@/app/(components)/template/phone/CountryPhone";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userSavedLocationSchema,
  UserSavedLocationFormValues,
} from "@/schemas/userAddressSchema";
import { addAddress } from "@/services/userProfile/addAddress.service";
import { deleteAddress } from "@/services/userProfile/useDeleteAddress.service";
import { toast } from "sonner";
import useUserAddreses from "@/hooks/api/useUserAddreses";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { UserAddress } from "@/types/userProfile/userAddress";

interface UpdateUserSavedLocationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialShowAddForm?: boolean;
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  onSuccess?: (address: UserAddress) => void;
}

const UpdateUserSavedLocationDialog = ({
  open,
  setOpen,
  initialShowAddForm = false,
  initialLat: propLat,
  initialLng: propLng,
  initialAddress,
  onSuccess,
}: UpdateUserSavedLocationDialogProps) => {
  const [showAddForm, setShowAddForm] = useState(initialShowAddForm);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const queryClient = useQueryClient();

  const { setLocation, latitude, longitude } = useLocationStore();

  const { data: userAddresses, isLoading: isLoadingAddresses } =
    useUserAddreses(open);

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
      address: initialAddress || "",
      latitude: propLat || 0,
      longitude: propLng || 0,
      additionalInfo: "",
      mobile: initialAddress ? "" : "+966",
      notes: "",
    },
  });

  const { mutate: handleAddAddress, isPending } = useMutation({
    mutationFn: (values: UserSavedLocationFormValues) => addAddress(values),
    onSuccess: (data: UserAddress) => {
      toast.success("تم إضافة العنوان بنجاح");
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      onSuccess?.(data);
      setShowAddForm(false);
      reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة العنوان");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (addressId: string | number) => deleteAddress(addressId),
    onSuccess: () => {
      toast.success("تم حذف العنوان بنجاح");
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف العنوان");
    },
  });

  const { mutate: handleDeleteAddress, isPending: isDeleting } = deleteMutation;

  const handleDelete = (addressId: string | number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا العنوان؟")) {
      handleDeleteAddress(addressId);
    }
  };

  const onSubmit = (values: UserSavedLocationFormValues) => {
    handleAddAddress(values);
  };

  useEffect(() => {
    if (open) {
      if (initialShowAddForm) {
        setShowAddForm(true);
        if (propLat && propLng) {
          setValue("latitude", propLat);
          setValue("longitude", propLng);
        }
        if (initialAddress) {
          setValue("address", initialAddress);
        }
      }
    } else {
      setShowAddForm(false);
      reset();
    }
  }, [
    open,
    initialShowAddForm,
    reset,
    propLat,
    propLng,
    initialAddress,
    setValue,
  ]);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      size="lg"
      closeOnOutsideClick={false}
      scrollableContent={true}
      maxScrollHeight="500px"
      header={{
        mainTitle: (
          <div className="flex items-center justify-between w-full">
            {showAddForm && (
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-Grey100 rounded-full transition-all active:scale-95"
                aria-label="Back"
              >
                <ChevronRight className="w-6 h-6 text-black" />
              </button>
            )}
            <span className="text-black  flex-1 text-center font-bold">
              {showAddForm ? "إضافة عنوان جديد" : "العناوين المسجلة"}
            </span>
            {showAddForm && <div className="w-8" />}
          </div>
        ),
      }}
      content={
        <div
          key={showAddForm ? "add-form" : "location-list"}
          className="animate-page-in h-full"
        >
          {!showAddForm ? (
            <div className="px-1">
              <div className="w-full flex justify-end">
                <Button
                  className="bg-transparent border-2 border-Grey200 hover:bg-transparent text-black mb-3 text-sm!"
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
                    const beingDeleted =
                      isDeleting &&
                      deleteMutation.variables === address.addressId;
                    return (
                      <ProfileActionCard
                        customIcon={
                          beingDeleted ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash className="w-4 h-4 text-red-500" />
                          )
                        }
                        trash
                        onIconClick={() => handleDelete(address.addressId)}
                        onClick={() => {
                          setLocation(
                            address.latitude,
                            address.longitude,
                            address.address,
                          );
                        }}
                        bg_gray
                        active={
                          address.latitude === latitude &&
                          address.longitude === longitude
                        }
                        key={address.addressId}
                        title={address.addressName}
                        description={address.address}
                      />
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <form
              id="add-address-form"
              onSubmit={handleSubmit(onSubmit)}
              className="mb-5 space-y-4 px-1 scrollbar-hide"
            >
              <div className="w-full my-5 h-[300px] rounded-xl overflow-hidden">
                <GoogleMapsLocation
                  initialLat={propLat || undefined}
                  initialLng={propLng || undefined}
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
            </form>
          )}
        </div>
      }
      footer={
        <div className="flex w-full justify-end gap-2">
          {!showAddForm ? (
            <>
              <Button
                size="lg"
                className="w-fit text-black hover:bg-white underline py-3 border-none px-5 bg-white text-base font-bold"
                onClick={() => setOpen(false)}
              >
                إغلاق
              </Button>
            </>
          ) : (
            <>
              <Button
                size="lg"
                className="w-fit text-black hover:bg-white underline py-3 border-none px-5 bg-white text-base font-bold"
                onClick={() => setShowAddForm(false)}
                disabled={isPending}
              >
                إلغاء
              </Button>
              <Button
                size="lg"
                type="submit"
                form="add-address-form"
                className="w-fit text-white py-3 border-none px-10 text-base font-bold"
                disabled={isPending}
              >
                {isPending ? "جاري الإضافة..." : "إضافة"}
              </Button>
            </>
          )}
        </div>
      }
    />
  );
};

export default UpdateUserSavedLocationDialog;
