export interface CarCategory {
  categoryId: number;
  englishName: string;
  arabicName: string;
  icon: string;
  notes: string;
  status: "ACTIVE" | "INACTIVE";
  name: string;
}

export type CarCategoriesResponse = CarCategory[];
