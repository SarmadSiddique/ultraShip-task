/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyleSheetManager } from "styled-components";
import ProductTable from "../DataTable/productTable";

import { Form, Modal } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { allOrders } from "../api/orders";
import { bin1 } from "../icons/icon";

const AllOrders = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState(1);
  const [lastId2, setLastId2] = useState(0);
  const [count, setcount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [dumpsterModal, setDumpsterModal] = useState(false);
  const [dumpsterDetail, setDumpsterDetail] = useState(null);

  const HandleDetailOpen = (row) => {
    setDumpsterModal(true);
    setDumpsterDetail(row);
  };

  const toCapitalized = (str) => {
    return str?.charAt(0)?.toUpperCase() + str?.slice(1);
  };


  const OrdersOption = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "completed", label: "Completed" },
  ];
  const [orderType, setOrderType] = useState(OrdersOption[0]);

  const handleChange = (selectedOption) => {
    setOrderType(selectedOption);
  };

  const columns = [
    {
      name: "Customer Name",
      sortable: true,
      minWidth: "180px",
      selector: (row) =>
        row?.user?.name || 'Not found',
    },
    {
      name: "Customer Email",
      sortable: true,
      minWidth: "220px",
      maxWidth: "220px",
      selector: (row) => row?.user?.email || 'Not found',
    },
    {
      name: "Phone No",
      sortable: true,
      selector: (row) => row?.user?.phone || 'Not found',
      minWidth: "180px",
      maxWidth: "200px",
    },
    {
      name: "Price",
      sortable: true,
      selector: (row) => ('$ ' + row?.price) || '$ 0',
      minWidth: "110px",
      maxWidth: "200px",
    },
    {
      name: "Start Date",
      sortable: true,
      selector: (row) => moment(row?.start_date).format('DD-MM-YYYY') || 'Not found',
      minWidth: "180px",
      maxWidth: "200px",
    },
    {
      name: "Status",
      sortable: true,
      minWidth: "180px",
      maxWidth: "200px",
      cell: (row) => (
        <button
          disabled
          style={{ backgroundColor: '#f4f4f4' }}
          className="text_black rounded-2 px-2 py-1 plusJakara_medium">{row?.status && toCapitalized(row?.status)}</button>
      ),
    },
    {
      name: "Dumpster",
      sortable: true,
      minWidth: "180px",
      maxWidth: "200px",
      cell: (row) => (
        <button onClick={() => HandleDetailOpen(row)} className="bg_primary text_white rounded-2 px-2 py-1 plusJakara_medium">View</button>
      ),
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await allOrders(lastId, orderType?.value)
      if (res?.status === 200) {
        setCategories(res?.data?.orders);
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
  }, [lastId, orderType]);

  return (
    <>
      <StyleSheetManager
        shouldForwardProp={(prop) => !["sortActive"].includes(prop)}
      >
        <main className="lg:container p-4 mx-auto" style={{ minHeight: '90vh' }}>
          <div className="flex flex-col mb-4 w-full">
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="plusJakara_bold text_black">All Orders</h4>
              <div style={{ width: "200px" }}>
                <Select
                  options={OrdersOption}
                  value={orderType}
                  onChange={handleChange}
                  defaultValue={OrdersOption[0]}
                />
              </div>
            </div>
          </div>
          {loading ? (
            <main className="my-5 d-flex w-100 justify-content-center align-items-center">
              <CircularProgress size={24} className="text_dark" />
            </main>
          ) : !categories || categories.length === 0 ? (
            <main className="my-5 d-flex w-100 justify-content-center align-items-center">
              <span className="text_secondary plusJakara_medium">
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



      <Modal
        open={dumpsterModal}
        centered
        onCancel={() => setDumpsterModal(false)}
        footer={null}
      >
        <h5 className="text_black plusJakara_medium">Dumpster Detail</h5>
        <div className="flex gap-3 items-start flex-col mt-4 w-full">
          <div className="flex justify-start items-center">
            {dumpsterDetail?.dumbster?.size === '10-12' &&
              <img src={bin1} style={{ width: 'auto', height: '40px', objectFit: 'cover' }} alt="" />
            }
            {dumpsterDetail?.dumbster?.size === '15-16' &&
              <img src={bin1} style={{ width: 'auto', height: '50px', objectFit: 'cover' }} alt="" />
            }
            {dumpsterDetail?.dumbster?.size === '18-20' &&
              <img src={bin1} style={{ width: 'auto', height: '60px', objectFit: 'cover' }} alt="" />
            }
            {dumpsterDetail?.dumbster?.size === '30' &&
              <img src={bin1} style={{ width: 'auto', height: '70px', objectFit: 'cover' }} alt="" />
            }
          </div>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex gap-2">
              <h6 className="plusJakara_bold text_black">Size:</h6>
              <span className="text_secondary plusJakara_medium">{dumpsterDetail?.dumbster?.size}</span>
            </div>
            <div className="flex gap-2">
              <h6 className="plusJakara_bold text_black">Dimension:</h6>
              <span className="text_secondary plusJakara_medium">{dumpsterDetail?.dumbster?.dimension}</span>
            </div>
            <div className="flex gap-2">
              <h6 className="plusJakara_bold text_black">Weight:</h6>
              <span className="text_secondary plusJakara_medium">{dumpsterDetail?.dumbster?.weight} kg</span>
            </div>
            <div className="flex gap-2">
              <h6 className="plusJakara_bold text_black">Price Per Km:</h6>
              <span className="text_secondary plusJakara_medium">$ {dumpsterDetail?.dumbster?.delivery_price_km}</span>
            </div>
            <div className="flex gap-2">
              <h6 className="plusJakara_bold text_black">Price:</h6>
              <span className="text_secondary plusJakara_medium">$ {dumpsterDetail?.dumbster?.price}</span>
            </div>
            <div className="flex gap-2">
              <h6 className="plusJakara_bold text_black">Usage:</h6>
              <span className="text_secondary plusJakara_medium">{dumpsterDetail?.dumbster?.usage}</span>
            </div>
            <div className="flex gap-2">
              <h6 className="plusJakara_bold text_black">Description:</h6>
              <span className="text_secondary plusJakara_medium">{dumpsterDetail?.dumbster?.description}</span>
            </div>
          </div>
        </div>
      </Modal>

    </>
  );
};

export default AllOrders;
