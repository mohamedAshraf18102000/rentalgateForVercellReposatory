import { fetcher } from "@/services/api";

const page = async () => {
  const data = await fetcher(
    "/company-cars/filter-and-sort?maxPrice&minPrice&categoryId&airportId&trainStationId&searchType=location&brandId&typeId&priceType&sortBy&latitude=29.981896741873385&longitude=31.344896888469204",
  );

  console.log("data", data);

  return (
    <div className="p-4">
      <p className="mb-4 font-bold">test2 - API Result</p>
      <pre className="p-4 bg-gray-100 rounded overflow-auto whitespace-pre-wrap break-all max-h-[500px]">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default page;
