import axiosInstance, { headers } from "../pages/ApiFunction/axiosInstance";

export const allOrders = async (page, type) => {

    try {
        const res = await axiosInstance.get(`api/order/admin/${page}/${type}`, {
            headers: {
                "Content-Type": "application/json",
                'x-auth-token': headers
            },
        });
        return res;
    } catch (error) {
        // console.log(error, "error");
    }
}