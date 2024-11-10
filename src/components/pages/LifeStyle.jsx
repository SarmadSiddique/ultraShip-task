/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Col, DatePicker, Form, Input, Modal, TimePicker, message } from "antd";
import React, { useEffect, useState } from "react";
import { Card, Row } from "react-bootstrap";
import { edit2, fileavatar, trash } from "../icons/icon";
import { Input as InputStrap } from "reactstrap";
// import { createCategory, getCategory } from "../api/category";
import { CircularProgress } from "@mui/material";
import ProductTable from "../DataTable/productTable";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
import axios from "axios";
import { Plus } from "react-feather";
import { RxCross2 } from "react-icons/rx";
import TextArea from "antd/es/input/TextArea";
import Carousel from "react-bootstrap/Carousel";
import axiosInstance, {
  headers,
  GoogleApiKey,
} from "./ApiFunction/axiosInstance";
import moment from "moment";
import Autocomplete from "react-google-autocomplete";
import ImageLoader from "./ImageLoader/ImageLoader";

const LifeStyle = () => {
  // states-------
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [lastId, setLastId] = useState(1);
  const [events, setEvents] = useState([]);
  const [lastId2, setLastId2] = useState(0);
  const [selectedItem, setselectedItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [count, setcount] = useState(0);
  const [form] = Form.useForm();
  const [eventModal, setEventModal] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [selectedImgs, setSelectedImgs] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState("");
  const [address, setAddress] = useState("");

  const HandleEventClose = () => {
    setEventModal(false);
    form.setFieldsValue({
      title: "",
      description: "",
      webUrl: "",
    });
    setSelectedImgs([]);
  };
  const HandleEventOpen = () => {
    setEventModal(true);
  };
  const HandleEditClose = () => {
    setEditModal(false);
    form.setFieldsValue({
      title: "",
      description: "",
      webUrl: "",
    });
    setSelectedImgs([]);
  };
  const HandleEditOpen = (row) => {
    setEditModal(true);
    setEditData(row);
  };

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        title: editData?.title,
        description: editData?.description,
        webUrl: editData?.url,
        date: moment(editData?.event_date, "DD MMM, YYYY"), // Convert event_date to moment object
        time: moment(editData?.event_time, "hh:mmA"), // Convert event_time to moment object
      });
      setAddress(editData?.event_location);
      setSelectedImgs(editData?.images);
      setImageUrls(editData?.images);
    }
  }, [editData, form]);

  const initialValues = {
    images: [],
    title: "",
    description: "",
    webUrl: "",
    event_time: "",
    event_date: "",
    event_location: "",
  };
  //

  const handleClick = (row) => {
    setselectedItem(row);
    setShowDelete(true);
  };

  //   upload images multiple start
  const uploadFoodFile = (courseFile) => {
    setFileLoading(true);
    if (!courseFile) return;

    const currentDate = new Date();
    const uniqueFileName = `${currentDate.getTime()}_${courseFile?.name}`;
    const imageRef = ref(storage, `events/${uniqueFileName}`);

    uploadBytes(imageRef, courseFile)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            setFileLoading(false);
            setImageUrls((prevUrls) => [...prevUrls, url]);
          })
          .catch((error) => {
            setFileLoading(false);
            console.error("Error getting download URL: ", error);
          });
      })
      .catch((error) => {
        setFileLoading(false);
        console.error("Error uploading file: ", error);
        message.error("Error uploading file");
      });
  };

  const handleCourseFile = (e) => {
    if (selectedImgs.length >= 4) {
      message.error("You can only upload a maximum of 4 images.");
      return;
    }
    setFileLoading(true);
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImgs((prevImgs) => [...prevImgs, reader.result]);
      };
      reader.readAsDataURL(file);
      uploadFoodFile(file);
    } else {
      setFileLoading(false);
    }
  };

  const removeImage = (index) => {
    setSelectedImgs((prevImgs) => prevImgs.filter((_, i) => i !== index));
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  //   fetech all events

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`api/users/events/all/${lastId}`, {
        headers,
      });
      if (res?.data?.success) {
        setEvents(res?.data?.events);
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

  //   handle dell events
  const handleDelete = async () => {
    setLoading2(true);
    try {
      const res = await axiosInstance.delete(
        `api/users/admin/events/${selectedItem?._id}`,
        { headers }
      );
      if (res?.data?.success) {
        setEvents((prevEvents) =>
          prevEvents?.filter((event) => event?._id !== selectedItem?._id)
        );
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

  // image prev section start
  const [selectedImage, setSelectedImage] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImagePreview(true);
  };

  const columns = [
    {
      name: "Title",
      sortable: true,
      selector: (row) => row?.title,
      minWidth: "110px",
    },
    {
      name: "Images",
      sortable: true,
      minWidth: "110px",
      maxWidth: "200px",
      cell: (row) => {
        return (
          <div onClick={() => handleImageClick(row?.images)}>
            <ImageLoader
              circeltrue={false}
              imageUrl={row?.images[0]}
              classes={"rounded-1 catIm00"}
            />
          </div>
        );
      },
    },
    {
      name: "Description",
      sortable: true,
      selector: (row) => row?.description,
      minWidth: "110px",
      maxWidth: "500px",
    },
    {
      name: "Url",
      sortable: true,
      selector: (row) => row?.url,
      minWidth: "110px",
    },

    {
      name: "Action",
      allowoverflow: true,
      noSort: true,
      minWidth: "110px",
      cell: (row) => {
        return (
          <div className="flex gap-1">
            <button
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "#54A6FF",
              }}
              onClick={() => HandleEditOpen(row)}
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
  ];

  //   handle submit data

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePlaceSelected = (place) => {
    setAddress(place.formatted_address);
  };

  const handleSubmit = async (values) => {
    const formattedDate = values?.date
      ? values?.date.format("DD MMM, YYYY")
      : "";
    const formattedTime = values?.time ? values?.time.format("hh:mmA") : "";

    setIsProcessing(true);
    try {
      const res = await axiosInstance.post(
        `api/users/admin/events`,
        {
          images: imageUrls,
          title: values?.title,
          description: values?.description,
          url: values?.webUrl || "",
          event_time: formattedTime || "",
          event_date: formattedDate || "",
          event_location: address || "",
        },
        { headers }
      );
      if (res?.data?.success) {
        message.success("Events created Successfully");
        form.resetFields();
        setSelectedImgs([]);
        setImageUrls([]);
        HandleEventClose();
        const newEvent = res?.data?.event;
        setEvents((prevevents) => {
          if (Array.isArray(prevevents)) {
            // Add the new event to the top of the list
            return [newEvent, ...prevevents];
          }
          return [newEvent];
        });
      }
    } catch (error) {
      setIsProcessing(false);
      message.error("Your Events did not create");
      // console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  //  handle submit edit

  const HandleEditSubmit = async (values) => {
    const formattedDate = values?.date
      ? values?.date.format("DD MMM, YYYY")
      : "";
    const formattedTime = values?.time ? values?.time.format("hh:mmA") : "";
    setIsProcessing(true);
    try {
      const res = await axiosInstance.put(
        `api/users/admin/events/${editData?._id}`,
        {
          images: imageUrls,
          title: values?.title,
          description: values?.description,
          url: values?.webUrl || "",
          event_time: formattedTime || "",
          event_date: formattedDate || "",
          event_location: address || "",
        },
        { headers }
      );
      if (res) {
        message.success("Events Updated Successfully");
        const updatedEvent = res?.data?.event;
        setEvents((prevEvents) =>
          prevEvents?.map((event) =>
            event?._id === editData?._id ? updatedEvent : event
          )
        );
        HandleEditClose();
      }
    } catch (error) {
      setIsProcessing(false);
      message.error("Your Service did not Update");
      // console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // images prev secion start
  return (
    <>
      <main className="min-h-screen lg:container py-5 px-4 mx-auto">
        <div className="flex justify-between max-md:flex-col max-md:gap-3 mb-2 md:items-center w-full">
          <div className="w-full">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="manrope_bold mb-3 text_black">
                Events & LifeStyle
              </h3>

              <button
                onClick={HandleEventOpen}
                className="flex justify-center bg_primary p-2 rounded-3 items-center gap-2"
              >
                <Plus size={18} className="text_white" />
                <span className="manrope_medium text_white">Add Events</span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3">
          {loading ? (
            <main className="my-5 d-flex w-100 justify-content-center align-items-center">
              <CircularProgress size={24} className="text_dark" />
            </main>
          ) : !events || events?.length === 0 ? (
            <main className="my-5 d-flex w-100 justify-content-center align-items-center">
              <span className="text_secondary manrope_medium">
                No Events Found
              </span>
            </main>
          ) : (
            <ProductTable
              count={count}
              loading={loading}
              setCurrentPage={setLastId2}
              currentPage={lastId2}
              columns={columns}
              data={events}
              setLastId={setLastId}
            />
          )}
        </div>
      </main>

      {/* dell events modal */}
      <Modal
        open={showDelete}
        onCancel={() => setShowDelete(false)}
        footer={null}
      >
        <h6 className="text_dark manrope_medium">
          Are you want to delete this category?
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

      {/* events create modal start */}

      <Modal open={eventModal} onCancel={HandleEventClose} footer={null}>
        <section>
          <Form
            className="flex flex-wrap"
            form={form}
            initialValues={initialValues}
            onFinish={handleSubmit}
          >
            <Col span={24} className="mt-">
              <h6 className="manrope_medium text-[#252C32]">Add Images</h6>
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
                    ) : (
                      <div
                        style={{ width: "120px", height: "100px" }}
                        className="border rounded-3 flex justify-center items-center"
                      >
                        <span>Upload Image</span>
                      </div>
                    )}
                  </label>
                  <input
                    disabled={fileLoading}
                    type="file"
                    id="fileInput"
                    className="visually-hidden"
                    onChange={handleCourseFile}
                  />
                </div>
                <div className="image-preview-grid">
                  <Row>
                    {selectedImgs?.map((img, index) => (
                      <Col lg={6}>
                        <div key={index} className="relative">
                          <img
                            src={img}
                            alt={`Preview ${index}`}
                            style={{
                              width: "120px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                            className="rounded-3 object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-0 ms-2 mt-2 right-0 bg-red-500 text-white rounded-full"
                          >
                            <RxCross2 />
                          </button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
              <Form.Item
                name="title"
                className="mt-2 mb-[20px]"
                rules={[
                  {
                    required: true,
                    message: "Please enter the title",
                  },
                ]}
              >
                <Input
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  type="text"
                  placeholder="Enter Title"
                />
              </Form.Item>
              <Form.Item
                name="description"
                className="mt-2 mb-[20px]"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Description",
                  },
                ]}
              >
                <TextArea
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  type="text"
                  placeholder="Enter description"
                />
              </Form.Item>
              <Form.Item name="webUrl" className="mt-2 mb-[20px]">
                <Input
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  type="url"
                  placeholder="Enter webSite URL"
                />
              </Form.Item>
              <Form.Item className="mt-2 mb-[20px]">
                <Autocomplete
                  className="form-control radius_12"
                  apiKey={GoogleApiKey}
                  onPlaceSelected={handlePlaceSelected}
                  onChange={handleAddressChange}
                />
              </Form.Item>

              <Form.Item name="date" className="mt-2 mb-[20px]">
                <DatePicker
                  size="large"
                  className="w-full"
                  format="DD MMM, YYYY"
                />
              </Form.Item>

              <Form.Item name="time" className="mt-2 mb-[20px] custim00">
                <TimePicker
                  use12Hours
                  format="hh:mmA"
                  size="large"
                  className="w-full "
                />
              </Form.Item>
            </Col>
            <div className="d-flex w-100 justify-content-end">
              <button
                type="submit"
                disabled={fileLoading || isProcessing}
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
      </Modal>

      {/* edit modal start */}

      <Modal open={editModal} onCancel={HandleEditClose} footer={null}>
        <section>
          <Form
            className="flex flex-wrap"
            form={form}
            initialValues={{
              title: "",
              description: "",
              webUrl: "",
            }}
            onFinish={HandleEditSubmit}
          >
            <Col span={24} className="mt-">
              <h6 className="manrope_medium text-[#252C32]">Add Images</h6>
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
                    ) : (
                      <div
                        style={{ width: "120px", height: "100px" }}
                        className="border rounded-3 flex justify-center items-center"
                      >
                        <span>Upload Image</span>
                      </div>
                    )}
                  </label>
                  <input
                    disabled={fileLoading}
                    type="file"
                    id="fileInput"
                    className="visually-hidden"
                    onChange={handleCourseFile}
                  />
                </div>
                <div className="image-preview-grid">
                  <Row>
                    {selectedImgs?.map((img, index) => (
                      <Col lg={6}>
                        <div key={index} className="relative">
                          <img
                            src={img}
                            alt={`Preview ${index}`}
                            style={{
                              width: "120px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                            className="rounded-3 object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-0 ms-2 mt-2 right-0 bg-red-500 text-white rounded-full"
                          >
                            <RxCross2 />
                          </button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
              <Form.Item
                name="title"
                className="mt-2 mb-[20px]"
                rules={[
                  {
                    required: true,
                    message: "Please enter the title",
                  },
                ]}
              >
                <Input
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  type="text"
                  placeholder="Enter Title"
                />
              </Form.Item>
              <Form.Item
                name="description"
                className="mt-2 mb-[20px]"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Description",
                  },
                ]}
              >
                <TextArea
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  type="text"
                  placeholder="Enter description"
                />
              </Form.Item>
              <Form.Item name="webUrl" className="mt-2 mb-[20px]">
                <Input
                  size="large"
                  className="manrope_regular text-[#9AA6AC]"
                  type="url"
                  placeholder="Enter WebSite URL"
                />
              </Form.Item>

              <Form.Item className="mt-2 mb-[20px]">
                <Autocomplete
                  className="form-control radius_12"
                  apiKey={GoogleApiKey}
                  onPlaceSelected={handlePlaceSelected}
                  onChange={handleAddressChange}
                  value={address}
                />
              </Form.Item>

              <Form.Item name="date" className="mt-2 mb-[20px]">
                <DatePicker
                  size="large"
                  className="w-full"
                  format="DD MMM, YYYY"
                />
              </Form.Item>

              <Form.Item name="time" className="mt-2 mb-[20px] custim00">
                <TimePicker
                  use12Hours
                  format="hh:mmA"
                  size="large"
                  className="w-full "
                />
              </Form.Item>
            </Col>
            <div className="d-flex w-100 justify-content-end">
              <button
                type="submit"
                disabled={fileLoading || isProcessing}
                className="px-4 py-2 text_white rounded-3 bg_dark manrope_medium"
              >
                {isProcessing ? (
                  <>
                    <CircularProgress size={12} />
                  </>
                ) : (
                  <>Update</>
                )}
              </button>
            </div>
          </Form>
        </section>
      </Modal>

      {/* image prev section */}

      <Modal
        open={showImagePreview}
        onCancel={() => setShowImagePreview(false)}
        footer={null}
      >
        <Carousel>
          {selectedImage?.length > 0
            ? selectedImage?.map((img, index) => (
              <Carousel.Item key={index}>
                <img
                  src={img}
                  alt={`Preview ${index}`}
                  className="object-cover w-full"
                  style={{ height: "300px" }}
                />
              </Carousel.Item>
            ))
            : ""}
        </Carousel>
      </Modal>
    </>
  );
};

export default LifeStyle;
