import { Controller, Control, FieldErrors } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { Label } from "@/app/(components)/ui/label";
import { Input } from "@/app/(components)/ui/input";
import { Minus, Plus, X, Search, Check } from "lucide-react";
import { FormData } from "../../hooks/useFormCookies";
import { getValidationMessages } from "../../utils/validation";
import { SeparatorWithContent } from "@/app/(components)";
import { cn } from "@/lib/utils";

interface Step3Props {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  isRTL: boolean;
  brands: any[];
  isLoadingBrands: boolean;
  onFieldChange: (field: keyof FormData, value: any) => void;
}

export function Step3({
  control,
  errors,
  isRTL,
  brands,
  isLoadingBrands,
  onFieldChange,
}: Step3Props) {
  const t = useTranslations("companyQuotation");
  const validationMessages = getValidationMessages(isRTL);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Rental Duration */}
      <div className="space-y-2">
        <SeparatorWithContent>
          <h3 className="text-lg font-semibold text-gray-900 bg-white px-4">
            {t('step3.fields.rentalDuration')}
          </h3>
        </SeparatorWithContent>
        <Controller
          name="rentalDuration"
          control={control}
          rules={{
            required: true,
            min: {
              value: 1,
              message: validationMessages.rentalDuration.min,
            },
          }}
          render={({ field }) => (
            <>
              <div className="flex items-center gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const newValue = field.value + 1;
                    field.onChange(newValue);
                    onFieldChange("rentalDuration", newValue);
                  }}
                  className="w-12 h-12 rounded-full  flex items-center justify-center  btn-soft"
                  aria-label="Increase"
                >
                  <Plus className="w-5 h-5 text-gray-900" strokeWidth={3} />
                </button>
                <div className="min-w-[60px] h-12 bg-gray-100   rounded-lg   flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">
                    {field.value}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newValue = Math.max(1, field.value - 1);
                    field.onChange(newValue);
                    onFieldChange("rentalDuration", newValue);
                  }}
                  className="w-12 h-12 rounded-full  flex items-center justify-center  btn-soft"
                  aria-label="Decrease"
                >
                  <Minus className="w-5 h-5 text-gray-900" strokeWidth={3} />
                </button>
              </div>
              {errors.rentalDuration && (
                <p className="text-xs text-red-500 font-normal mt-1">
                  {errors.rentalDuration.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* Cars Section */}
      <div className="space-y-[30px]">
        <SeparatorWithContent>
          <h3 className="text-lg font-semibold text-gray-900 bg-white px-4">
            {t('step3.fields.cars')}
          </h3>
        </SeparatorWithContent>

        {/* Brand Selection */}
        <div className="space-y-2">
          <Controller
            name="selectedBrandId"
            control={control}
            rules={{
              required: validationMessages.selectedBrandId.required,
            }}
            render={({ field }) => {
              const selectedBrands = field.value || [];

              // Filter brands based on search query
              const filteredBrands = useMemo(() => {
                if (!searchQuery) return brands;
                return brands.filter((brand) => {
                  const brandName = (brand as any).brandEnName || brand.brandName || "";
                  const arabicName = (brand as any).brandArName || brand.arabicName || "";
                  const searchLower = searchQuery.toLowerCase();
                  return (
                    brandName.toLowerCase().includes(searchLower) ||
                    arabicName.toLowerCase().includes(searchLower)
                  );
                });
              }, [brands, searchQuery]);

              // Get selected brand objects
              const selectedBrandObjects = brands.filter((brand) =>
                selectedBrands.includes(brand.brandId.toString())
              );

              const handleToggleBrand = (brandId: string) => {
                const newSelected = selectedBrands.includes(brandId)
                  ? selectedBrands.filter((id) => id !== brandId)
                  : [...selectedBrands, brandId];
                field.onChange(newSelected);
                onFieldChange("selectedBrandId", newSelected);
              };

              const handleRemoveBrand = (brandId: string) => {
                const newSelected = selectedBrands.filter((id) => id !== brandId);
                field.onChange(newSelected);
                onFieldChange("selectedBrandId", newSelected);
              };

              return (
                <>
                  <Label className="text-sm font-bold flex items-center gap-1">
                    {t("step3.fields.brands")}
                    <span className="text-red-500">*</span>
                  </Label>



                  {/* Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      disabled={isLoadingBrands}
                      className={cn(
                        "w-full h-[48px] px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-white",
                        "flex items-center gap-2",
                        "hover:border-gray-400  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        isRTL && "text-right"
                      )}
                    >
                      <Search className={cn("w-5 h-5 text-gray-400 shrink-0", isRTL && "order-2")} />
                      <div className={cn("flex-1 min-w-0 flex items-center gap-2", isRTL && "flex-row-reverse")}>
                        {/* Selected Brands Tags */}
                        {selectedBrands.length > 0 ? (
                          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
                            {selectedBrandObjects.map((brand) => {
                              const brandName =
                                (brand as any).brandEnName || brand.brandName || "";
                              const arabicName =
                                (brand as any).brandArName || brand.arabicName || "";
                              return (
                                <div
                                  key={brand.brandId}
                                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-800 text-white rounded-lg text-xs shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span className="whitespace-nowrap truncate max-w-[80px]">
                                    {isRTL ? arabicName : brandName}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveBrand(brand.brandId.toString());
                                    }}
                                    className="hover:bg-gray-700 rounded-full p-0.5 transition-colors shrink-0"
                                    aria-label="Remove"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-gray-500 whitespace-nowrap">
                            {isLoadingBrands
                              ? isRTL
                                ? "جاري التحميل..."
                                : "Loading..."
                              : t("step3.placeholders.brands")}
                          </span>
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown Content */}
                        <div
                          className={cn(
                            "absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg",
                            "max-h-[300px] overflow-hidden flex flex-col"
                          )}
                        >
                          {/* Search Input */}
                          <div className="p-2 border-b border-gray-200">
                            <div className="relative">
                              <Search
                                className={cn(
                                  "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400",
                                  isRTL ? "right-3" : "left-3"
                                )}
                              />
                              <Input
                                type="text"
                                placeholder={isRTL ? "بحث..." : "Search..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={cn(
                                  "w-full pl-10 pr-10",
                                  isRTL && "pr-10 pl-10"
                                )}
                              />
                            </div>
                          </div>

                          {/* Brands List */}
                          <div className="overflow-y-auto flex-1">
                            {filteredBrands.length === 0 ? (
                              <div className="p-4 text-center text-gray-500 text-sm">
                                {isRTL ? "لا توجد نتائج" : "No results found"}
                              </div>
                            ) : (
                              filteredBrands.map((brand) => {
                                const brandName =
                                  (brand as any).brandEnName || brand.brandName || "";
                                const arabicName =
                                  (brand as any).brandArName || brand.arabicName || "";
                                const isSelected = selectedBrands.includes(
                                  brand.brandId.toString()
                                );

                                return (
                                  <button
                                    key={brand.brandId}
                                    type="button"
                                    onClick={() => handleToggleBrand(brand.brandId.toString())}
                                    className={cn(
                                      "w-full px-4 py-3 flex items-center gap-3",
                                      "hover:bg-gray-50 transition-colors",
                                      "text-left",
                                      isRTL && "text-right flex-row-reverse"
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "w-5 h-5 rounded border-2 flex items-center justify-center",
                                        isSelected
                                          ? "bg-primary border-primary"
                                          : "border-gray-300"
                                      )}
                                    >
                                      {isSelected && (
                                        <Check className="w-3.5 h-3.5 text-white" />
                                      )}
                                    </div>
                                    <span className="flex-1">
                                      {isRTL ? arabicName : brandName}
                                    </span>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {errors.selectedBrandId && (
                    <p className="text-xs text-red-500 font-normal mt-1">
                      {errors.selectedBrandId.message}
                    </p>
                  )}
                </>
              );
            }}
          />
        </div>

        {/* Number of Cars */}
        <div className="space-y-2">
          <Controller
            name="numberOfCars"
            control={control}
            rules={{
              required: true,
              min: {
                value: 1,
                message: validationMessages.numberOfCars.min,
              },
            }}
            render={({ field }) => (
              <>
                <SeparatorWithContent>
                  <h3 className="text-lg font-semibold text-gray-900 bg-white px-4">
                    {t('step3.fields.numberOfCars')}
                  </h3>
                </SeparatorWithContent>
                <div className="flex items-center gap-4 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = field.value + 1;
                      field.onChange(newValue);
                      onFieldChange("numberOfCars", newValue);
                    }}
                    className="w-12 h-12 rounded-full  flex items-center justify-center  btn-soft"
                    aria-label="Increase"
                  >
                    <Plus className="w-5 h-5 text-gray-900" strokeWidth={3} />
                  </button>
                  <div className="min-w-[60px] h-12 bg-gray-100   rounded-lg   flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">
                      {field.value}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = Math.max(1, field.value - 1);
                      field.onChange(newValue);
                      onFieldChange("numberOfCars", newValue);
                    }}
                    className="w-12 h-12 rounded-full  flex items-center justify-center  btn-soft"
                    aria-label="Decrease"
                  >
                    <Minus className="w-5 h-5 text-gray-900" strokeWidth={3} />
                  </button>
                </div>
                {errors.numberOfCars && (
                  <p className="text-xs text-red-500 font-normal mt-1">
                    {errors.numberOfCars.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
