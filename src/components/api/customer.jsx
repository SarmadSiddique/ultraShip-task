// import axiosInstance, { headers } from "../pages/ApiFunction/axiosInstance";

// export const allUsers = async (user, page, status) => {

//     try {
//         const res = await axiosInstance.get(`api/users/admin/${user}/${page}/${status}`, {
//             headers: {
//                 "Content-Type": "application/json",
//                 'x-auth-token': headers
//             },
//         });
//         return res;
//     } catch (error) {
//         // console.log(error, "error");
//     }

// }
// export const updateUser = async (id, status) => {

//     try {
//         const res = await axiosInstance.put(`api/users/admin/update/${id}/${status}`, {}, {
//             headers: {
//                 "Content-Type": "application/json",
//                 'x-auth-token': headers
//             },
//         });
//         return res;
//     } catch (error) {
//         // console.log(error, "error");
//     }

// }
// export const getAdminRating = async (id, page) => {

//     try {
//         const res = await axiosInstance.get(`api/rating/admin/${id}/${page}`, {
//             headers: {
//                 "Content-Type": "application/json",
//                 'x-auth-token': headers
//             },
//         });
//         return res;
//     } catch (error) {
//         // console.log(error, "error");
//     }

// }
// export const getAdminBin = async ({ data }, page) => {

//     try {
//         const res = await axiosInstance.post(`api/bin/admin/all/${page}`, data, {
//             headers: {
//                 "Content-Type": "application/json",
//                 'x-auth-token': headers
//             },
//         });
//         return res;
//     } catch (error) {
//         // console.log(error, "error");
//     }

// }
// export const verifyBin = async ({ data }, binId) => {

//     try {
//         const res = await axiosInstance.put(`api/bin/admin/verify/${binId}`, data, {
//             headers: {
//                 "Content-Type": "application/json",
//                 'x-auth-token': headers
//             },
//         });
//         return res;
//     } catch (error) {
//         // console.log(error, "error");
//     }

// }
