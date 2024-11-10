import axiosInstance, { headers } from "../pages/ApiFunction/axiosInstance";



export const allfaqs = async (page) => {

    try {
        const res = await axiosInstance.get(`api/users/faqs/all/${page}`, {
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

export const createFaq = async ({ data }) => {
    try {
        const res = await axiosInstance.post(`api/users/admin/faq`,
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

export const editFaq = async ({ data }, id) => {
    try {
        const res = await axiosInstance.put(`api/users/admin/faq/${id}`,
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


export const deleteFaq = async (id) => {
    try {
        const res = await axiosInstance.delete(`api/users/admin/faq/${id}`,
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
