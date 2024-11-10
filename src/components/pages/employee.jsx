/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import { message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { StyleSheetManager } from "styled-components";
import { allUsers, updateUser } from "../api/customer";
import ProductTable from "../DataTable/productTable";
import { avatar1, service1 } from "../icons/icon";
import { Eye } from "react-feather";
import { useNavigate } from "react-router-dom";

const Employee = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [statusId, setStatusId] = useState("");
  const [lastId, setLastId] = useState(1);
  const [lastId2, setLastId2] = useState(0);
  const [count, setcount] = useState(0);
  const [selectedItem, setselectedItem] = useState(null)
  const [categories, setCategories] = useState([1, 2, 4]);
  const [showModal, setshowModal] = useState(false)

  const toCapitalized = (str) => {
    return str?.charAt(0)?.toUpperCase() + str?.slice(1);
  };

  const columns = [
    {
      name: "Business Logo",
      sortable: true,
      minWidth: "110px",
      maxWidth: "200px",
      cell: (row) => {
        return (
          <div className="flex justify-center gap-1" style={{ maxWidth: '100px', width: '100%' }}>
            <img src={avatar1} style={{ width: '35px', height: '35px', objectFit: 'cover' }} alt="" />
          </div>)
      }
    },
    {
      name: "Business Name",
      sortable: true,
      selector: (row) =>
        !row?.name
          ? "User Not found"
          : row?.name,
      minWidth: "110px",
      maxWidth: "200px",
    },
    {
      name: "Email",
      sortable: true,

      selector: (row) => row?.email || 'example@example.com',
      minWidth: "110px",
      maxWidth: "250px",
    },
    {
      name: "Phone",
      sortable: true,
      selector: (row) => row?.phone || '+1234567876',
      minWidth: "110px",
      maxWidth: "200px",
    },
    {
      name: "Address",
      sortable: true,
      selector: (row) => row?.plan || 'No found',
      minWidth: "110px",
      maxWidth: "200px",
    },
    {
      name: "Portfolio",
      sortable: true,
      minWidth: "110px",
      maxWidth: "200px",
      cell: (row) => {
        return (
          <button onClick={() => setshowModal(true)} className="flex plusJakara_semibold gap-1">
            See Portfolios
          </button>
        )
      }
    },
    {
      name: "Subscription",
      sortable: true,
      selector: (row) => row?.plan || 'No Plan',
      minWidth: "110px",
      maxWidth: "200px",
    },
    {
      name: "Insurance Details",
      sortable: true,
      selector: (row) => row?.plan || 'No Insurance',
      minWidth: "110px",
      maxWidth: "200px",
    },
    {
      name: "License Number",
      sortable: true,
      selector: (row) => row?.plan || 'Txvnjkol788900',
      minWidth: "110px",
      maxWidth: "200px",
    },
    // {
    //   name: "Category",
    //   sortable: true,
    //   minWidth: "110px",
    //   maxWidth: "250px",
    //   cell: (row) => {
    //     return (
    //       <div className="flex gap-1">
    //         {row?.category ?
    //           typeof row?.category !== 'string' && row?.category?.length > 0 ? (
    //             <div className="text_dark flex justify-center plusJakara_semibold items-center relative">
    //               {toCapitalized(row?.category?.join(', '))}
    //             </div>
    //           ) : (
    //             <div className="text_dark flex justify-center plusJakara_semibold items-center relative">
    //               {toCapitalized(row?.category)}
    //             </div>
    //           )
    //           : <div className="text_dark flex justify-center plusJakara_semibold items-center relative">
    //             Not Found
    //           </div>}
    //       </div>
    //     );
    //   },
    // },
    {
      name: "Action",
      allowoverflow: true,
      // minWidth: "110px",
      // maxWidth: "200px",
      cell: (row) => {
        return (
          <div className="flex gap-1">
            <button
              style={{
                // backgroundColor:
                //   row.status === "online" ? "#d15a5a" : "#06D6A0",
              }}
              disabled={loading2}
              // onClick={() => handleUpdate(row)}
              onClick={() => navigate('/service-providers/67898765400')}
              className={`text_white flex bg_primary justify-center rounded-3 py-1 px-2 items-center relative`}
            >
              {/* {statusId === row._id && loading2 ? (
                <CircularProgress size={15} color="inherit" />
              ) : row.status === "online" ? (
                "Deactivate"
              ) : (
                "Activate"
              )} */}
              <Eye size={18} />
            </button>
          </div>
        );
      },
    },
  ];

  const handleUpdate = async (item) => {
    setStatusId(item?._id);

    setLoading2(true);
    try {
      let newStatus;
      if (item?.status === "online") {
        newStatus = "deactivated";
      } else if (item?.status === "deactivated") {
        newStatus = "online";
      } else {
        return;
      }
      const res = await updateUser(item?._id, newStatus)
      if (res?.data) {
        message.success(`User ${newStatus} Successfully`);
        // fetchData();
      }
    } catch (error) {
      setLoading2(false);
      // console.log(error);
    } finally {
      setLoading2(false);
    }
  };

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await allUsers('employee', lastId)
  //     if (res?.data) {
  //       setCategories(res?.data?.users);
  //       setcount(res?.data?.count?.totalPage);
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     // console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, [lastId]);

  return (
    <StyleSheetManager
      shouldForwardProp={(prop) => !["sortActive"].includes(prop)}
    >
      <main className="min-h-screen lg:container py-5 px-4 mx-auto" style={{ minHeight: '90vh' }}>
        <div className="flex items-center mb-3 gap-3">
          <h5 className="plusJakara_semibold text_dark">All Service Providers</h5>
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
        open={showModal}
        centered
        onCancel={() => setshowModal(false)}
        footer={null}
      >
        <h6 className="plusJakara_semibold mb-3 text_dark">All Portfolio Images</h6>
        <div className="flex gap-3 flex-wrap items-center w-full">
          <img src={service1} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px' }} alt="" />
          <img src={service1} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px' }} alt="" />
          <img src={service1} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px' }} alt="" />
          <img src={service1} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px' }} alt="" />
        </div>
      </Modal>

    </StyleSheetManager>
  );
};

export default Employee;
