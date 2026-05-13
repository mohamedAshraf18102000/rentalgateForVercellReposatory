"use client";

import * as React from "react";
import { IdCard, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import InputRequired from "../InputRequired";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  size?: "sm" | "md" | "lg";
  label?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  labelIcon?: React.ReactNode;
  uploadIcon?: React.ReactNode;
  uploadText?: string;
  onFileRemove?: () => void;
  /** Pre-populate the component with an existing File (e.g. from a store) */
  initialFile?: File | null;
  /** Pre-populate the component with an existing image URL (e.g. from a profile) */
  initialPreviewUrl?: string | null;
  /** Called whenever the selected file changes (or is removed) */
  onFileChange?: (file: File | null) => void;
  InputAsterisk?: React.ReactNode;
}

// Helper to merge multiple refs into one callback ref
function useMergedRef<T>(...refs: React.Ref<T>[]) {
  return React.useCallback(
    (node: T | null) => {
      refs.forEach((ref) => {
        if (!ref) return;
        if (typeof ref === "function") {
          ref(node);
        } else {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}

const InputFileUpload = React.forwardRef<HTMLInputElement, InputProps>(
  function InputFileUpload(
    {
      className,
      size = "md",
      label,
      wrapperClassName,
      labelClassName,
      labelIcon,
      uploadIcon,
      uploadText,
      onFileRemove,
      onFileChange,
      initialFile,
      initialPreviewUrl,
      required = false,
      InputAsterisk,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: _value, // file inputs can't be controlled via `value` — discard it
      ...props
    }: InputProps,
    forwardedRef,
  ) {
    const t = useTranslations("common");
    const [isDragging, setIsDragging] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [isObjectPreviewUrl, setIsObjectPreviewUrl] = React.useState(false);
    const [showPreview, setShowPreview] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRef(inputRef, forwardedRef);
    const resolvedUploadText = uploadText ?? t("inputFileUpload.uploadText");

    // Hydrate from initialFile or initialPreviewUrl (e.g. from a store or API)
    React.useEffect(() => {
      if (initialFile && !file) {
        if (!(initialFile instanceof Blob)) return;
        const url = URL.createObjectURL(initialFile);
        setFile(initialFile);
        setPreviewUrl(url);
        setIsObjectPreviewUrl(true);
      } else if (initialPreviewUrl && !file) {
        setPreviewUrl(initialPreviewUrl);
        setIsObjectPreviewUrl(false);
        // Construct a mock File to represent the existing server image
        setFile({
          name: initialPreviewUrl.split("/").pop() || "الرخصة الحالية",
          size: 0,
        } as File);
      }
      // Only run on mount / when initialFile or initialPreviewUrl identity changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialFile, initialPreviewUrl]);

    // Cleanup object URL on unmount or file change
    React.useEffect(() => {
      return () => {
        if (previewUrl && isObjectPreviewUrl) URL.revokeObjectURL(previewUrl);
      };
    }, [previewUrl, isObjectPreviewUrl]);

    const handleFile = (incoming: File) => {
      if (previewUrl && isObjectPreviewUrl) URL.revokeObjectURL(previewUrl);
      setFile(incoming);
      setPreviewUrl(URL.createObjectURL(incoming));
      setIsObjectPreviewUrl(true);
      onFileChange?.(incoming);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) {
        handleFile(dropped);
        const dt = new DataTransfer();
        dt.items.add(dropped);
        if (inputRef.current) {
          inputRef.current.files = dt.files;
          inputRef.current.dispatchEvent(
            new Event("change", { bubbles: true }),
          );
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFile(selected);
      props.onChange?.(e);
    };

    const handleRemove = () => {
      if (previewUrl && isObjectPreviewUrl) URL.revokeObjectURL(previewUrl);
      setFile(null);
      setPreviewUrl(null);
      setIsObjectPreviewUrl(false);
      if (inputRef.current) inputRef.current.value = "";
      onFileRemove?.();
      onFileChange?.(null);
    };

    // ── Preview modal ──────────────────────────────────────────────
    const previewModal = showPreview && previewUrl && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={() => setShowPreview(false)}
      >
        <div
          className="relative max-w-2xl w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="absolute -top-3 -right-3 z-10 flex items-center justify-center size-8 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="size-4" />
          </button>
          <img
            src={previewUrl}
            alt={file?.name}
            className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]"
          />
        </div>
      </div>
    );

    // ── File preview strip (shown after upload) ────────────────────
    const fileStrip = file && previewUrl && (
      <div className="flex items-center gap-3 mt-2 px-3 py-2 rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Thumbnail */}
        <div className="shrink-0 size-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
          <img
            src={previewUrl}
            alt={file.name}
            className="size-full object-cover"
          />
        </div>

        {/* File name */}
        <p
          className="flex-1 text-xs text-gray-600 font-medium truncate text-right"
          dir="rtl"
          title={file.name}
        >
          {file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* View */}
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex items-center justify-center size-7 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            title="عرض الصورة"
          >
            <Eye className="size-4" />
          </button>
          {/* Remove */}
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center justify-center size-7 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="حذف الصورة"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    );

    // ── Drop zone ──────────────────────────────────────────────────
    const dropZone = (
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer transition-colors select-none",
          isDragging && "border-primary bg-primary/5",
          size === "sm" && "h-28 px-4",
          size === "md" && "h-40 px-6",
          size === "lg" && "h-52 px-8",
          wrapperClassName,
        )}
      >
        <input
          ref={mergedRef}
          type="file"
          className="sr-only"
          required={required}
          {...props}
          onChange={handleChange}
        />

        <div className="flex items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 p-3">
          {uploadIcon ?? (
            <IdCard className="size-8 text-gray-700 stroke-[1.5]" />
          )}
        </div>

        <p
          className={cn(
            "text-center text-gray-500 font-medium leading-relaxed",
            size === "sm" ? "text-xs" : "text-sm",
          )}
          dir="rtl"
        >
          {resolvedUploadText}
          {InputAsterisk && <InputRequired />}
        </p>
      </div>
    );

    // ── Compose ────────────────────────────────────────────────────
    const content = (
      <>
        {dropZone}
        {fileStrip}
        {previewModal}
      </>
    );

    if (!label) return content;

    return (
      <div className="space-y-1.5 w-full">
        <label
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium text-foreground",
            labelClassName,
          )}
        >
          {labelIcon && labelIcon}
          {label}
          {InputAsterisk && <InputRequired />}
        </label>
        <div className="mt-2">{content}</div>
      </div>
    );
  },
);

InputFileUpload.displayName = "InputFileUpload";

export { InputFileUpload };
export type { InputProps };
