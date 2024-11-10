import axiosInstance, { headers } from "../pages/ApiFunction/axiosInstance";

export const createService = async ({ data }) => {
    try {
        const res = await axiosInstance.post(`api/service/create`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    'x-auth-token': headers
                },
            }
        );
        return res;
    } catch (error) {
        console.error(error, "error");
        throw error;  // Rethrow the error to be handled by the caller
    }
};


export const editService = async ({ data }, id) => {
    try {
        const res = await axiosInstance.put(`api/service/edit/${id}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    'x-auth-token': headers
                },
            }
        );
        return res;
    } catch (error) {
        console.error(error, "error");
        throw error;  // Rethrow the error to be handled by the caller
    }
};

export const updateServiceStatus = async (status, id) => {
    try {
        const res = await axiosInstance.put(`api/service/update/${status}/${id}`, {}, {
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
