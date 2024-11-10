/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import { Modal, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Trash2 } from "react-feather";
import { edit2, fileavatar, profileavatar, trash } from "../icons/icon";
import { useNavigate } from "react-router-dom";
import ProductTable from "../DataTable/productTable";
import axiosInstance, { headers } from "./ApiFunction/axiosInstance";
import { updateServiceStatus } from "../api/services";

const Services = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [lastId, setLastId] = useState(1);
  const [lastId2, setLastId2] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [count, setcount] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isProcessing2, setIsProcessing2] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`api/service/admin/${lastId}`, {
        headers,
      });
      if (res?.data) {
        setCategories(res?.data?.services);
        setTotalCount(res?.data?.count?.totalPage || 0);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setcount(1);
  }, [lastId]);

  const handleShowMore = async () => {
    setLoading2(true);
    setcount(count + 1);

    try {
      const res = await axiosInstance.get(`api/service/admin/${lastId + 1}`, {
        headers,
      });
      if (res?.data) {
        setCategories((prevCategories) => [
          ...categories,
          ...res?.data?.services,
        ]);
        setTotalCount(res?.data?.count?.totalPage || 0);
      }
      setLoading2(false);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading2(false);
    }
  };

  const handleChangeStatus = async () => {
    setIsProcessing2(true);
    let newStatus;
    if (selectedItem?.status === "active") {
      newStatus = "deactivated";
    } else if (selectedItem?.status === "deactivated") {
      newStatus = "active";
    }
    try {
      const res = await updateServiceStatus(newStatus, selectedItem?._id)
      if (res?.data) {
        fetchData();
        setShowDelete(false);
        message.success(`Service ${selectedItem?.status === 'active' ? 'de-activate' : 'activate'} Successfully`);
      }
    } catch (error) {
      setIsProcessing2(false);
      // console.log(error);
    } finally {
      setIsProcessing2(false);
    }
  };

  const handleClick = (item) => {
    setSelectedItem(item);
    setShowDelete(true);
  };

  const toCapitalized = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  //   columns

  const handleUpdate = (serviceDetail) => {
    navigate(`/services/${serviceDetail?._id}`, {
      state: { serviceDetail: serviceDetail },
    });
  };

  const columns = [
    {
      name: "Title",
      sortable: true,
      minWidth: "110px",
      maxWidth: "200px",
      selector: (row) => row?.title,
    },

    {
      name: "Type",
      sortable: true,
      minWidth: "110px",
      maxWidth: "500px",
      selector: (row) => row?.type,
    },

    {
      name: "Detail",
      sortable: true,
      minWidth: "110px",
      maxWidth: "500px",
      selector: (row) => row?.description,
    },
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
              onClick={() => handleUpdate(row)}
              className="flex justify-center inter_medium text-xs text_white rounded-3 items-center"
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
              className="flex justify-center inter_medium text-xs text_white rounded-3 items-center"
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

  return (
    <main className="min-h-screen lg:container py-4 px-4 mx-auto">
      <div className="flex justify-between gap-3 items-center w-full">
        <div className="flex flex-col mb-3 w-full">
          <h3 className="inter_medium text_black">All Services</h3>
        </div>
        <button
          onClick={() => navigate("/services/create-service")}
          style={{ width: "150px" }}
          className="bg_primary py-3 rounded-3 text_white plusKajara_semibold mb-5"
        >
          Add Service
        </button>
      </div>
      {loading ? (
        <main className="my-5 d-flex w-100 justify-content-center align-items-center">
          <CircularProgress size={24} className="text_dark" />
        </main>
      ) : !categories || categories?.length === 0 ? (
        <main className="my-5 d-flex w-100 justify-content-center align-items-center">
          <span className="text_secondary inter_medium">
            No Service Found
          </span>
        </main>
      ) : (
        <>
          {/* <ProductTable
            count={count}
            loading={loading}
            setCurrentPage={setLastId2}
            currentPage={lastId2}
            columns={columns}
            data={categories}
            setLastId={setLastId}
          /> */}
          <div className="flex my-4 w-full displaygrid_3">
            {categories?.map((item, i) => (
              <div
                key={i}
                className="shadow-sm h-full overflow-hidden rounded-4 bg_light flex flex-col position-relative"
              >
                {/* <div
                  className="position-absolute d-flex w-full justify-content-end"
                  style={{ right: "0px", top: "0px" }}
                >
                  <button
                    onClick={() => handleClick(item)}
                    className="p-2 text_white flex justify-center"
                    style={{ backgroundColor: "#ce2c60" }}
                  >
                    <Trash2 />
                  </button>
                </div> */}
                <img
                  onClick={() =>
                    navigate("/services/service-detail", {
                      state: { serviceDetail: item },
                    })
                  }
                  src={item?.images[0]}
                  style={{
                    width: "100%",
                    cursor: 'pointer',
                    maxHeight: "12rem",
                    objectFit: "cover",
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                  }}
                  alt=""
                />
                <div
                  onClick={() =>
                    navigate("/services/service-detail", {
                      state: { serviceDetail: item },
                    })
                  }
                  style={{ cursor: 'pointer', }}
                  className="flex flex-col bg_light gap-1 px-3 pt-3"
                >
                  <div className="flex justift-between w-full items-start">
                    <div className="flex flex-col w-full">
                      <h6 className="text_dark mb-0 whitespace-nowrap inter_semibold">
                        {item?.title}
                      </h6>
                      <span className="text_secondary text-sm mb-0 inter_semibold">
                        {/* {toCapitalized(item?.cat?.name)} */}
                      </span>
                    </div>
                    <h6 className="text_dark w-full text-end mb-0 inter_bold">
                      £
                      {Number(item?.price || 0) + Number(item?.servicefee || 0)}
                      {item?.category === "accomodation" && " per night"}
                    </h6>
                  </div>
                  <span
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                    }}
                    className="text_dark text-sm line-clamp-2 inter_regular"
                  >
                    {item?.description}
                  </span>
                  <div className="d-flex w-100 justify-content-between"></div>
                </div>
                <div className="flex h-full items-end p-3 justify-between w-full">
                  <button
                    onClick={() => handleClick(item)}
                    style={{
                      backgroundColor:
                        item?.status === "active" ? "#06D6A0" : "#d15a5a",
                    }}
                    className="text_white rounded-3 inter_medium px-3 py-1">
                    {toCapitalized(item?.status)}
                  </button>
                  <button
                    onClick={() =>
                      navigate("/services/service-detail", {
                        state: { serviceDetail: item },
                      })
                    }
                    style={{
                      cursor: 'pointer',
                    }}
                    className="bg_dark text_white rounded-3 inter_medium px-3 py-1">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
          {count < totalCount &&
            (loading2 ? (
              <main className="my-5 d-flex w-100 justify-content-center align-items-center">
                <CircularProgress size={24} className="text_dark" />
              </main>
            ) : (
              <div className="flex justify-center w-full">
                <button
                  onClick={handleShowMore}
                  className="bg_primary py-3 px-4 rounded-3 text_white plusKajara_semibold"
                >
                  Show More
                </button>
              </div>
            ))}
        </>
      )}
      <Modal
        open={showDelete}
        onCancel={() => setShowDelete(false)}
        footer={null}
        closeIcon
        centered
      // width={400}
      >
        <div className="flex w-full pe-4">
          <h5 className="text_dark text-center inter_bold">
            Are you want to {selectedItem?.status === 'active' ? 'De-activate' : 'Activate'} this Service?
          </h5>
        </div>
        <div className="flex justify-center gap-3 w-100 my-4">
          <button
            type="button"
            disabled={isProcessing2}
            style={{ padding: '12px 24px' }}
            className={`bg_dark text_white w-100 rounded-3 inter_medium flex justify-center items-center`}
            onClick={handleChangeStatus}
          >
            {isProcessing2 ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Yes"
            )}
          </button>
          <button
            type="button"
            style={{ padding: '12px 24px' }}
            className={`border bg_white text_dark bg_white cursor-pointer w-100 rounded-3 inter_medium flex justify-center items-center`}
            onClick={() => setShowDelete(false)}
          >
            No
          </button>
        </div>
      </Modal>
    </main >
  );
};

export default Services;
