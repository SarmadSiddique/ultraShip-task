/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DumpsterForm from "./dumpsterForm";
import { FaArrowLeft } from "react-icons/fa";
import { allDumpster } from "../../api/dumpsterApi";

const DumpsterCreate = () => {
  const navigate = useNavigate()
  const [dumpster, setdumpster] = useState(false)
  const [categories, setcategories] = useState([])

  const fetchData = async () => {
    try {
      const res = await allDumpster(1)
      if (res?.status === 200) {
        setdumpster(res.data?.dumbsters.length === 4);
        setcategories(res.data?.dumbsters);
      }
    } catch (error) {
      // console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    try {
      const res = allDumpster(1)
      // console.log(res);
      if (res?.data) {
        if (res.data.dumbsters.length === 4) {
          setdumpster(true);
        } else {
          setdumpster(false);
        }
      }
    } catch (error) {
      // console.log(error);
      setdumpster(false);
    }
  }, [])

  return (

    <main className="lg:container py-5 px-4 mx-auto" style={{ minHeight: '90vh' }}>
      <div className="bg_white rounded-3 p-4 flex flex-col gap-4">
        <div className="flex gap-3 items-center w-full">
          <button onClick={() => navigate(-1)} className="bg_primary rounded-3 p-2 text_white">
            <FaArrowLeft />
          </button>
          <h6 className="plusJakara_medium text_dark">Create Dumpster</h6>
        </div>
        <DumpsterForm allDumpsters={categories} dumpsterDisable={dumpster} formButton='Add' />
      </div>
    </main>



  );
};

export default DumpsterCreate;
