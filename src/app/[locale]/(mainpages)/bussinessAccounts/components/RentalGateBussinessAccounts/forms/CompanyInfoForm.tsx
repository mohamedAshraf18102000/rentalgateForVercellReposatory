import { Button } from "@/app/(components)";
import { Input } from "@/app/(components)/ui/input";
import { InputFileUpload } from "@/app/(components)/ui/inputFileUpload";
import { Building, UsersRound } from "lucide-react";
import { ChevronLeft } from "lucide-react";

interface CompanyInfoFormProps {
  step?: number;
}

const CompanyInfoForm = ({ step = 1 }: CompanyInfoFormProps) => {
  return (
    <div className="mt-8 flex flex-col gap-4">
      {step === 1 && (
        <>
          <Input
            id="name"
            type="text"
            placeholder="أدخل أسم الشركة"
            label="اسم الشركة:"
            className="bg-white! border-2! border-Grey400! rounded-xl! text-base!"
            labelClassName="text-base text-primary"
            startIcon={<Building className="text-primary" />}
          />

          <Input
            id="employeeCount"
            type="text"
            placeholder="أدخل أسم الشركة"
            label="عدد الموظفين:  "
            className="bg-white! border-2! border-Grey400! rounded-xl! text-base!"
            labelClassName="text-base text-primary"
            startIcon={<UsersRound className="text-primary" />}
          />
        </>
      )}
      
      {step === 2 && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <InputFileUpload
              wrapperClassName="bg-white! font-bold!"
              size="sm"
              className="text-center!"
              uploadText="صورة البطاقة الضريبية "
            />
          </div>
          <div>
            <InputFileUpload
              wrapperClassName="bg-white! font-bold!"
              size="sm"
              className="text-center!"
              uploadText="صورة السجل التجاري"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyInfoForm;
