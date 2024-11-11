/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyleSheetManager } from "styled-components";
import axiosInstanceStudent from "../../utils/axiosInstanceStudent";
import AppTable from "../DataTable/appTable";
const Courses = () => {
  const [loading, setLoading] = useState(false);
  const [adminBinData, setadminBinData] = useState([])
  const [count, setcount] = useState(0);
  const [lastId, setLastId] = useState(1);
  const [lastId2, setLastId2] = useState(0);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % adminBinData?.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + adminBinData?.length) % adminBinData?.length);
  };



  const columns = [
    {
      name: "Course Title",
      sortable: true,
      minWidth: "230px",
      maxWidth: "350px",
      cell: (row) => {
        return (
          <div className="flex justify-start items-center gap-1" style={{ maxWidth: '100px', width: '100%' }}>
            <span className="text_dark inter_medium text-nowrap">{row?.title}</span>
          </div>)
      }
    },
    {
      name: "Description",
      sortable: true,
      selector: (row) => row?.description || 'Not found',
      minWidth: "400px",
      maxWidth: "400px",
    },
    {
      name: "Price",
      sortable: true,
      minWidth: "100px",
      maxWidth: "100px",
      selector: (row) => row?.price || 'Not found',
    },
    {
      name: "Duration",
      sortable: true,
      minWidth: "10px",
      maxWidth: "150px",
      cell: (row) => (
        <span className="text_dark inter_medium">{row?.duration}</span>
      )
    },

    {
      name: "Actions",
      sortable: true,
      cell: (row) => {
        return (
          <button style={{ backgroundColor: '#F0F0F0' }} className="flex justify-start items-center gap-1 py-1 px-2 rounded-2">
            <span className="text_primary inter_medium">View Detail</span>
          </button>)
      },
      minWidth: "110px",
      maxWidth: "200px",
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    const res = await axiosInstanceStudent.get('/getCourses').then((response) => {

      if (response) {
        setCourses(response?.data);
        setcount(1);
      }
    });
    setLoading(false);

  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <StyleSheetManager
      shouldForwardProp={(prop) => !["sortActive"].includes(prop)}
    >
      <main className="lg:container p-4 mx-auto" style={{ minHeight: '90vh' }}>
        <div className="flex items-center mb-3 gap-3">
          <h5 className="plusJakara_semibold text_dark">All Courses</h5>
        </div>
        {loading ? (
          <main className="my-5 d-flex w-100 justify-content-center align-items-center">
            <CircularProgress size={24} className="text_dark" />
          </main>
        ) : !courses || courses.length === 0 ? (
          <main className="my-5 d-flex w-100 justify-content-center align-items-center">
            <span className="text_secondary plusJakara_medium">
              No Data Found
            </span>
          </main>
        ) : (
          <AppTable
            count={count}
            loading={loading}
            setCurrentPage={setLastId2}
            currentPage={lastId2}
            columns={columns}
            data={courses}
            setLastId={setLastId}
          />
        )}
      </main>



    </StyleSheetManager>
  );
};

export default Courses;
