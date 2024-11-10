import axiosInstance, { headers } from "../pages/ApiFunction/axiosInstance";

export const getUserRating = async (id) => {

    try {
        const res = await axiosInstance.get(`api/rating/admin/${id}`, {
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


export const updateUser = async (id, status) => {

    try {
        const res = await axiosInstance.put(`api/users/admin/update/${id}/${status}`, {}, {
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
