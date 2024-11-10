/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import { message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { StyleSheetManager } from "styled-components";
import ProductTable from "../../DataTable/productTable";
import { allDumpster, updateDumpsterStatus } from "../../api/dumpsterApi";
import { avatar1, bin1, edit2 } from "../../icons/icon";
import DumpsterForm from "./dumpsterForm";

const DumpsterList = () => {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [statusId, setStatusId] = useState("");
  const [lastId, setLastId] = useState(1);
  const [modalOpen, setModalOpen] = useState(false)
  const [lastId2, setLastId2] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState("");
  const [count, setcount] = useState(0);
  const [categories, setCategories] = useState([1, 2, 3]);

  const columns = [
    {
      name: "Image",
      sortable: true,
      minWidth: "110px",
      maxWidth: "200px",
      cell: (row) => {
        return (
          <div className="flex justify-start items-center">
            {row?.size === '10-12' &&
              <img src={bin1} style={{ width: 'auto', height: '30px', objectFit: 'cover' }} alt="" />
            }
            {row?.size === '15-16' &&
              <img src={bin1} style={{ width: 'auto', height: '40px', objectFit: 'cover' }} alt="" />
            }
            {row?.size === '18-20' &&
              <img src={bin1} style={{ width: 'auto', height: '50px', objectFit: 'cover' }} alt="" />
            }
            {row?.size === '30' &&
              <img src={bin1} style={{ width: 'auto', height: '60px', objectFit: 'cover' }} alt="" />
            }
          </div>)
      }
    },
    {
      name: "Size",
      sortable: true,
      minWidth: "110px",
      maxWidth: "250px",
      selector: (row) => (row?.size + ' Yards') || 'Not found',
    },
    {
      name: "Base Price",
      sortable: true,
      selector: (row) => ('$ ' + row?.price) || 'Not found',
      minWidth: "110px",
      maxWidth: "200px",
    },
    {
      name: "Description",
      sortable: true,
      minWidth: "110px",
      maxWidth: "200px",
      cell: (row) => <span className="plusJakara_regular">{row?.description || 'Not found'}</span>,
    },
    {
      name: "Action",
      allowoverflow: true,
      noSort: true,
      minWidth: "150px",
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
              className="flex justify-center rounded-3 items-center"
            >
              <img
                style={{ width: "14px", height: "auto" }}
                src={edit2}
                alt=""
              />
            </button>
            <button
              style={{
                backgroundColor: row?.status === 'active' ? '#4ad66d' : '#df3b57',
              }}
              disabled={loading2}
              onClick={() => handleUpdate(row)}
              className="text_white whitespace-nowrap flex justify-center px-2 py-1 rounded-2 items-center"
            >
              {loading2 && row?._id === statusId ? <CircularProgress size={15} className="text_white" /> :
                row?.status === 'active' ? 'Activated' : 'Deactivated'}
            </button>
          </div>
        );
      },
    },
  ];

  const HandleEditOpen = (row) => {
    setEditModal(true);
    setEditData(row);
  };

  const handleUpdate = async (item) => {
    setStatusId(item?._id);
    setLoading2(true);
    try {
      let newStatus;
      if (item?.status === "active") {
        newStatus = "deactive";
      } else if (item?.status === "deactive") {
        newStatus = "active";
      } else {
        return;
      }
      const res = await updateDumpsterStatus(item?._id, newStatus)
      if (res?.data) {
        message.success(`Dumpster ${newStatus} Successfully`);
        fetchData();
      }
    } catch (error) {
      setLoading2(false);
      // console.log(error);
    } finally {
      setLoading2(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await allDumpster(lastId)
      if (res?.data) {
        setCategories(res.data?.dumbsters);
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
    <StyleSheetManager
      shouldForwardProp={(prop) => !["sortActive"].includes(prop)}
    >
      <main className="lg:container py-5 px-4 mx-auto" style={{ minHeight: '90vh' }}>
        <div className="flex items-center mb-3 gap-3">
          <h5 className="plusJakara_semibold text_dark">Dumpster List</h5>
        </div>
        {loading ? (
          <main className="my-5 d-flex w-100 justify-content-center align-items-center">
            <CircularProgress size={24} className="text_dark" />
          </main>
        ) : !categories || categories.length === 0 ? (
          <main className="my-5 d-flex w-100 justify-content-center align-items-center">
            <span className="text_secondary plusJakara_medium">
              No Data Found
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

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        width={700}
      >
        <h6 className="inter_regular text_dark">Reviews</h6>
        {categories?.map((item, i) => (
          <div key={i} className="flex gap-3 border-b border-gray-200 py-3">
            <div className="flex gap-2">
              <img src={avatar1} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }} alt="" />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    <FaStar color="#FFBE4C" />
                    <FaStar color="#FFBE4C" />
                    <FaStar color="#FFBE4C" />
                    <FaStar color="#FFBE4C" />
                    <FaStar color="#FFBE4C" />
                  </div>
                  <span className="inter_medium text_dark">{item?.comment || '5.0 Star Ratings'}</span>
                </div>
                <span className="inter_medium text_dark">{item?.name || 'Miles, Esther'}</span>
                <span className="inter_light text_secondary">{item?.email || "The Dropbox HQ in San Francisco is one of the best designed & most comfortable offices I have ever witnessed. Great stuff! If you happen to visit SanFran, don't miss the chance to witness it yourself. "}</span>
              </div>
            </div>
          </div>
        ))}
      </Modal>

      <Modal
        open={editModal}
        onCancel={() => setEditModal(false)}
        footer={null}
        centered
        zIndex={9999}
        maskClosable={false}
        width={800}
      >
        <h6 className="plusJakara_medium text_dark">Edit Dumpster</h6>
        <DumpsterForm allDumpsters={categories} onUpdateSuccess={fetchData} open={editModal} setopen={setEditModal} selectedItem={editData} setSelectedItem={setEditData} formButton='Update' handleClose={() => setEditModal(false)} />
      </Modal>

    </StyleSheetManager>
  );
};

export default DumpsterList;
