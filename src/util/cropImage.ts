import type { Area } from "react-easy-crop";

const MAX_OUTPUT_SIDE = 1024;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", () => reject(new Error("Failed to load image")));
    img.src = src;
  });
}

export async function getCroppedProfileImageFile(
  imageSrc: string,
  pixelCrop: Area,
  originalFilename: string,
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const { width, height } = pixelCrop;
  const maxSide = Math.max(width, height);
  const scale = maxSide > MAX_OUTPUT_SIDE ? MAX_OUTPUT_SIDE / maxSide : 1;
  const outW = Math.round(width * scale);
  const outH = Math.round(height * scale);
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outW,
    outH,
  );

  const mimeType = "image/jpeg";
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (!b) reject(new Error("Could not export image"));
        else resolve(b);
      },
      mimeType,
      0.92,
    );
  });

  const base =
    originalFilename.replace(/\.[^/.]+$/, "") || "profile";
  return new File([blob], `${base}.jpg`, { type: mimeType });
}
