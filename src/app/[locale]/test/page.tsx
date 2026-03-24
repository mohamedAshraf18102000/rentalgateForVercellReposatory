"use client";

import { useMutation } from "@tanstack/react-query";
import { InputFileUpload } from "@/app/(components)/ui/inputFileUpload";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { uploadImage } from "@/services/uploadImages/uploadImage.service";

const Page = () => {
  const {
    mutate: doUploadImage,
    isPending,
    data,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: uploadImage,
  });

  const handleFileChange = (file: File | null) => {
    if (file) {
      doUploadImage(file);
    }
  };

  return (
    <WrapperContainer exceedNav>
      <InputFileUpload onFileChange={handleFileChange} />
      {isPending && <p className="mt-4 text-blue-500">جاري رفع الصورة...</p>}
      {data && (
        <p className="mt-4 text-green-500">
          نجاح! اسم الصورة: <span className="font-bold">{data}</span>
        </p>
      )}
      {error && (
        <p className="mt-4 text-red-500">
          {(error as Error).message || "حدث خطأ أثناء رفع الصورة"}
        </p>
      )}
    </WrapperContainer>
  );
};

export default Page;
