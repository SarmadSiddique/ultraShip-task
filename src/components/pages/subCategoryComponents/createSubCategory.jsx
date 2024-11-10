/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { Form, Input, Select, message } from "antd";
import axios from "axios";
import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";
import { Input as InputStrap } from "reactstrap";
import { storage } from "../../../config/firebase";
import { fileavatar } from "../../icons/icon";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axiosInstance, { headers } from "../ApiFunction/axiosInstance";
const category1 = [
  { name: "Cleaning Services", value: "cleaning" },
  { name: "Laundry Services", value: "laundry" },
  { name: "Shoe Cleaning Services", value: "shoeclean" },
  // { name: 'Accomodation', value: 'accomodation' },
];

const CreateSubCategory = () => {
  const [category, setCategory] = useState("");
  const [servicePet, setServicePet] = useState([]);
  const [fileLoading, setFileLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [courseImage, setCourseImage] = useState(null);
  const [title, setTitle] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [addedServices, setAddedServices] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const uploadFoodFile = (courseFile) => {
    setFileLoading(true);
    if (!courseFile) return;
    const currentDate = new Date();
    const uniqueFileName = `${currentDate.getTime()}_${courseFile?.name}`;
    const imageRef = ref(storage, `sub_category_image/${uniqueFileName}`);
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

  const handleAddService = () => {
    const serviceName = form.getFieldValue("subCategory");
    if (serviceName) {
      setAddedServices([...addedServices, serviceName]);
      setServicePet([...addedServices, serviceName]);
      form.setFieldsValue({ subCategory: "" });
    }
  };

  const toggleCategory = (nameID) => {
    if (servicePet.includes(nameID)) {
      setServicePet(servicePet.filter((id) => id !== nameID));
    } else {
      setServicePet([...servicePet, nameID]);
    }
  };
  const allServices = [...addedServices];

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const res = await axiosInstance.post(
        `api/sub-cat/create`,
        {
          category: category,
          name: title,
          //   image: courseImage,
        },
        { headers }
      );
      if (res) {
        message.success("Sub-category Created Successfully");
        navigate(-1);
      }
    } catch (error) {
      setIsProcessing(false);
      message.error("Your sub-category did not create");
      // console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="container m-auto min-h-screen py-4">
      <div className="flex items-center gap-3 px-3 mb-4">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="flex items-center justify-center p-2 bg_primary rounded-3"
        >
          <ArrowLeft className="text_white" />
        </button>
        <h3 className="manrope_semibold text_dark">Create Sub Category</h3>
      </div>
      <Form
        layout="verticle"
        form={form}
        onFinish={handleSubmit}
        className="w-full lg:w-[90%] xl:w-[80%] mx-auto bg_white rounded-3 shadow-md p-4 flex flex-col gap-3"
      >
        {/* <div className="flex flex-col mb-3 gap-2">
          <h6 className="manrope_semibold text_dark w-full">Upload File</h6>
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
              required
              id="fileInput"
              className="visually-hidden"
              onChange={handleCourseFile}
            />
          </div>
        </div> */}
        <div className="flex flex-col gap-1">
          <h6 className="manrope_semibold text_dark w-full">Select Category</h6>
          <div className="w-full flex flex-wrap gap-2 items-center">
            <Form.Item
              className="w-full mb-0"
              name="category"
              rules={[
                {
                  required: true,
                  message: "Please Select Category",
                },
              ]}
            >
              <Select
                showSearch
                style={{
                  width: "100%",
                }}
                size="large"
                className="manrope_medium text_dark"
                placeholder="Select Category"
                allowClear
                onChange={(value) => setCategory(value)}
              >
                {category1?.map((item) => (
                  <Select.Option key={item?.value} value={item?.value}>
                    {item?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className="flex flex-col w-full gap-1">
          <h6 className="manrope_semibold text_dark w-full">Sub Category</h6>
          <div className="w-full flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <Form.Item className="w-full mb-0" name="subCategory">
                {/* <Input type='text' className='manrope_medium text_dark' placeholder='Enter service' size='large' allowClear /> */}
                <Input
                  type="text"
                  required
                  size="large"
                  value={title}
                  className="manrope_medium text_dark"
                  placeholder="Enter Sub Category"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Item>
              {/* <button type='button' onClick={handleAddService} className='bg_primary rounded-3 text_white manrope_semibold px-3 py-2'>Add</button> */}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {allServices.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  className={`border rounded-3 gap-1 px-4 py-2 manrope_semibold text-sm flex justify-center items-center ${servicePet.includes(item)
                      ? "bg_primary text_white"
                      : "bg_white text_secondary"
                    }`}
                  onClick={() => toggleCategory(item)}
                >
                  {item?.title || item}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end w-full">
          {!isProcessing ? (
            <button
              disabled={fileLoading}
              type="submit"
              className="flex justify-center bg_primary py-2 px-3 rounded-3 items-center button_shadow"
            >
              <span className="manrope_semibold text-sm text_white">
                Submit
              </span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="flex justify-center bg_primary py-2 px-4 rounded-3 items-center button_shadow cursor-not-allowed"
            >
              <CircularProgress size={18} className="text_white" />
            </button>
          )}
        </div>
      </Form>
    </main>
  );
};

export default CreateSubCategory;
