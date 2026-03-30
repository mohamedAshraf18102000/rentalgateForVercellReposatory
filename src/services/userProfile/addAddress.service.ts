import { UserAddress } from "@/types/userProfile/userAddress";
import { fetcher } from "../api";
import { UserSavedLocationFormValues } from "@/schemas/userAddressSchema";

export const addAddress = async (data: UserSavedLocationFormValues): Promise<UserAddress> => {
    return fetcher<UserAddress>("/client-addresses", {
        method: "POST",
        body: JSON.stringify(data),
    });
};
