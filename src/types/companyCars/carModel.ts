export interface Brand {
  brandId: number;
  englishName: string;
  arabicName: string;
  home: number;
  icon: string;
  notes: string;
  status: "ACTIVE" | "INACTIVE";
  name: string;
}

export interface CarType {
  typeId: number;
  englishName: string;
  arabicName: string;
  brand: Brand;
  notes: string;
  status: "ACTIVE" | "INACTIVE";
  name: string;
}

export type CarModelsResponse = CarType[];
