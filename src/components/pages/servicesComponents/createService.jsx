/* eslint-disable no-mixed-operators */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import { message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { ArrowLeft, DownloadCloud } from "react-feather";
import { useNavigate } from "react-router-dom";
import { Input } from "reactstrap";
import { fileavatar } from "../../icons/icon";

import Autocomplete from "react-google-autocomplete";
import { categoryWithoutPage } from "../../api/category";
import { fileUpload } from "../../api/fileUpload";
import { createService } from "../../api/services";

const CreateService = () => {
  const autocompleteRef = useRef()
  const [fileLoading, setFileLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState(1);
  const [lastId2, setLastId2] = useState(0);
  const [categories, setCategories] = useState([]);
  const [count, setcount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [serviceName, setServiceName] = useState("");
  const [duration, setduration] = useState("");
  const [price, setPrice] = useState(null);
  const [category, setCategory] = useState();
  const [description, setDescription] = useState("");
  const [uploadedImgUrls, setUploadedImgUrls] = useState([]);
  const [selectedImg, setSelectedImg] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [serviceType, setserviceType] = useState(null);
  const [locationDetails, setLocationDetails] = useState({
    address: null,
    lat: null,
    lng: null,
  });
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const selectedImages = Array.from(e.target.files);
    const uploadedUrls = [];
    setFileLoading(true);
    for (let i = 0; i < selectedImages.length; i++) {
      const imageFile = selectedImages[i];
      // const imageRef = ref(storage, `services_images/${imageFile.name}`);

      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        const res = await fileUpload(formData);
        uploadedUrls.push(res.data.image);
        // await uploadBytes(imageRef, imageFile);
        // const imageUrl = await getDownloadURL(imageRef);
        // uploadedUrls.push(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
    setFileLoading(false);
    setSelectedImg([...selectedImg, ...selectedImages]);
    setUploadedImgUrls([...uploadedImgUrls, ...uploadedUrls]);
  };

  const removeImage = (index) => {
    const newImages = [...selectedImg];
    newImages.splice(index, 1);
    setSelectedImg(newImages);

    const newUrls = [...uploadedImgUrls];
    newUrls.splice(index, 1);
    setUploadedImgUrls(newUrls);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await categoryWithoutPage(serviceType)
      if (res?.data) {
        setCategories(res?.data?.categories);
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
  }, [serviceType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadedImgUrls.length === 0) {
      return message.error('Please upload atleast one image')
    }
    if (!locationDetails?.lng && !locationDetails?.lat) {
      return message.error('Please select address from the Suggestion list of address')
    }

    const data = {
      cat: category,
      type: serviceType,
      images: uploadedImgUrls,
      title: serviceName,
      price: price,
      duration: duration,
      description: description,
      address: locationDetails?.address,
      location: {
        type: "Point",
        coordinates: [
          locationDetails?.lng,
          locationDetails?.lat
        ]
      }
    }
    setIsProcessing(true);
    try {
      const res = await createService({ data: data })
      if (res.data) {
        message.success("Service Created Successfully");
        navigate("/services");
      }
    } catch (error) {
      setIsProcessing(false);
      message.error("Your Service did not create");
      // console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="container m-auto min-h-screen px-lg-5 py-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => {
            navigate("/services");
          }}
          className="flex items-center justify-center p-2 bg_primary rounded-3"
        >
          <ArrowLeft className="text_white" />
        </button>
        <h3 className="manrope_semibold text_dark">Create New Service</h3>
      </div>
      <Form
        onSubmit={handleSubmit}
        className="w-full bg_white rounded-3 shadow-md p-4"
      >
        <div className="flex gap-3 mb-4 w-full flex-col px-3">
          <div className="flex gap-3 flex-wrap flex-md-nowrap justify-between w-full">
            <Form.Group className="shadow_def w-full">
              <Form.Label className="manrope_semibold text_dark">
                Choose Service type
              </Form.Label>
              <Form.Select
                showSearch
                style={{
                  width: "100%",
                  padding: "10px 20px",
                }}
                size="large"
                required
                className="custom_control rounded-3 manrope_regular text_secondarydark bg_white shadow-sm border"
                placeholder="Select serviceType"
                // value={serviceType}
                allowClear
                onChange={(e) => setserviceType(e.target.value)}
              >
                <option value=''>Select Service Type</option>
                <option value='shoe'>Shoe</option>
                <option value='floor'>Floor</option>
                <option value='laundry'>Laundry</option>
                <option value='bathroom'>Bathroom</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="shadow_def w-full">
              <Form.Label className="manrope_semibold text_dark">
                Choose Category
              </Form.Label>
              <Form.Select
                showSearch
                style={{
                  width: "100%",
                  padding: "10px 20px",
                }}
                size="large"
                required
                className="custom_control rounded-3 manrope_regular text_secondarydark bg_white shadow-sm border"
                placeholder="Select Category"
                // value={category}
                allowClear
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories?.map((item, i) => (
                  <option key={i} value={item?._id}>
                    {item?.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
          {/* <div className="flex gap-3 flex-wrap flex-md-nowrap justify-between w-full">
            <div className="flex flex-col px-3 mb-3 gap-2">
              <Form.Label className="manrope_semibold text_dark">Enter Cover Photo</Form.Label>
              <div>
                <label style={{ cursor: 'pointer' }} htmlFor="fileInput2" className="cursor-pointer">
                  {fileLoading ? <div style={{ width: '120px', height: '100px', }} className='border rounded-3 d-flex justify-content-center align-items-center'>
                    <CircularProgress size={20} />
                  </div> :
                    selectedImg2 ? (
                      <img src={selectedImg2} alt="Preview" style={{ width: '120px', height: '100px', objectFit: 'cover' }} className="rounded-3 object-cover" />
                    ) : (
                      <div style={{ width: '120px', height: '100px' }} className="border rounded-3 flex justify-center items-center">
                        <img src={fileavatar} alt="Camera Icon" />
                      </div>
                    )}

                </label>
                <Input
                  size='large'
                  type="file"
                  // required
                  id="fileInput2"
                  className="visually-hidden"
                // onChange={handleCourseFile}
                />
              </div>
            </div>
          </div> */}

          <div className="flex gap-3 flex-wrap flex-md-nowrap justify-between w-full">
            <Form.Group className="shadow_def w-full">
              <Form.Label className="manrope_semibold text_dark">
                Service Name
              </Form.Label>
              <Form.Control
                type="text"
                required
                // value={question}
                onChange={(e) => setServiceName(e.target.value)}
                style={{ padding: "10px 20px" }}
                className="custom_control rounded-3 manrope_regular text_secondarydark bg_white shadow-sm border"
                placeholder="Enter Service Name"
              />
            </Form.Group>
            <Form.Group className="shadow_def w-full">
              <Form.Label className="manrope_semibold text_dark">
                Service Price
              </Form.Label>
              <Form.Control
                type="number"
                required
                // value={question}
                onChange={(e) => setPrice(e.target.value)}
                style={{ padding: "10px 20px" }}
                className="custom_control rounded-3 manrope_regular text_secondarydark bg_white shadow-sm border"
                placeholder="Enter Service Price"
              />
            </Form.Group>
          </div>
          <div className="flex gap-3 flex-wrap flex-md-nowrap justify-between w-full">
            <Form.Group className="shadow_def w-full">
              <Form.Label className="manrope_semibold text_dark">
                Duration
              </Form.Label>
              <Form.Control
                type="number"
                required
                // value={question}
                onChange={(e) => setduration(e.target.value)}
                style={{ padding: "10px 20px" }}
                className="custom_control rounded-3 manrope_regular text_secondarydark bg_white shadow-sm border"
                placeholder="In hours"
              />
            </Form.Group>
            <Form.Group className="shadow_def flex flex-col w-full mb-3">
              <Form.Label className="manrope_semibold text_dark">
                Address
              </Form.Label>
              <Autocomplete
                style={{ padding: "10px 20px" }}
                className="custom_control rounded-3 manrope_regular address_google text_secondarydark bg_white shadow-sm border"
                apiKey='AIzaSyD4qhOSy-gRNAwJ1l3952qY2K4sMTIGOHQ'
                ref={autocompleteRef}
                options={{
                  types: ['address'],
                }}
                onPlaceSelected={(place) => {
                  const address = place.formatted_address;
                  const lat = place.geometry.location.lat();
                  const lng = place.geometry.location.lng();
                  setLocationDetails({
                    address,
                    lat,
                    lng
                  });
                }}
              />
            </Form.Group>
          </div>
          <Form.Group className="shadow_def w-full mb-3">
            <Form.Label className="manrope_semibold text_dark">
              Description
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              required
              // value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ padding: "10px 20px" }}
              className="custom_control rounded-3 manrope_regular text_secondarydark bg_white shadow-sm border"
              placeholder="Enter description"
            />
          </Form.Group>
          <div className="flex flex-col gap-1">
            <Form.Label className="manrope_semibold text_dark">
              Upload Cover Photos
            </Form.Label>
            <div className="shadow_def position-relative">
              <div
                className={`identity_image position-relative mx-auto1`}
                style={{ overflow: "auto" }}
              >
                {fileLoading ? (
                  <div className="flex justify-center items-center w-100 h-100">
                    <CircularProgress color="inherit" size={20} />
                  </div>
                ) : selectedImg?.length > 0 ? (
                  <>
                    {
                      <div className="bus_grid h-100">
                        {selectedImg.map((image, index) => (
                          <div key={index} className="position-relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`imageNew_${index + 1}`}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                            />
                            <div className="remove_button">
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className=" btn work_sans_medium btn-light p-0"
                              >
                                X
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    }
                  </>
                ) : (
                  <div className="flex justify-center items-center w-100 h-100 m-auto gap-3">
                    <div className="d-flex flex-column justify-center items-center">
                      <div className="flex gap-2 items-center">
                        <DownloadCloud />
                        <span className="text_black work_sans_medium">
                          Upload Pictures
                        </span>
                      </div>
                      <button className="border w-fit mt-2 bg_white text_secondary work_sans_medium rounded-3 py-1 px-2">
                        Upload
                      </button>
                    </div>
                  </div>
                )}
                <Input
                  // required
                  type="file"
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    inset: "0",
                    opacity: "0",
                  }}
                  className="upload cursor-pointer"
                  accept="image/*" // Restrict to image files
                  onChange={handleFileChange}
                  placeholder="Enter Code"
                  multiple
                />
              </div>
              {selectedImg?.length > 0 && (
                <div
                  className="position-absolute "
                  style={{ top: "0px", right: "0px", zIndex: 9999 }}
                >
                  <div className="display_flex2">
                    <div
                      style={{ cursor: "pointer" }}
                      className="d-flex flex-column gap-1 cursor-pointer align-items-center h-100"
                    >
                      <img
                        src={fileavatar}
                        style={{
                          height: "34px",
                          width: "auto",
                          objectFit: "contain",
                        }}
                        alt=""
                      />
                    </div>
                  </div>
                  <Input
                    type="file"
                    style={{ position: "absolute", inset: "0", opacity: "0" }}
                    className="upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    placeholder="Enter Code"
                    multiple
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end px-3 w-full">
          {!isProcessing ? (
            <button
              disabled={fileLoading}
              type="submit"
              className="flex justify-center bg_primary py-2 px-3 rounded-3 items-center button_shadow"
            >
              <span className="manrope_semibold text-sm text_white">
                Create Service
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

export default CreateService;
