"use client";

import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { useTest } from "@/hooks/api/useTest";

export default function TestPage() {
  const { data, isLoading, isError, error } = useTest();

  if (isLoading) return <WrapperContainer exceedNav>Loading...</WrapperContainer>;
  if (isError)
    return (
      <WrapperContainer exceedNav>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </WrapperContainer>
    );

  return (
    <WrapperContainer exceedNav>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </WrapperContainer>
  );
}
