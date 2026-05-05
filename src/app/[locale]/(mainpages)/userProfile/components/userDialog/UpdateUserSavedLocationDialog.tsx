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
import { useTranslations } from "next-intl";
import { useDialog } from "@/app/[locale]/(dialogs)";
import { ReverseGeocodeMeta } from "@/lib/utils/reverseGeocode";
import { useRouter } from "next/navigation";

interface UpdateUserSavedLocationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialShowAddForm?: boolean;
  addFormOnlyMode?: boolean;
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  initialMobile?: string;
  onSuccess?: (address: UserAddress) => void;
}

const UpdateUserSavedLocationDialog = ({
  open,
  setOpen,
  initialShowAddForm = false,
  addFormOnlyMode = false,
  initialLat: propLat,
  initialLng: propLng,
  initialAddress,
  initialMobile,
  onSuccess,
}: UpdateUserSavedLocationDialogProps) => {
  const t = useTranslations("profile.userSavedLocationDialog");
  const [showAddForm, setShowAddForm] = useState(initialShowAddForm);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [hasRestrictedLocationType, setHasRestrictedLocationType] =
    useState(false);
  const queryClient = useQueryClient();
  const { openDialog } = useDialog();
  const router = useRouter();

  const {
    setUserPhysical_Location,
    userPhysical_Latitude,
    userPhysical_Longitude,
  } = useLocationStore();

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
      mobile: initialMobile || "+966",
      notes: "",
    },
  });

  const { mutate: handleAddAddress, isPending } = useMutation({
    mutationFn: (values: UserSavedLocationFormValues) => addAddress(values),
    onSuccess: (data: UserAddress) => {
      toast.success(t("toast.addSuccess"));
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      onSuccess?.(data);
      if (addFormOnlyMode) {
        setOpen(false);
      } else {
        setShowAddForm(false);
      }
      reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || t("toast.addError"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (addressId: string | number) => deleteAddress(addressId),
    onSuccess: () => {
      toast.success(t("toast.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("toast.deleteError"));
    },
  });

  const { mutate: handleDeleteAddress, isPending: isDeleting } = deleteMutation;

  const handleDelete = (addressId: string | number) => {
    if (window.confirm(t("confirmDelete"))) {
      handleDeleteAddress(addressId);
    }
  };

  const onSubmit = (values: UserSavedLocationFormValues) => {
    if (hasRestrictedLocationType) {
      openDialog("ApiError", {
        message:
          "انت في مطار او محطة قطار برجاء التوجه للرئيسية او اختيار مكان اخر لحفظة",
        onClick: () => router.push("/"),
      });
      return;
    }
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
        if (initialMobile) {
          setValue("mobile", initialMobile);
        }
      }
    } else {
      setShowAddForm(false);
      setHasRestrictedLocationType(false);
      reset();
    }
  }, [
    open,
    initialShowAddForm,
    reset,
    propLat,
    propLng,
    initialAddress,
    initialMobile,
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
            {showAddForm && !addFormOnlyMode && (
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-Grey100 rounded-full transition-all active:scale-95"
                aria-label={t("backAria")}
              >
                <ChevronRight className="w-6 h-6 text-black" />
              </button>
            )}
            <span className="text-black  flex-1 text-center font-bold">
              {showAddForm
                ? t("header.addNewAddress")
                : t("header.savedAddresses")}
            </span>
            {showAddForm && !addFormOnlyMode && <div className="w-8" />}
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
                  {t("actions.addNewAddress")}
                </Button>
              </div>
              <div className="flex flex-col gap-3 mb-5">
                {isLoadingAddresses ? (
                  <div className="text-center py-10">
                    {t("states.loadingAddresses")}
                  </div>
                ) : userAddresses?.length === 0 ? (
                  <div className="text-center py-10 text-Grey600">
                    {t("states.noSavedAddresses")}
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
                          setUserPhysical_Location(
                            address.latitude,
                            address.longitude,
                            address.address,
                          );
                        }}
                        bg_gray
                        active={
                          address.latitude === userPhysical_Latitude &&
                          address.longitude === userPhysical_Longitude
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
                  onLocationChange={(
                    lat,
                    lng,
                    address,
                    isManual,
                    geocodeMeta?: ReverseGeocodeMeta,
                  ) => {
                    setValue("latitude", lat);
                    setValue("longitude", lng);
                    const category = geocodeMeta?.category;
                    setHasRestrictedLocationType(
                      category === "AIRPORT" || category === "TRAIN_STATION",
                    );
                    if (address && (isManual || !getValues("address"))) {
                      setValue("address", address);
                    }
                  }}
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
                      inputClassName="text-sm! bg-Grey100! border-1! border-red-500!"
                      label={t("fields.mobile.label")}
                      placeholder={t("fields.mobile.placeholder")}
                      showValidation={true}
                      onValidationChange={setIsPhoneValid}
                    />
                    {errors.mobile && !isPhoneValid && (
                      <p className="text-xs text-StatusRed mt-1">
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  {...register("addressName")}
                  labelClassName="text-base!"
                  className="text-sm! bg-Grey100!"
                  placeholder={t("fields.addressName.placeholder")}
                  label={t("fields.addressName.label")}
                  errorMessage={errors.addressName?.message}
                />
                <div className="flex flex-col gap-2">
                  <span className="text-base font-medium">
                    {t("fields.addressType.label")}
                  </span>
                  <Controller
                    name="addressType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-Grey100! border-none! ">
                          <SelectValue
                            placeholder={t("fields.addressType.placeholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Home">
                            {t("fields.addressType.options.home")}
                          </SelectItem>
                          <SelectItem value="Work">
                            {t("fields.addressType.options.work")}
                          </SelectItem>
                          <SelectItem value="Other">
                            {t("fields.addressType.options.other")}
                          </SelectItem>
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
                placeholder={t("fields.address.placeholder")}
                label={t("fields.address.label")}
                errorMessage={errors.address?.message}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  {...register("street")}
                  startIcon={<LocateFixed />}
                  labelClassName="text-base!"
                  className="text-sm! bg-Grey100!"
                  placeholder={t("fields.street.placeholder")}
                  label={t("fields.street.label")}
                  errorMessage={errors.street?.message}
                />
                <Input
                  {...register("buildingNo")}
                  startIcon={<Building2 />}
                  labelClassName="text-base!"
                  className="text-sm! bg-Grey100!"
                  placeholder={t("fields.buildingNo.placeholder")}
                  label={t("fields.buildingNo.label")}
                  errorMessage={errors.buildingNo?.message}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  {...register("floor", { valueAsNumber: true })}
                  type="number"
                  labelClassName="text-base!"
                  className="text-sm! bg-Grey100!"
                  placeholder={t("fields.floor.placeholder")}
                  label={t("fields.floor.label")}
                  errorMessage={errors.floor?.message}
                />
                <Input
                  {...register("flatNo")}
                  labelClassName="text-base!"
                  className="text-sm! bg-Grey100!"
                  placeholder={t("fields.flatNo.placeholder")}
                  label={t("fields.flatNo.label")}
                  errorMessage={errors.flatNo?.message}
                />
              </div>

              <Input
                {...register("additionalInfo")}
                labelClassName="text-base!"
                className="text-sm! bg-Grey100!"
                placeholder={t("fields.additionalInfo.placeholder")}
                label={t("fields.additionalInfo.label")}
                errorMessage={errors.additionalInfo?.message}
              />

              <Input
                {...register("notes")}
                labelClassName="text-base!"
                className="text-sm! bg-Grey100!"
                placeholder={t("fields.notes.placeholder")}
                label={t("fields.notes.label")}
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
                {t("actions.close")}
              </Button>
            </>
          ) : (
            <>
              <Button
                size="lg"
                className="w-fit text-black hover:bg-white underline py-3 border-none px-5 bg-white text-base font-bold"
                onClick={() => {
                  if (addFormOnlyMode) {
                    setOpen(false);
                  } else {
                    setShowAddForm(false);
                  }
                }}
                disabled={isPending}
              >
                {t("actions.cancel")}
              </Button>
              <Button
                size="lg"
                type="submit"
                form="add-address-form"
                className="w-fit text-white py-3 border-none px-10 text-base font-bold"
                disabled={isPending}
              >
                {isPending ? t("actions.adding") : t("actions.add")}
              </Button>
            </>
          )}
        </div>
      }
    />
  );
};

export default UpdateUserSavedLocationDialog;
