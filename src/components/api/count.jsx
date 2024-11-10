import axiosInstance, { headers } from "../pages/ApiFunction/axiosInstance";

export const getBinCount = async () => {

    try {
        const res = await axiosInstance.get(`api/bin/admin/check-bin`, {
            headers: headers,
        });
        return res;
    } catch (error) {
        // console.log(error, "error");
    }
}
