/**
 * Edit Basic Info Dialog Props
 */

export interface EditBasicInfoProps {
  onSave: (data: {
    firstName: string;
    lastName: string;
    mobile: string;
    image?: string;
  }) => Promise<void>;
  onClose: () => void;
}

