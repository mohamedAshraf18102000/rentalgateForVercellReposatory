/**
 * ConfirmDelete Dialog Props
 */

export interface ConfirmDeleteProps {
  title: string;
  description: string;
  itemName: string;
  onConfirm: () => void;
  onClose: () => void;
}

