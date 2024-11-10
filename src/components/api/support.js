import axiosInstance, { headers } from "../pages/ApiFunction/axiosInstance";

export const getAllSupports = async (page) => {

    try {
        const res = await axiosInstance.get(`api/support/admin/${page}`, {
            headers: headers,
        });
        return res;
    } catch (error) {
        // console.log(error, "error");
    }
}


export const updateSupport = async (id) => {
    try {
        const res = await axiosInstance.put(`api/support/attended/${id}`,
            {},
            {
                headers: headers,
            });
        return res;
    } catch (error) {
        // console.log(error, "error");
    }

}