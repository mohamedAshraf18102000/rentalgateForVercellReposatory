import { fetchHomeAllData } from "@/constants/api";
import { setRequestLocale } from "next-intl/server";
import HomeMockups from "./(mainpages)/(home)/HomeMockups";
import HomeSlider from "./(mainpages)/(home)/HomeSlider";
import { MostRequestedCars } from "./(mainpages)/(home)/MostRequestedCars/MostRequestedCars";
import PickUpArea from "./(mainpages)/(home)/PickUpArea";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch data from API
  let offers: any[] = [];
  let banners: any[] = [];
  try {
    const homeData = await fetchHomeAllData();
    offers = homeData.data?.offers || [];
    banners = homeData.data?.banners || [];
  } catch (error) {
    console.error("Error fetching home data:", error);
    offers = [];
    banners = [];
  }

  return (
    <main>
      <div className=" ">
        <HomeSlider banners={banners} />
        <PickUpArea />

        <MostRequestedCars locale={locale} />

        {/* هناخد الديزين الجديد  */}
        <HomeMockups />
      </div>
    </main>
  );
}
