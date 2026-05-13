import { Input } from "@/app/(components)/ui/input";
import { InputFileUpload } from "@/app/(components)/ui/inputFileUpload";
import { Building, UsersRound, Loader2 } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { useUploadImageMutation } from "@/services/uploadImages/uploadImage.service";
import { toast } from "sonner";

interface CompanyInfoFormProps {
  step?: number;
}

const CompanyInfoForm = ({ step = 1 }: CompanyInfoFormProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadImageMutation();

  const handleFileUpload = async (
    file: File | null,
    onChange: (value: string) => void,
  ) => {
    if (!file) {
      onChange("");
      return;
    }

    try {
      const filename = await uploadImage(file);
      onChange(filename);
      toast.success("تم رفع الصورة بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء رفع الصورة");
      onChange("");
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-4 relative">
      {isUploading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {step === 1 && (
        <>
          <div>
            <Input
              required
              id="companyName"
              type="text"
              placeholder="أدخل أسم الشركة"
              label="اسم الشركة:"
              className={`bg-white! border-2! rounded-xl! text-base! ${errors.companyName ? "border-red-500!" : "border-Grey400!"}`}
              labelClassName="text-base text-primary"
              startIcon={<Building className="text-primary" />}
              {...register("companyName")}
            />
            {errors.companyName && (
              <span className="text-red-500 text-sm mt-1">
                {errors.companyName.message as string}
              </span>
            )}
          </div>

          <div>
            <Input
              required
              id="empsNumber"
              type="number"
              placeholder="أدخل عدد الموظفين"
              label="عدد الموظفين:"
              className={`bg-white! border-2! rounded-xl! text-base! ${errors.empsNumber ? "border-red-500!" : "border-Grey400!"}`}
              labelClassName="text-base text-primary"
              startIcon={<UsersRound className="text-primary" />}
              {...register("empsNumber", { valueAsNumber: true })}
            />
            {errors.empsNumber && (
              <span className="text-red-500 text-sm mt-1">
                {errors.empsNumber.message as string}
              </span>
            )}
          </div>
        </>
      )}

      {step === 2 && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Controller
              name="taxImage"
              control={control}
              render={({ field }) => (
                <InputFileUpload
                  InputAsterisk
                  wrapperClassName={`bg-white! font-bold! border-2! ${errors.taxImage ? "border-red-500" : ""}`}
                  size="sm"
                  className="text-center!"
                  uploadText="صورة البطاقة الضريبية"
                  onFileChange={(file) =>
                    handleFileUpload(file, field.onChange)
                  }
                />
              )}
            />
            {errors.taxImage && (
              <span className="text-red-500 text-sm text-center block mt-1">
                مطلوب مرفق
              </span>
            )}
          </div>
          <div>
            <Controller
              name="registrationImage"
              control={control}
              render={({ field }) => (
                <InputFileUpload
                  InputAsterisk
                  wrapperClassName={`bg-white! font-bold! border-2! ${errors.registrationImage ? "border-red-500" : ""}`}
                  size="sm"
                  className="text-center!"
                  uploadText="صورة السجل التجاري"
                  onFileChange={(file) =>
                    handleFileUpload(file, field.onChange)
                  }
                />
              )}
            />
            {errors.registrationImage && (
              <span className="text-red-500 text-sm text-center block mt-1">
                مطلوب مرفق
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyInfoForm;
