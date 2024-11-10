/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Col, Form, Input, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { edit2, fileavatar, trash } from "../icons/icon";
import { Input as InputStrap } from "reactstrap";
import { CircularProgress } from "@mui/material";
import ProductTable from "../DataTable/productTable";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
import axios from "axios";
import axiosInstance, { headers } from "./ApiFunction/axiosInstance";

const Ammendies = () => {
  // states-------
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessing2, setIsProcessing2] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [lastId, setLastId] = useState(1);
  const [categories, setCategories] = useState([]);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedItem, setselectedItem] = useState(null);
  const [selectedItem2, setselectedItem2] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [loadingstatus, setloadingstatus] = useState(false);
  const [statusId, setstatusId] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [lastId2, setLastId2] = useState(0);
  const [modal, setModal] = useState(false);
  const [count, setcount] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [courseImage, setCourseImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedItem2) {
      setCourseImage(selectedItem2?.image);
      setSelectedImg(selectedItem2?.image);
      form.setFieldsValue({ catName: selectedItem2?.name });
      setIsEditMode(true);
    } else {
      form.resetFields();
      setCourseImage(null);
      setSelectedImg(null);
      setIsEditMode(false);
    }
  }, [selectedItem2, form]);
  const uploadFoodFile = (courseFile) => {
    setFileLoading(true);
    if (!courseFile) return;
    const currentDate = new Date();
    const uniqueFileName = `${currentDate.getTime()}_${courseFile?.name}`;
    const imageRef = ref(storage, `ammendy_image/${uniqueFileName}`);
    uploadBytes(imageRef, courseFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setFileLoading(false);
        setCourseImage(url);
      });
    });
  };

  const handleCourseFile = (e) => {
    setFileLoading(true);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImg(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImg(null);
    }
    if (file) {
      uploadFoodFile(file);
    }
  };

  const handleSubmit = async (values) => {
    setIsProcessing(true);
    try {
      const res = await axiosInstance.post(
        `api/facilities/create`,
        {
          name: values?.catName,
          //   image: courseImage,
        },
        { headers }
      );
      if (res.data) {
        message.success("Ammendy created Successfully");
        fetchData();
        form.resetFields();
        setSelectedImg("");
      }
    } catch (error) {
      setIsProcessing(false);
      message.error("Your Ammendy did not create");
      // console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleSubmit2 = async (values) => {
    setIsProcessing2(true);
    try {
      const res = await axiosInstance.put(
        `api/facilities/edit/${selectedItem2?._id}`,
        {
          name: values?.catName,
          //   image: courseImage,
        },
        { headers }
      );
      if (res) {
        message.success("Ammendy updated Successfully");
        fetchData();
        setselectedItem2(null);
        form.resetFields();
        setSelectedImg("");
      }
    } catch (error) {
      setIsProcessing2(false);
      message.error("Your Ammendy did not create");
      // console.log(error);
    } finally {
      setIsProcessing2(false);
    }
  };

  const handleUpdate2 = async (row) => {
    setstatusId(row?._id);

    setloadingstatus(true);
    let newStatus;
    if (row?.status === "active") {
      newStatus = "deactivated";
    } else if (row?.status === "deactivated") {
      newStatus = "active";
    }
    try {
      const res = await axiosInstance.put(
        `api/facilities/${newStatus}/${row._id}`,
        {},
        { headers }
      );
      if (res) {
        message.success(`Status updated Successfully`);
        fetchData();
      } else {
        message.error("Status not updated");
      }
    } catch (error) {
      setloadingstatus(false);
      // console.log(error);
    } finally {
      setloadingstatus(false);
    }
  };

  const handleClick = (row) => {
    setselectedItem(row);
    setShowDelete(true);
  };
  const handleClick2 = (row) => {
    setselectedItem2(row);
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `api/facilities/admin/${lastId}`,
        { headers }
      );
      if (res?.data) {
        setCategories(res?.data?.facilities);
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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImagePreview(true);
  };

  const columns = [
    {
      name: "Amenities Name",
      sortable: true,
      minWidth: "110px",
      maxWidth: "250px",
      selector: (row) => row?.name,
    },
    // {
    //   name: "Icon",
    //   sortable: true,
    //   cell: (row) => {
    //     return (
    //       <div className="">
    //         <img
    //           src={row?.image}
    //           onClick={() => handleImageClick(row?.image)}
    //           className="rounded-5"
    //           style={{
    //             width: "40px",
    //             height: "40px",
    //             objectFit: "cover",
    //             cursor: "pointer",
    //           }}
    //           alt=""
    //         />
    //       </div>
    //     );
    //   },
    // },
    {
      name: "Action",
      allowoverflow: true,
      noSort: true,
      minwidth: "112px",
      cell: (row) => {
        return (
          <div className="flex gap-1">
            <button
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "#54A6FF",
              }}
              onClick={() => handleClick2(row)}
              className="bg-[#54A6FF] flex justify-center rounded-3 items-center"
            >
              <img
                style={{ width: "14px", height: "auto" }}
                src={edit2}
                alt=""
              />
            </button>
            <button
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "#CE2C60",
              }}
              onClick={() => handleClick(row)}
              className="bg-[#CE2C60] flex justify-center rounded-3 items-center"
            >
              <img
                style={{ width: "14px", height: "auto" }}
                src={trash}
                alt=""
              />
            </button>
          </div>
        );
      },
    },
    {
      name: "Status",
      allowoverflow: true,
      cell: (row) => {
        return (
          <div className="flex gap-1">
            <button
              style={{
                backgroundColor:
                  row?.status === "active" ? "#d15a5a" : "#06D6A0",
              }}
              disabled={loadingstatus}
              onClick={() => handleUpdate2(row)}
              className={`text_white flex justify-center rounded-2 py-1 px-2 items-center relative`}
            >
              {statusId === row?._id && loadingstatus ? (
                <CircularProgress size={15} color="inherit" />
              ) : row.status === "active" ? (
                "Deactivate now"
              ) : (
                "Activate now"
              )}
            </button>
          </div>
        );
      },
    },
  ];
  const handleDelete = async () => {
    setLoading2(true);
    try {
      const res = await axiosInstance.delete(
        `api/facilities/${selectedItem?._id}`,
        { headers }
      );
      if (res?.data) {
        fetchData();
        setShowDelete(false);
      }
      setLoading2(false);
    } catch (error) {
      setLoading2(false);
      setShowDelete(false);
      // console.log(error);
    } finally {
      setLoading2(false);
    }
  };

  return (
    <>
      <div>
        <main className="min-h-screen lg:container py-5 px-4 mx-auto">
          <div className="flex justify-between max-md:flex-col max-md:gap-3 mb-2 md:items-center w-full">
            <div className="w-full">
              <h3 className="manrope_bold mb-3 text_black">Amenities</h3>
              <h6 className="text_secondary max-md:text-sm manrope_regular mb-3">
                Explore our wide selection of categories and add the ones that
                best suit your needs!
              </h6>
              <div className="">
                <Card
                  className="p-3 border-0  w-100"
                  style={{
                    maxWidth: "30rem",
                    height: "auto",
                    boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
                  }}
                >
                  <Form
                    className="flex flex-wrap"
                    form={form}
                    initialValues={{
                      catName: selectedItem2?.name,
                    }}
                    onFinish={isEditMode ? handleSubmit2 : handleSubmit}
                  >
                    <Col span={24} className="mt-">
                      {/* <h6 className="manrope_medium text-[#252C32]">
                        {isEditMode ? "Edit Ammendy" : "Add Ammendy"}{" "}
                      </h6>
                      <div className="flex flex-col mb-3 gap-2">
                        <div>
                          <label
                            style={{ cursor: "pointer" }}
                            htmlFor="fileInput"
                            className="cursor-pointer"
                          >
                            {fileLoading ? (
                              <div
                                style={{ width: "120px", height: "100px" }}
                                className="border rounded-3 d-flex justify-content-center align-items-center"
                              >
                                <CircularProgress size={20} />
                              </div>
                            ) : selectedImg ? (
                              <img
                                src={selectedImg}
                                alt="Preview"
                                style={{
                                  width: "120px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                                className="rounded-3 object-cover"
                              />
                            ) : (
                              <div
                                style={{ width: "120px", height: "100px" }}
                                className="border rounded-3 flex justify-center items-center"
                              >
                                <img src={fileavatar} alt="Camera Icon" />
                              </div>
                            )}
                          </label>
                          <InputStrap
                            type="file"
                            // required
                            id="fileInput"
                            className="visually-hidden"
                            onChange={handleCourseFile}
                          />
                        </div>
                      </div> */}
                      <Form.Item
                        name="catName"
                        className="mt-2 mb-[20px]"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the Amenities Name",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          className="manrope_regular text-[#9AA6AC]"
                          type="text"
                          placeholder="Amenities Name"
                        />
                      </Form.Item>
                    </Col>
                    <div className="d-flex w-100 justify-content-end">
                      <button
                        type="submit"
                        disabled={fileLoading || isProcessing || isProcessing2}
                        className="px-4 py-2 text_white rounded-3 bg_dark manrope_medium"
                      >
                        {isEditMode ? (
                          isProcessing2 ? (
                            <CircularProgress color="inherit" size={16} />
                          ) : (
                            "Update"
                          )
                        ) : isProcessing ? (
                          <CircularProgress color="inherit" size={16} />
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  </Form>
                </Card>
              </div>
            </div>
          </div>
          <div className="mt-3 ">
            <h4 className="mt-5 manrope_bold mb-3">Amenities List</h4>
            {loading ? (
              <main className="my-5 d-flex w-100 justify-content-center align-items-center">
                <CircularProgress size={24} className="text_dark" />
              </main>
            ) : !categories || categories.length === 0 ? (
              <main className="my-5 d-flex w-100 justify-content-center align-items-center">
                <span className="text_secondary manrope_medium">
                  No Ammendy Found
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
          </div>
        </main>
      </div>

      <Modal
        open={showImagePreview}
        onCancel={() => setShowImagePreview(false)}
        footer={null}
      >
        <img
          src={selectedImage}
          alt={selectedImage}
          className="object-cover w-full"
          style={{ maxHeight: "30rem" }}
        />
      </Modal>
      <Modal

        open={showDelete}
        onCancel={() => setShowDelete(false)}
        footer={null}
      >
        <h6 className="text_dark manrope_medium">
          Are you want to delete this ammendy?
        </h6>
        <div className="flex justify-center gap-2 w-full my-3">
          <button
            type="button"
            className={`border cursor-pointer rounded-lg gap-1 px-3 py-2 inter_medium text-sm flex justify-center items-center bg_primary text_white`}
            onClick={() => setShowDelete(false)}
          >
            No
          </button>
          <button
            type="button"
            disabled={loading2}
            className={`border rounded-lg gap-1 px-3 py-2 inter_medium text-sm flex justify-center items-center bg_white text_secondary`}
            onClick={() => handleDelete(selectedItem)}
          >
            {loading2 ? <CircularProgress size={14} color="inherit" /> : "Yes"}
          </button>
        </div>
      </Modal>
      {/* <Modal
                
                open={modal}
                onCancel={() => setModal(false)}
                footer={null}
            >
                <h4 className="mt-5 manrope_bold mb-3">Update Ammendy</h4>
                <Form className="flex flex-wrap" form={form}
                    initialValues={{
                        catName2: selectedItem2?.name
                    }}
                    onFinish={handleSubmit2}>
                    <Col span={24} className="mt-">
                        <div className="flex flex-col mb-3 gap-2">
                            <div>
                                <label style={{ cursor: 'pointer' }} htmlFor="fileInput" className="cursor-pointer">
                                    {fileLoading ? <div style={{ width: '120px', height: '100px', }} className='border rounded-3 d-flex justify-content-center align-items-center'>
                                        <CircularProgress size={20} />
                                    </div> :
                                        selectedImg ? (
                                            <img src={selectedImg} alt="Preview" style={{ width: '120px', height: '100px', objectFit: 'cover' }} className="rounded-3 object-cover" />
                                        ) : (
                                            <div style={{ width: '120px', height: '100px' }} className="border rounded-3 flex justify-center items-center">
                                                <img src={fileavatar} alt="Camera Icon" />
                                            </div>
                                        )}
                                </label>
                                <InputStrap
                                    type="file"
                                    // required
                                    id="fileInput"
                                    className="visually-hidden"
                                    onChange={handleCourseFile}
                                />
                            </div>
                        </div>
                        <Form.Item
                            name="catName2"
                            className="mt-2 mb-[20px]"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter the Ammendy Name",
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                className="manrope_regular text-[#9AA6AC]"
                                type="text"
                                placeholder="Ammendy Name"
                            />
                        </Form.Item>
                    </Col>
                    <div className="d-flex w-100 justify-content-end">
                        {isProcessing2 === false ? (
                            <button
                                type="submit"
                                disabled={fileLoading}
                                className="px-4 py-2 text_white rounded-3 bg_dark manrope_medium"
                            >
                                Update
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="px-5 py-2 text_white rounded-3 bg_dark manrope_medium"
                                disabled
                            >
                                <CircularProgress color="inherit" size={16} />
                            </button>
                        )}
                    </div>
                </Form>
            </Modal> */}
    </>
  );
};

export default Ammendies;
