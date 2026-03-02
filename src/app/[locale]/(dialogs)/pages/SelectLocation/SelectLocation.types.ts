/**
 * SelectLocation Dialog Props
 */

export interface SelectLocationProps {
  currentLocation?: string;
  onSelect: (location: string) => void;
  onClose: () => void;
}

