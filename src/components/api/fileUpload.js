import axiosInstance, { headers } from "../pages/ApiFunction/axiosInstance";

export const fileUpload = async (data) => {
try {
    const res = await axiosInstance.post("api/image/upload",
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                'x-auth-token': headers
                // "Content-Type": "application/json",
                // 'x-auth-token': headers
            },
        }
    );
    return res;
} catch (error) {
    console.error(error, "error");
    throw error;  // Rethrow the error to be handled by the caller
}
};