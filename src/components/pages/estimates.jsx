/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ProductTable from "../DataTable/productTable";
import { dataTable } from "../DataTable/productsData";
import { avatarman, preview, trash } from "../icons/icon";
import { StyleSheetManager } from "styled-components";
import axios from "axios";
import { CircularProgress } from "@mui/material";

import Select from "react-select";
import { Col, Form, Input, message, Modal } from "antd";
import axiosInstance, { headers } from "./ApiFunction/axiosInstance";
import { useNavigate } from "react-router-dom";
const Estimates = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState(1);
  const [lastId2, setLastId2] = useState(0);
  const [count, setcount] = useState(0);
  const [categories, setCategories] = useState([1, 2, 3]);
  const [modalPay, setModalPay] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderID, setOrderID] = useState("");
  const [bankModal, setBankModal] = useState(false);
  const [bankDetail, setBankDetail] = useState("");
  const [form] = Form.useForm();
  const toCapitalized = (str) => {
    return str?.charAt(0)?.toUpperCase() + str?.slice(1);
  };

  const HandleDetailOpen = (row) => {
    setBankModal(true);
    setBankDetail(row?.to_id);
  };
  const HandleDetailClose = () => {
    setBankModal(false);
    setBankDetail("");
  };
  const HandleAmountOpen = (row) => {
    setModalPay(true);
    setOrderID(row?._id);
  };
  const HandleAmountClose = () => {
    setModalPay(false);
    form.setFieldsValue({
      amount: "",
    });
  };

  const OrdersOption = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];
  const [orderType, setOrderType] = useState(OrdersOption[0]);

  const handleChange = (selectedOption) => {
    setOrderType(selectedOption);
  };

  const columns = [
    {
      name: "Id",
      sortable: true,
      minWidth: "100px",
      maxWidth: "220px",
      selector: (row) => row?.order_id || 'E#001',
    },
    {
      name: "Customer Name",
      sortable: true,
      selector: (row) =>
        row?.user?.name || 'Not found',
    },
    {
      name: "Customer Email",
      sortable: true,
      minWidth: "220px",
      maxWidth: "220px",
      selector: (row) => row?.user?.email || 'example@gmail.com',
    },
    {
      name: "Phone",
      sortable: true,
      selector: (row) => row?.user?.phone || '+2345654234',
      minWidth: "110px",
      maxWidth: "200px",
    },
    {
      name: "Service Name",
      sortable: true,
      selector: (row) => row?.service?.title || 'New Service',
      minWidth: "110px",
      maxWidth: "200px",
    },
    {
      name: "Service Price",
      sortable: true,
      selector: (row) => row?.service?.title || '$103.55',
      minWidth: "110px",
      maxWidth: "200px",
    },
    {
      name: "Date",
      sortable: true,
      selector: (row) => row?.service?.title || 'May 20, 2024',
      minWidth: "110px",
      maxWidth: "200px",
    },
    {
      name: "Address",
      sortable: true,
      selector: (row) => row?.service?.title || 'San Francisco, California',
      minWidth: "180px",
      maxWidth: "200px",
    },
    {
      name: "Service Provider",
      minWidth: "200px",
      maxWidth: "350px",
      sortable: true,
      cell: (row) => (
        <button
          disabled={row?.status === 'pending' || row?.status === 'cancelled'}
          className="manrope_semibold text_white bg_primary rounded-3 px-3 py-1"
          style={{ whiteSpace: 'nowrap' }}
          onClick={() => navigate('/service-providers/67898765400/detail')}
        >
          View
        </button>
      ),
    },
    // {
    //   name: "Bank Detail",
    //   sortable: true,
    //   selector: (row) => (
    //     <button
    //       disabled={row?.status === 'pending' || row?.status === 'cancelled'}
    //       className="bandView0"
    //       onClick={() => HandleDetailOpen(row)}
    //     >
    //       View
    //     </button>
    //   ),
    //   minWidth: "110px",
    //   maxWidth: "200px",
    // },
    // {
    //   name: "Status",
    //   allowoverflow: true,
    //   minwidth: "100px",
    //   maxWidth: "700px",
    //   cell: (row) => {
    //     return (
    //       <div className="flex gap-1">
    //         <button
    //           style={{
    //             backgroundColor: row.status === 'pending' ? '#c77dff' : "" || row?.status === 'accepted' ? "#06D6A0" : '' || row?.status === 'completed' ? "#06D6A0" : '' || row?.status === 'cancelled' ? "#d15a5a" : '' || row?.status === 'complete_request' ? "#06D6A0" : '',
    //             // backgroundColor: "#f4f4f4",
    //             width: "max-content",
    //           }}
    //           disabled
    //           className={`text_white flex justify-center rounded-2 py-1 px-2 items-center relative`}
    //         >
    //           {row?.status}
    //         </button>
    //         {row?.status === "completed" ? (
    //           <>
    //             {row?.transaction ? (
    //               <>
    //                 <div className="PaidBtn me-3 text-success manrope_medium">
    //                   Paid
    //                 </div>
    //               </>
    //             ) : (
    //               <>
    //                 <div
    //                   className="noPaidBtn me-3 manrope_medium"
    //                   onClick={() => HandleAmountOpen(row)}
    //                 >
    //                   Pay
    //                 </div>
    //               </>
    //             )}
    //           </>
    //         ) : (
    //           ""
    //         )}
    //       </div>
    //     );
    //   },
    // },
  ];

  const fetchData = async () => {
    setLoading(true);
    // try {
    //   const res = await axiosInstance.get(
    //     `api/order/admin/${lastId}/${orderType?.value}`,
    //     { headers }
    //   );
    //   if (res?.data) {
    //     setCategories(res?.data?.orders);
    //     setcount(res?.data?.count?.totalPage);
    //   }
    //   setLoading(false);
    // } catch (error) {
    //   setLoading(false);
    //   // console.log(error);
    // } finally {
    //   setLoading(false);
    // }
  };

  // useEffect(() => {
  //   fetchData();
  // }, [lastId, orderType]);

  const initialValues = {
    amount: "",
  };

  // amount submit funtion

  const handleSubmit = async (values) => {
    const formData = {
      amount: values?.amount,
    };
    setIsProcessing(true);
    try {
      const res = await axiosInstance.put(
        `api/order/admin/pay/${orderID}`,
        formData,
        { headers }
      );
      if (res?.data?.success) {
        const updatedOrder = res?.data?.order;
        // setCategories((prevCategories) =>
        //   prevCategories?.map((category) =>
        //     category?._id === orderID ? updatedOrder : category
        //   )
        // );
        fetchData();
        message.success("Order updated successfully");
        HandleAmountClose();
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <>
      <StyleSheetManager
        shouldForwardProp={(prop) => !["sortActive"].includes(prop)}
      >
        <main className="lg:container p-4 mx-auto" style={{ minHeight: '90vh' }}>
          <div className="flex flex-col mb-4 w-full">
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="manrope_bold text_black">Estimates</h4>
              {/* <div style={{ width: "200px" }}>
                <Select
                  options={OrdersOption}
                  value={orderType}
                  onChange={handleChange}
                  defaultValue={OrdersOption[0]}
                />
              </div> */}
            </div>
          </div>
          {loading ? (
            <main className="my-5 d-flex w-100 justify-content-center align-items-center">
              <CircularProgress size={24} className="text_dark" />
            </main>
          ) : !categories || categories.length === 0 ? (
            <main className="my-5 d-flex w-100 justify-content-center align-items-center">
              <span className="text_secondary manrope_medium">
                No Estimate Found
              </span>
            </main>
          ) : (
            <ProductTable
              count={count}
              loading={loading}
              setCurrentPage={setLastId2}
              currentPage={lastId2}
              columns={columns}
              data={categories}
              setLastId={setLastId}
            />
          )}
        </main>
      </StyleSheetManager>

      {/* modela pay amount */}

      <Modal open={modalPay} centered onCancel={HandleAmountClose} footer={null}>
        <section>
          <Form
            className="flex flex-wrap"
            form={form}
            initialValues={initialValues}
            onFinish={handleSubmit}
          >
            <Col span={24} className="mt-">
              <h6 className="manrope_medium text-[#252C32]">Enter Amount</h6>
              <Form.Item
                name="amount"
                className="mt-2 mb-[20px]"
                rules={[
                  {
                    required: true,
                    message: "Please enter the amount",
                  },
                ]}
              >
                <Input
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  type="number"
                  placeholder="Enter Amount"
                />
              </Form.Item>
            </Col>
            <div className="d-flex w-100 justify-content-end">
              <button
                type="submit"
                // disabled={fileLoading || isProcessing}
                className="px-4 py-2 text_white rounded-3 bg_dark manrope_medium"
              >
                {isProcessing ? (
                  <>
                    <CircularProgress size={12} />
                  </>
                ) : (
                  <>Submit</>
                )}
              </button>
            </div>
          </Form>
        </section>
      </Modal >

      {/* bank detail modal */}

      < Modal open={bankModal} centered onCancel={HandleDetailClose} footer={null} >
        <section>
          <Form className="flex flex-wrap">
            <Col span={24} className="mt-">
              <h6 className="manrope_medium text-[#252C32]">Account Title</h6>
              <Form.Item className="mt-2 mb-[20px]">
                <Input
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  disabled
                  placeholder="Enter Amount"
                  value={bankDetail?.acc_title}
                />
              </Form.Item>
              <h6 className="manrope_medium text-[#252C32]">Bank Name</h6>
              <Form.Item className="mt-2 mb-[20px]">
                <Input
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  disabled
                  placeholder="Enter Amount"
                  value={bankDetail?.bank_name}
                />
              </Form.Item>
              <h6 className="manrope_medium text-[#252C32]">Account No</h6>
              <Form.Item className="mt-2 mb-[20px]">
                <Input
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  disabled
                  placeholder="Enter Amount"
                  value={bankDetail?.acc_numb}
                />
              </Form.Item>
              <h6 className="manrope_medium text-[#252C32]">Name</h6>
              <Form.Item className="mt-2 mb-[20px]">
                <Input
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  disabled
                  placeholder="Enter Amount"
                  value={bankDetail?.name}
                />
              </Form.Item>
              <h6 className="manrope_medium text-[#252C32]">Email</h6>
              <Form.Item className="mt-2 mb-[20px]">
                <Input
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  disabled
                  placeholder="Enter Amount"
                  value={bankDetail?.email}
                />
              </Form.Item>
              <h6 className="manrope_medium text-[#252C32]">Phone</h6>
              <Form.Item className="mt-2 mb-[20px]">
                <Input
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  disabled
                  placeholder="Enter Amount"
                  value={bankDetail?.phone}
                />
              </Form.Item>

            </Col>
            <div className="d-flex w-100 justify-content-end">
              <button
                onClick={HandleDetailClose}
                className="px-4 py-2 text_white rounded-3 bg_dark manrope_medium"
              >
                Close
              </button>
            </div>
          </Form>
        </section>
      </Modal>
    </>
  );
};

export default Estimates;
