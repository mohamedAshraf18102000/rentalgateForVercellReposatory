import { fetcher } from "../api";

export interface UserProfileCompletnessState {
    completeness: boolean;
}

export const getUserProfileCompletnessState = async (): Promise<UserProfileCompletnessState> => {
    return fetcher<UserProfileCompletnessState>("/clients/profile/completeness", {
        skipErrorToast: true,
    });
};
