/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ProductTable from "../DataTable/productTable";
import { StyleSheetManager } from "styled-components";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { AiFillEdit } from "react-icons/ai";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "react-bootstrap/Modal";
import { Form, Input, message } from "antd";
import { Col, FormLabel, Row } from "react-bootstrap";
import { edit2, fileavatar, profileavatar, trash } from "../icons/icon";
import axiosInstance, { headers } from "./ApiFunction/axiosInstance";
const Referal = () => {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [statusId, setStatusId] = useState("");
  const [lastId, setLastId] = useState(1);
  const [lastId2, setLastId2] = useState(0);
  const [count, setcount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [show, setShow] = useState(false);
  const [form] = Form.useForm();
  const [discountModal, setDiscountModal] = useState(false);
  const [editData, setEditData] = useState("");

  const HandleReferalOpen = (row) => {
    setShow(true);
    setEditData(row);
  };
  const HandleReferalClose = () => {
    setEditData("");
    setShow(false);
  };

  const columns = [
    {
      name: "Credits",
      sortable: true,
      minWidth: "110px",
      maxWidth: "600px",
      selector: (row) => row?.credit_given,
    },

    {
      name: "Discount per Credits",
      sortable: true,
      minWidth: "110px",
      maxWidth: "600px",
      selector: (row) => row?.discount_per_credit,
    },
    {
      name: "Discount",
      sortable: true,
      minWidth: "110px",
      maxWidth: "600px",
      selector: (row) => row?.discount,
    },

    {
      name: "Action",
      allowoverflow: true,
      minWidth: "110px",
      maxWidth: "600px",
      cell: (row) => {
        return (
          <div className="flex gap-1">
            <button
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "#54A6FF",
              }}
              onClick={() => HandleReferalOpen(row)}
              className="flex justify-center manrope_medium text-xs text_white rounded-3 items-center"
            >
              <img
                style={{ width: "14px", height: "auto" }}
                src={edit2}
                alt=""
              />
            </button>
          </div>
        );
      },
    },
  ];

  // fetchh  all credits
  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get(`api/users/admin/credit`, {
        headers,
      });
      if (res?.data?.success) {
        setCategories([res?.data?.credit]);
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
  }, []);

  //   /api/users/admin/credit.    =>post
  // credit_given,discount_per_credit

  // handle update credits
  const handleSubmit = async (values) => {
    setLoading2(true);
    try {
      const res = await axiosInstance.post(
        `api/users/admin/credit`,
        {
          credit_given: values?.credits,
          discount_per_credit: values?.discount_credist,
          discount: values?.discount,
        },
        { headers }
      );
      if (res?.data?.success) {
        setCategories([res?.data?.credit]);
        setShow(false);
      }
    } catch (error) {
      message.error("not updated");
      // console.log(error);
      setLoading2(false);
    } finally {
      setLoading2(false);
    }
  };

  const initialCredistValues = {
    referal: 1,
    credits: editData?.credit_given,
    discount: editData?.discount,
    discount_credist: editData?.discount_per_credit,
  };

  return (
    <>
      <StyleSheetManager
        shouldForwardProp={(prop) => !["sortActive"].includes(prop)}
      >
        <main className="min-h-screen lg:container py-5 px-4 mx-auto">
          <div className="flex items-center justify-content-between mb-3 gap-3">
            <h5 className="plusJakara_semibold text_dark">Referal</h5>
          </div>

          {loading ? (
            <>
              <main className="my-5 d-flex w-100 justify-content-center align-items-center">
                <CircularProgress size={24} className="text_dark" />
              </main>
            </>
          ) : (
            <>
              <ProductTable
                count={count}
                loading={loading}
                setCurrentPage={setLastId2}
                currentPage={lastId2}
                columns={columns}
                data={categories}
                setLastId={setLastId}
              />
            </>
          )}
        </main>
        {/* referal set modal */}
      </StyleSheetManager>
      {/* modal start */}
      <Modal backdrop="static" show={show} onHide={HandleReferalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="modaltitl00">
            Update Credit & Discount
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            form={form}
            initialValues={initialCredistValues}
            onFinish={handleSubmit}
          >
            <Row>
              <Col lg={12} className="mb-1">
                <FormLabel className="modalLabel00">Referal</FormLabel>
                <Form.Item name="referal" className="mt-2 mb-[20px]">
                  <Input
                    readOnly
                    disabled
                    size="large"
                    className="manrope_regular text-[#9AA6AC]"
                    type="text"
                    placeholder="Enter Referal"
                  />
                </Form.Item>
              </Col>
              <Col lg={12} className="mb-1">
                <FormLabel className="modalLabel00">Credits</FormLabel>
                <Form.Item
                  name="credits"
                  className="mt-2 mb-[20px]"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the Credits",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    className="manrope_regular text-[#9AA6AC]"
                    type="number"
                    placeholder="Enter Credits"
                  />
                </Form.Item>
              </Col>

              <Col lg={12} className="mb-1">
                <FormLabel className="modalLabel00">Discount %</FormLabel>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please enter the Discount",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          value === undefined ||
                          value === "" ||
                          (value >= 0 && value <= 100)
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Discount must be between 0 and 100")
                        );
                      },
                    }),
                  ]}
                  name="discount"
                  className="mt-2 mb-[20px]"
                >
                  <Input
                    size="large"
                    className="manrope_regular text-[#9AA6AC]"
                    type="text"
                    placeholder="Enter discount"
                  />
                </Form.Item>
              </Col>
              <Col lg={12} className="mb-1">
                <FormLabel className="modalLabel00">
                  Discount Per Credits
                </FormLabel>
                <Form.Item
                  name="discount_credist"
                  className="mt-2 mb-[20px]"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Credits",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    className="manrope_regular text-[#9AA6AC]"
                    type="number"
                    placeholder="Enter Credits"
                  />
                </Form.Item>
              </Col>
            </Row>

            <button
              disabled={loading2}
              // onClick={HandleReferalClose}
              type="submit"
              className="px-4 py-2 text_white rounded-3 bg_dark manrope_medium"
            >
              {loading2 ? (
                <>
                  <CircularProgress
                    size={13}
                    style={{ color: "white" }}
                    className="text_dark"
                  />
                </>
              ) : (
                "Update"
              )}
            </button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* handle discount credits  */}
    </>
  );
};

export default Referal;
