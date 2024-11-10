/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Form, Input, Select, TreeSelect, message } from "antd";
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";
import { cameradark } from "../../icons/icon";
import { apiRequest } from "../../../api/auth_api";
import { CircularProgress } from "@mui/material";

const UpdateSubservice = () => {
  const { state } = useLocation();
  const subServiceNameData = state?.subServiceNameData || null;
  const [servicePet, setServicePet] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [serviceNames, setServiceNames] = useState([]);
  const [addedServices, setAddedServices] = useState([]);
  const [value, setValue] = useState();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleAddService = () => {
    const serviceName = form.getFieldValue("serviceNameExtra");
    if (serviceName) {
      setAddedServices([...addedServices, serviceName]);
      setServicePet([...addedServices, serviceName]);
      form.setFieldsValue({ serviceNameExtra: "" });
    }
  };

  const handleFetchData = async () => {
    let allServiceName = [];
    let currentPage = 1;
    try {
      while (true) {
        const body = new FormData();
        body.append("type", "get_list");
        body.append("table_name", "services_list");
        body.append("page", currentPage);
        const res = await apiRequest({ body });
        if (res && res?.data && res?.data?.length > 0) {
          allServiceName = allServiceName.concat(res?.data);
          currentPage++;
        } else {
          break;
        }
      }
      setServiceNames(allServiceName);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    handleFetchData();

    if (subServiceNameData) {
      const parsedName = JSON.parse(subServiceNameData.name);
      setAddedServices(parsedName);
      setValue(subServiceNameData.service?.name);
      form.setFieldsValue({
        servicesNames: subServiceNameData.service?.name,
        serviceNameExtra: "",
      });
      setServicePet(parsedName);
    }
  }, [subServiceNameData]);

  const toggleCategory = (nameID) => {
    if (servicePet.includes(nameID)) {
      setServicePet(servicePet.filter((id) => id !== nameID));
    } else {
      setServicePet([...servicePet, nameID]);
    }
  };

  const allServices = [...addedServices];
  const selectedService = serviceNames.find((item) => item.name === value);
  const serviceId = selectedService?.id || null;

  const handleSubmit = async () => {
    setIsProcessing(true);

    const body = new FormData();
    body.append("type", "update_data");
    body.append("table_name", "sub_services_list");
    body.append("id", subServiceNameData?.id);
    body.append("service_id", serviceId);
    body.append("name", JSON.stringify(servicePet));

    try {
      const res = await apiRequest({ body });

      if (res) {
        message.success("Subservice Updated Successfully");
        form.resetFields();
        navigate(-1);
      } else {
        message.error("Operation failed...");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <main className="container m-auto min-h-screen py-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="flex items-center justify-center w-[36px] h-[36px] bg_primary rounded-lg"
        >
          <ArrowLeft className="text_white" />
        </button>
        <span className="inter_semibold text-xl md:text-2xl text_dark">
          Update Subservice
        </span>
      </div>
      <Form
        layout="verticle"
        form={form}
        onFinish={handleSubmit}
        className="w-full lg:w-[90%] xl:w-[80%] mx-auto bg_white rounded-lg shadow-md p-[1rem] md:p-[2rem]"
      >
        <div className="flex gap-3 mb-4 w-full max-md:flex-col justify-start">
          <span className="inter_medium text-sm text_dark w-full md:w-[30%]">
            Services
          </span>
          <div className="w-full md:w-[70%] flex flex-wrap gap-2 items-center">
            <Form.Item
              className="w-full mb-0"
              name="servicesNames"
              rules={[
                {
                  required: true,
                  message: "Please Select service name",
                },
              ]}
            >
              <Select
                showSearch
                style={{
                  width: "100%",
                }}
                size="large"
                placeholder="Select Service"
                allowClear
                onChange={(value) => setValue(value)}
              >
                {serviceNames?.map((item) => (
                  <Select.Option key={item?.id} value={item?.name}>
                    {item?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className="flex gap-3 mb-4 w-full max-md:flex-col justify-start">
          <span className="inter_medium text-sm text_dark w-full md:w-[30%]">
            Subservices
          </span>
          <div className="w-full md:w-[70%] flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <Form.Item className="w-full mb-0" name="serviceNameExtra">
                <Input
                  type="text"
                  placeholder="Subservice Name"
                  size="large"
                  allowClear
                />
              </Form.Item>
              <button
                type="button"
                onClick={handleAddService}
                className="bg_primary rounded-lg text_white inter_semibold px-[1rem] py-2"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {allServices.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  className={`border cursor-pointer rounded-lg gap-1 px-[1rem] py-2 inter_medium text-sm flex justify-center items-center ${servicePet.includes(item)
                      ? "bg-[#F8F2FD] text_primary"
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
        <div className="flex justify-end w-full">
          {!isProcessing ? (
            <button
              type="submit"
              className="flex justify-center bg_primary py-[12px] px-[1rem] rounded-lg items-center button_shadow"
            >
              <span className="inter_semibold text-sm text_white">
                Update Subservice
              </span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="flex justify-center bg_primary py-[12px] px-[4rem] rounded-lg items-center button_shadow cursor-not-allowed"
            >
              <CircularProgress size={18} className="text_white" />
            </button>
          )}
        </div>
      </Form>
    </main>
  );
};

export default UpdateSubservice;
