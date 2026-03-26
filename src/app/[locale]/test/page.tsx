"use client";
import { useAuth } from "@/app/(components)/navbar/hooks/useAuth";

const Page = () => {
  const { userData, authenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!authenticated || !userData) {
    return (
      <div className="p-8 text-red-500">
        Not authenticated. Please log in to see the email.
      </div>
    );
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">User Test Page</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-600">Customer Email:</p>
        <p className="text-xl font-semibold text-primary">{userData.email}</p>
      </div>
    </div>
  );
};

export default Page;
