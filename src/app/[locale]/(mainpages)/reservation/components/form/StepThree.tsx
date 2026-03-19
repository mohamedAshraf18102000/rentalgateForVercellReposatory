
"use client";

import { Control, FieldErrors } from "react-hook-form";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";

interface StepThreeProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
}

const StepThree = ({ control, errors }: StepThreeProps) => {
  return (
    <div className="space-y-4">
      <p className="text-lg font-bold">تحديد الخدمات الإضافية</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-xl flex items-center justify-between">
          <div>
            <p className="font-bold">تأمين شامل</p>
            <p className="text-sm text-gray-500">حماية كاملة من الحوادث</p>
          </div>
          <input type="checkbox" className="w-5 h-5" />
        </div>
        <div className="p-4 border rounded-xl flex items-center justify-between">
          <div>
            <p className="font-bold">مقعد أطفال</p>
            <p className="text-sm text-gray-500">للأمان والراحة</p>
          </div>
          <input type="checkbox" className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StepThree;