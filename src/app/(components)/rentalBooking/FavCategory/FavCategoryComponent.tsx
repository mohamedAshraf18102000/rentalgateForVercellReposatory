import Image from "next/image";
import { Button } from "../../ui/button";
import { FavCategoryTabs } from "./FavCategoryTabs";
import { useUserPreferedFiltersStore, CarCategory } from "@/lib/stores/useUserPreferedFiltersStore";

const FavCategoryComponent = () => {
  const { carCategory, setCarCategory } = useUserPreferedFiltersStore();

  return (
    <div className="h-full rounded-2xl! overflow-hidden">
      <div className="relative h-[50%] overflow-hidden">
        <Image
          src="/rentalSearch/img2.webp"
          alt="bgApp2"
          fill
          className="object-cover w-full h-full scale-120"
        />
      </div>
      <div className="bg-white h-[50%] p-2 text-center pt-4 ">
        <h4 className="font-bold text-2xl mb-3">أبحث بالفئة المفضلة</h4>
        <p className="text-sm text-Grey700 mb-3">
          اختر الفئة التي تناسب احتياجك، وإحنا نسهّل عليك البحث
        </p>
        <FavCategoryTabs 
          value={carCategory} 
          onValueChange={(value) => setCarCategory(value as CarCategory)} 
        />

        <Button className="mt-4 text-sm">إظهار النتائج</Button>
      </div>
    </div>
  );
};

export default FavCategoryComponent;
