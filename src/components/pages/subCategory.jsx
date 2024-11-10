/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "react-feather";
import { Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import ProductTable from "../DataTable/productTable";
import { StyleSheetManager } from "styled-components";
import { edit2, fileavatar, profileavatar, trash } from "../icons/icon";
import axios from "axios";
import { Form } from "react-bootstrap";
import { CircularProgress } from "@mui/material";
import { Input } from "reactstrap";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
import axiosInstance, { headers } from "./ApiFunction/axiosInstance";

const category1 = [
  { name: "Cleaning Services", value: "cleaning" },
  { name: "Laundry Services", value: "laundry" },
  { name: "Shoe Cleaning Services", value: "shoeclean" },
  // { name: 'Accomodation', value: 'accomodation' },
];

const SubCategory = () => {
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState(1);
  const [lastId2, setLastId2] = useState(0);
  const [count, setcount] = useState(0);
  const [category, setCategory] = useState("cleaning");
  const [categories, setCategories] = useState([]);
  const [fileLoading, setFileLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [title, setTitle] = useState("");
  const [courseImage, setCourseImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isProcessing2, setIsProcessing2] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [updateCat, setUpdateCat] = useState("");
  const navigate = useNavigate();

  const handleClick = (item) => {
    setSelectedItem(item);
    setShowDelete(true);
  };
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImagePreview(true);
  };

  const handleShow = (item) => {
    setSelectedItem(item);
    setShowModal2(true);
  };

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

  const toCapitalized = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
  const subServiceColumn = [
    {
      name: "Category",
      sortable: true,
      selector: (row) =>
        row?.category === "shoeclean"
          ? "Shoe Cleaning"
          : toCapitalized(row?.category),
    },
    {
      name: "Sub Category",
      sortable: true,
      selector: (row) => row?.name,
    },
    // {
    //   name: "Image",
    //   sortable: true,
    //   cell: (row) => (
    //     <div className="flex w-full gap-2 items-center">
    //       <img
    //         onClick={() => handleImageClick(row?.image)}
    //         src={row?.image || profileavatar}
    //         style={{
    //           height: "30px",
    //           width: "30px",
    //           borderRadius: "10px",
    //           cursor: "pointer",
    //           objectFit: "cover",
    //         }}
    //         alt=""
    //       />
    //     </div>
    //   ),
    // },
    {
      name: "Action",
      allowoverflow: true,
      cell: (row) => {
        return (
          <div className="flex gap-1">
            <button
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "#54A6FF",
              }}
              onClick={() => handleShow(row)}
              className="flex justify-center manrope_medium text-xs text_white rounded-3 items-center"
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
              className="flex justify-center manrope_medium text-xs text_white rounded-3 items-center"
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `api/sub-cat/admin/${lastId}/${category}`,
        { headers }
      );
      if (res?.data) {
        setCategories(res?.data?.subcats);
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
  }, [lastId, category]);

  useEffect(() => {
    if (selectedItem) {
      setTitle(selectedItem?.name);
      setUpdateCat(selectedItem?.category);
      // setSelectedImg(selectedImage?.image);
    }
  }, [selectedItem]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = {
      name: title,
      category: updateCat,
      //   image: courseImage ? courseImage : selectedImg,
    };
    setIsProcessing(true);
    try {
      const res = await axiosInstance.put(
        `api/sub-cat/edit/${selectedItem?._id}`,
        formData,
        { headers }
      );
      message.success("Sub-category Updated Successfully");
      setShowModal2(false);
      fetchData();
    } catch (error) {
      // console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    setIsProcessing2(true);
    try {
      const res = await axiosInstance.delete(
        `api/sub-cat/${selectedItem?._id}`,
        { headers }
      );
      if (res?.data) {
        fetchData();
        setShowDelete(false);
        message.success("Faq deleted Successfully");
      }
    } catch (error) {
      setIsProcessing2(false);
      // console.log(error);
    } finally {
      setIsProcessing2(false);
    }
  };

  const handleCategoryChange = (value) => {
    setUpdateCat(value);
  };


  return (
    <StyleSheetManager
      shouldForwardProp={(prop) => !["sortActive"].includes(prop)}
    >
      <main className="container m-auto min-h-screen flex-grow flex flex-col p-3">
        <div className="flex w-full justify-between items-center flex-wrap mb-3">
          <h4 className="text_dark manrope_semibold">Sub Category List</h4>
        </div>
        <div className="mb-3 rounded-lg bg_white shadow-md w-full">
          <div className="flex items-center justify-between flex-wrap p-3 gap-2">
            <span className="manrope_medium text_dark text-xl md:text-2xl">
              Sub Categories
            </span>
            <button
              onClick={() => {
                navigate("/sub-category/create-sub-category");
              }}
              className="flex justify-center bg_primary p-2 rounded-3 items-center gap-2"
            >
              <Plus size={18} className="text_white" />
              <span className="manrope_medium text_white">Add Subcategory</span>
            </button>
          </div>
          <div className="flex p-3">
            <Form.Select
              style={{
                maxWidth: "300px",
              }}
              showSearch
              className="custom_control rounded-3 manrope_regular text_secondarydark bg_white shadow-sm border"
              placeholder="Select Category"
              allowClear
              onChange={(e) => setCategory(e.target.value)}
            >
              {category1?.map((item) => (
                <option key={item?.value} value={item?.value}>
                  {item?.name}
                </option>
              ))}
            </Form.Select>
          </div>
          <ProductTable
            count={count}
            loading={loading}
            setCurrentPage={setLastId2}
            currentPage={lastId2}
            columns={subServiceColumn}
            data={categories}
            setLastId={setLastId}
          />
        </div>
      </main>

      <Modal
        open={showImagePreview}
        onCancel={() => setShowImagePreview(false)}
        footer={null}
        closeIcon
      >
        <img
          src={selectedImage}
          alt={selectedImage}
          className="object-cover w-full"
          style={{ maxHeight: "30rem" }}
        />
      </Modal>

      {selectedItem && (
        <Modal
          open={showModal2}
          onCancel={() => setShowModal2(false)}
          footer={null}
          closeIcon
        >
          <Form onSubmit={handleUpdate} className=" flex flex-col gap-3">
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
                  ) : selectedImg || selectedItem?.image ? (
                    <img
                      src={selectedImg || selectedItem?.image}
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
                <Input
                  type="file"
                  id="fileInput"
                  className="visually-hidden"
                  onChange={handleCourseFile}
                />
              </div>
            </div> */}
            <div className="flex flex-col gap-1">
              <h6 className="manrope_semibold text_dark w-full">
                Select Category
              </h6>
              <div className="w-full flex flex-wrap gap-2 items-center">
                <Form.Select
                  showSearch
                  style={{ width: "100%" }}
                  size="large"
                  className="custom_control rounded-3 manrope_regular text_secondarydark bg_white shadow-sm border"
                  placeholder="Select Category"
                  allowClear
                  value={updateCat}
                  onChange={(e) => setUpdateCat(e.target.value)}
                >
                  {category1?.map((item) => (
                    <option key={item?.value} value={item?.value}>
                      {item?.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>
            <div className="flex flex-col w-full gap-1">
              <h6 className="manrope_semibold text_dark w-full">
                Sub Category
              </h6>
              <div className="w-full flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Form.Control
                    type="text"
                    required
                    size="large"
                    value={title}
                    className="custom_control rounded-3 manrope_regular text_secondarydark bg_white shadow-sm border"
                    placeholder="Enter Sub Category"
                    onChange={(e) => setTitle(e.target.value)}
                  />
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
                    Update
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
        </Modal>
      )}

      {selectedItem && (
        <Modal
          open={showDelete}
          onCancel={() => setShowDelete(false)}
          footer={null}
          closeIcon
        >
          <h5 className="text_dark text-center manrope_bold">
            Are you want to delete this Sub-category?
          </h5>
          <div className="flex justify-center gap-2 w-100 my-4">
            <button
              type="button"
              disabled={isProcessing2}
              className={`bg_dark text_white cursor-pointer w-100 rounded-3 gap-1 px-3 py-2 manrope_medium text-sm flex justify-center items-center`}
              onClick={handleDelete}
            >
              {isProcessing2 ? (
                <CircularProgress color="inherit" size={18} />
              ) : (
                "Yes"
              )}
            </button>
            <button
              type="button"
              className={`border bg_white text_dark bg_white cursor-pointer w-100 rounded-3 gap-1 px-3 py-2 manrope_medium text-sm flex justify-center items-center`}
              onClick={() => setShowDelete(false)}
            >
              No
            </button>
          </div>
        </Modal>
      )}
    </StyleSheetManager>
  );
};

export default SubCategory;
