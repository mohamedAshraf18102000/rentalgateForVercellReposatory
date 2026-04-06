import Image from "next/image";
import { Button } from "../../ui/button";
import { FavCategoryTabs } from "./FavCategoryTabs";
import { useUserPreferedFiltersStore, CarCategory } from "@/lib/stores/useUserPreferedFiltersStore";

const FavCategoryComponent = () => {
  const { filters, setFilter } = useUserPreferedFiltersStore();

  return (
    <div className="h-[480px] md:h-full rounded-2xl! overflow-hidden shadow-lg border-2 border-white">
      <div className="relative h-[200px] md:h-[50%] overflow-hidden">
        <Image
          src="/rentalSearch/img2.webp"
          alt="bgApp2"
          fill
          className="object-cover scale-120"
        />
      </div>
      <div className="bg-white h-[280px] md:h-[50%] p-4 text-center">
        <h4 className="font-bold text-xl md:text-2xl mb-2 md:mb-3 whitespace-nowrap">أبحث بالفئة المفضلة</h4>
        <p className="text-sm text-Grey700 mb-3">
          اختر الفئة التي تناسب احتياجك، وإحنا نسهّل عليك البحث
        </p>
        <FavCategoryTabs 
          value={filters.carCategory} 
          onValueChange={(value) => setFilter("carCategory", value as CarCategory)} 
        />

        <Button className="mt-4 text-sm">إظهار النتائج</Button>
      </div>
    </div>
  );
};

export default FavCategoryComponent;
