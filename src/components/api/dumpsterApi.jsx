import axiosInstance, { headers } from "../pages/ApiFunction/axiosInstance";

export const allDumpster = async (page) => {

    try {
        const res = await axiosInstance.get(`api/dumbster/admin/all/${page}`, {
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

export const updateDumpster = async (id, data) => {

    try {
        const res = await axiosInstance.put(`api/dumbster/edit/${id}`, data, {
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


export const createDumpster = async (data) => {
    try {
        const res = await axiosInstance.post(`api/dumbster/create`, data, {
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


export const updateDumpsterStatus = async (id, status) => {

    try {
        const res = await axiosInstance.put(`api/dumbster/update/${id}/${status}`, {}, {
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

