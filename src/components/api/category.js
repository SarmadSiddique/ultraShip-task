import axiosInstance, { headers } from "../pages/ApiFunction/axiosInstance";


export const createCategory = async ({ data }, cat) => {
    try {
        const res = await axiosInstance.post(`api/${cat}/create`,
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

export const editCategory = async ({ data }, cat, id) => {
    try {
        const res = await axiosInstance.put(`api/${cat}/edit/${id}`,
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

export const allCategories = async (cat, page) => {

    try {
        const res = await axiosInstance.get(`api/${cat}/admin/${page}`, {
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
export const categoryWithoutPage = async (type) => {

    try {
        const res = await axiosInstance.get(`api/cat/admin-all/${type}`, {
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

export const updateCategory = async (cat, status, id) => {
    try {
        const res = await axiosInstance.put(`api/${cat}/${status}/${id}`, {}, {
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
