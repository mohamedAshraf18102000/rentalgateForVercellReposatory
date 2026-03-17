import { Button } from "@/app/(components)";

const LoadMoreButton = ({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: any) => {
  if (!hasNextPage) return null;

  return (
    <div className="flex justify-center mt-10">
      <Button
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage}
        className="px-20"
      >
        {isFetchingNextPage ? "جاري التحميل..." : "المزيد"}
      </Button>
    </div>
  );
};

export default LoadMoreButton;
