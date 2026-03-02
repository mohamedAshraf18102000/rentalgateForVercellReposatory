"use client";

import * as React from "react";
import { Button, Input, Label, DialogWrapper } from "@/ui";
import { DatePicker } from "@/app/(components)/ui/date-picker";
import type { EditPersonalInfoProps } from "./EditPersonalInfo.types";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export function EditPersonalInfoDialog({
    field,
    label,
    currentValue,
    onSave,
    onClose,
}: EditPersonalInfoProps) {
    const params = useParams();
    const locale = params.locale as string;
    const [value, setValue] = React.useState(currentValue);
    const [dateValue, setDateValue] = React.useState<Date | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const t = useTranslations("common");

    // Check if this is a date field
    const isDateField = field === "licenseExpiryDate";

    // Convert DD/MM/YYYY to Date object
    React.useEffect(() => {
        if (isDateField && currentValue) {
            try {
                const [day, month, year] = currentValue.split("/");
                if (day && month && year) {
                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    if (!isNaN(date.getTime())) {
                        setDateValue(date);
                    }
                }
            } catch (error) {
                console.error("Error parsing date:", error);
            }
        }
    }, [isDateField, currentValue]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (isDateField && dateValue) {
                // Convert Date to DD/MM/YYYY format
                const day = String(dateValue.getDate()).padStart(2, "0");
                const month = String(dateValue.getMonth() + 1).padStart(2, "0");
                const year = dateValue.getFullYear();
                const formattedDate = `${day}/${month}/${year}`;
                await onSave(formattedDate);
            } else {
                await onSave(value);
            }
            onClose();
        } catch (error) {
            console.error("Error saving:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DialogWrapper
            open={true}
            onOpenChange={(open) => !open && onClose()}
            size="md"
            closeOnOutsideClick={true}
            header={{
                mainTitle: label,
            }}
            content={
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        {isDateField ? (
                            <DatePicker
                                label={label}
                                value={dateValue}
                                onChange={(date) => setDateValue(date)}
                                placeholder={locale === "ar" ? "اختر التاريخ" : "Select date"}
                                dialogTitle={label}
                                locale={locale}
                                minDate={new Date()} // Only allow future dates for license expiration
                            />
                        ) : (
                            <Input
                                label={label}
                                id="field-value"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={`أدخل ${label}`}
                                disabled={isLoading}
                            />
                        )}
                    </div>
                </div>
            }
            footer={
                <div className="grid grid-cols-12   gap-4 w-full mt-8">
                    <div className="col-span-4"> 
                        <Button variant="outline" className="w-full" size="lg" onClick={onClose} disabled={isLoading}>
                            {t("cancel") || "إلغاء"}
                        </Button>
                    </div>
                    <div className="col-span-8">
                        <Button 
                            className="w-full" 
                            size="lg" 
                            onClick={handleSave} 
                            disabled={isLoading || (isDateField && !dateValue)}
                        >
                            {isLoading ? t("saving") || "جاري الحفظ..." : t("saveChanges") || "حفظ التغييرات"}
                        </Button>
                    </div>
                </div>
            }
        />
    );
}

