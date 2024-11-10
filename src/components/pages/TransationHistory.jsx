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
import axiosInstance from "./ApiFunction/axiosInstance";
import { headers } from "./ApiFunction/axiosInstance";
import Moment from "react-moment";
import moment from "moment";

const TransationHistory = () => {
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState(1);
  const [lastId2, setLastId2] = useState(0);
  const [count, setcount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [bankModal, setBankModal] = useState(false);
  const [bankDetail, setBankDetail] = useState("");

  const HandleDetailOpen = (row) => {
    setBankModal(true);
    setBankDetail(row?.order);
  };
  const HandleDetailClose = () => {
    setBankModal(false);
    setBankDetail("");
  };

  const columns = [
    {
      name: "Order ID",
      sortable: true,
      minWidth: "110px",
      maxWidth: "200px",
      selector: (row) => (
        <>
          <span onClick={() => HandleDetailOpen(row)} className="cursorP idCl0">
            {row?.order?._id}
          </span>
        </>
      ),
    },
    {
      name: "User Name",
      minWidth: "110px",
      maxWidth: "200px",
      sortable: true,
      selector: (row) =>
        row?.user?.name || 'Not found',
    },
    {
      name: "Email",
      sortable: true,
      minWidth: "110px",
      maxWidth: "250px",
      selector: (row) => row?.user?.email,
    },
    {
      name: "Phone",
      sortable: true,
      selector: (row) => row?.user?.phone,
      minWidth: "110px",
      maxWidth: "200px",
    },
    // {
    //   name: "Address",
    //   sortable: true,
    //   selector: (row) => row?.user?.location?.address,
    //   minWidth: "110px",
    //   maxWidth: "250px",
    // },
    {
      name: "Balance",
      sortable: true,
      selector: (row) => row?.balance,
      minWidth: "110px",
      maxWidth: "200px",
    },
    {
      name: "Description",
      sortable: true,
      selector: (row) => row?.description,
      minWidth: "110px",
      maxWidth: "250px",
    },
    {
      name: "Date",
      sortable: true,
      selector: (row) => (
        <Moment format="DD/MMMM/YYYY">{row?.createdAt}</Moment>
      ),

      minWidth: "110px",
      maxWidth: "200px",
    },
  ];
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `api/users/admin/transactions/${lastId}`,
        { headers }
      );
      if (res?.data?.success) {
        setCategories(res?.data?.Transactions);
        setcount(res?.data?.count?.totalPage);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lastId]);

  return (
    <>
      <StyleSheetManager
        shouldForwardProp={(prop) => !["sortActive"].includes(prop)}
      >
        <main className="min-h-screen lg:container py-3 px-4 mx-auto">
          <div className="flex flex-col mb-3 w-full">
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="manrope_bold text_black">Transation History</h4>
            </div>
          </div>
          {loading ? (
            <main className="my-5 d-flex w-100 justify-content-center align-items-center">
              <CircularProgress size={24} className="text_dark" />
            </main>
          ) : !categories || categories.length === 0 ? (
            <main className="my-5 d-flex w-100 justify-content-center align-items-center">
              <span className="text_secondary manrope_medium">
                No Order Found
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

      <Modal open={bankModal} onCancel={HandleDetailClose} footer={null}>
        <section>
          <Form className="flex flex-wrap">
            <Col span={24} className="mt-">
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
              {/* <h6 className="manrope_medium text-[#252C32]">Email</h6>
              <Form.Item className="mt-2 mb-[20px]">
                <Input
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  disabled
                  placeholder="Enter Amount"
                  value={bankDetail?.email}
                />
              </Form.Item> */}
              <h6 className="manrope_medium text-[#252C32]">Status</h6>
              <Form.Item className="mt-2 mb-[20px]">
                <Input
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  disabled
                  placeholder="Enter Amount"
                  value={bankDetail?.status}
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
              <h6 className="manrope_medium text-[#252C32]">Date</h6>

              <Form.Item className="mt-2 mb-[20px]">
                {/* <div disabled className="manrope_regular text-[#9AA6AC]">
                  <Moment format="DD/MMMM/YYYY">{bankDetail?.date}</Moment>
                </div> */}
                <Input
                  size="large"
                  // type="date"
                  className="manrope_regular text-[#9AA6AC]"
                  disabled
                  placeholder="Enter Amount"
                  value={moment(bankDetail?.date).format("DD/MMMM/YYYY")}
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

export default TransationHistory;
