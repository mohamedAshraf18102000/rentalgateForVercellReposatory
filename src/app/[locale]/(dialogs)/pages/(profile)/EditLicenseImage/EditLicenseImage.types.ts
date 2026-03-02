/**
 * Edit License Image Dialog Props
 */

export interface EditLicenseImageProps {
  currentImageUrl?: string | null;
  onSave: (imageFilename: string) => Promise<void>;
  onClose: () => void;
}
