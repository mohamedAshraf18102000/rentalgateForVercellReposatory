import { useMutation } from "@tanstack/react-query";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("https://viganium.co/uploads", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("فشل في رفع الصورة");
  }

  // The API returns just the filename as text
  const filename = await response.text();

  console.log("filename", filename.trim());

  return filename.trim();
};

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: uploadImage,
  });
};
