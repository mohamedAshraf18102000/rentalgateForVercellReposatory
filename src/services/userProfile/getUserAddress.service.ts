import { UserAddress } from "@/types/userProfile/userAddress";
import { fetcher } from "../api";

export const getUserAddress = async (): Promise<UserAddress[]> => {
    return fetcher<UserAddress[]>("/client-addresses/my-addresses?page=0&size=50");
};