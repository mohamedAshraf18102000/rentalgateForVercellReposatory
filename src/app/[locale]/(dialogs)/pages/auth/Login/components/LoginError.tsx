"use client";

interface LoginErrorProps {
  error: string | null;
}

export const LoginError: React.FC<LoginErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="text-sm text-StatusRed bg-red-100 p-3 rounded-md text-center font-bold mt-2">
      {error}
    </div>
  );
};
