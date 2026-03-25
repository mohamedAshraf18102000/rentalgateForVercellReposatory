import { CreateBusinessAccountPayload } from "@/types/bussinessAccounts/bussinessAccounts";
import { fetcher } from "../api";
import { useMutation } from "@tanstack/react-query";

export const createBusinessAccount = (data: CreateBusinessAccountPayload) => {
  return fetcher("/business-accounts", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const useCreateBusinessAccountMutation = () => {
  return useMutation({
    mutationFn: createBusinessAccount,
  });
};
