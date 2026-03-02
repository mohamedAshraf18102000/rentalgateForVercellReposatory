/**
 * Edit Personal Info Dialog Props
 */

export interface EditPersonalInfoProps {
  field: string;
  label: string;
  currentValue: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

