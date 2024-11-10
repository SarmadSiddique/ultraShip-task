import { axiosInstance } from "../../utils/axiosInstance";

export const login = async (data) => {
    try {
        const res = await axiosInstance.post("api/auth/admin",
            {
                email: data.email,
                password: data?.password,
            },
        );
        return res;
    } catch (error) {
        console.error(error, "error");
        throw error;
    }
};
