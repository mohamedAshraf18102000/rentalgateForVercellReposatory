import { useMutation } from "@tanstack/react-query";
import { fetcher } from "@/services/api";
import { deleteCookie } from "@/util";

type RemoveAccountResponse = {
    status: boolean;
    message: string;
    data?: unknown;
};


const removeAccount = async (): Promise<RemoveAccountResponse> =>
    fetcher<RemoveAccountResponse>("/clients/auth/remove-account", {
        method: "DELETE",
    });

export const useRemoveUserAccount = () =>
    useMutation({
        mutationFn: removeAccount,
        onSuccess: () => {
            deleteCookie("authToken");
            deleteCookie("userData");
        },
        onError: (error) => {
            console.log(error);
        },
    });
