"use client";

interface LoginErrorProps {
  error: string | null;
}

export const LoginError: React.FC<LoginErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
      {error}
    </div>
  );
};

