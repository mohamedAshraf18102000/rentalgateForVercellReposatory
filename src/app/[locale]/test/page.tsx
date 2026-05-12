import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import {
  getHomePageOffers,
  hasHomeOffersCoordinates,
} from "@/services/home/homeOffers.service";
import { cookies } from "next/headers";

const page = async () => {
  try {
    const cookieStore = await cookies();

    const latitude = cookieStore.get("lat")?.value ?? "";
    const longitude = cookieStore.get("lng")?.value ?? "";

    const offers = hasHomeOffersCoordinates(latitude, longitude)
      ? await getHomePageOffers(latitude, longitude)
      : null;

    return (
      <WrapperContainer exceedNav>
        <pre>
          {JSON.stringify(
            offers ?? { skipped: "please set latitude and longitude" },
            null,
            2,
          )}
        </pre>
      </WrapperContainer>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return (
      <WrapperContainer exceedNav>
        <pre>{JSON.stringify({ error: message }, null, 2)}</pre>
      </WrapperContainer>
    );
  }
};

export default page;
