/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { GrBasket } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import StatisticsChart from "../common/statisticsChart";
import { OrderIconW, user4 } from "../icons/icon";
import { setBinCounts } from "../redux/binStatus";
import axiosInstance, { headers } from "./ApiFunction/axiosInstance";
import { useDispatch } from "react-redux";
import { getBinCount } from "../api/count";
const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);


  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`api/users/dashboard`, {
        headers,
      });
      if (res?.data) {
        setCategories(res?.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataCount = async () => {
    try {
      const res = await getBinCount()
      if (res?.data) {
        dispatch(setBinCounts(res?.data))
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchDataCount();
    fetchData();
  }, []);

  return (
    <main className="min-h-screen lg:container py-4 px-5 mx-auto">
      <div className="bg_white rounded-5 shadow-sm p-3 p-md-5">
        <div className="flex flex-col w-full">
          <h5 className="poppins_medium text_dark">Today’s Summary</h5>
          <h6 className="poppins_regular text_secondary">Sales Summery</h6>
          <div className="gridDashboard w-full mt-5">
            <div className="sub_grid_dashboard w-100 p-4 rounded-4 gap-3 d-flex flex-column" style={{ backgroundColor: '#FFE2E5' }}>
              <div className="d-flex justify-content-center rounded-5 align-items-center" style={{ width: '50px', height: '50px', backgroundColor: '#BF83FF' }}>
                <FaUserPlus style={{ color: '#fff' }} size={24} />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="plusJakara_bold mb-0">{categories?.renter?.totalUsers || 0}</h4>
                <span className="plusJakara_medium text-sm">Total Renters</span>
                {/* <span className="plusJakara_medium text-sm" style={{ color: categories?.renter?.status === 'positive' ? "#0EBE3C" : '#ee6055' }}>{categories?.renter?.status === 'positive' ? "+" : '-'} {categories?.renter?.growth}</span> */}
              </div>
            </div>
            <div className="sub_grid_dashboard w-100 p-4 rounded-4 gap-3 d-flex flex-column" style={{ backgroundColor: '#FFF4DE' }}>
              <div className="d-flex justify-content-center rounded-5 align-items-center" style={{ width: '50px', height: '50px', backgroundColor: '#FA5A7D' }}>
                <img src={user4} className="text_white" style={{ width: "24px", height: 'auto' }} alt="" />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="plusJakara_bold mb-0">{categories?.rentee?.totalUsers || 0}</h4>
                <span className="plusJakara_medium text-sm">Total Rentee</span>
                {/* <span className="plusJakara_medium text-sm" style={{ color: categories?.rentee?.status === 'positive' ? "#0EBE3C" : '#ee6055' }}>{categories?.rentee?.status === 'positive' ? "+" : '-'} {categories?.rentee?.growth}</span> */}
              </div>
            </div>
            <div className="sub_grid_dashboard w-100 p-4 rounded-4 gap-3 d-flex flex-column" style={{ backgroundColor: '#F3E8FF' }}>
              <div className="d-flex justify-content-center rounded-5 align-items-center" style={{ width: '50px', height: '50px', backgroundColor: '#3CD856' }}>
                <img src={OrderIconW} className="text_white" style={{ width: "24px", height: 'auto' }} alt="" />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="plusJakara_bold mb-0">{categories?.order?.totalOrder || 0}</h4>
                <span className="plusJakara_medium text-sm">Total Orders</span>
                {/* <span className="plusJakara_medium text-sm" style={{ color: categories?.order?.status === 'positive' ? "#0EBE3C" : '#ee6055' }}>{categories?.order?.status === 'positive' ? "+" : '-'} {categories?.order?.growth}</span> */}
              </div>
            </div>
            <div className="sub_grid_dashboard w-100 p-4 rounded-4 gap-3 d-flex flex-column" style={{ backgroundColor: '#FFE2E5' }}>
              <div className="d-flex justify-content-center rounded-5 align-items-center" style={{ width: '50px', height: '50px', backgroundColor: '#BF83FF' }}>
                <GrBasket className="text_white" size={24} />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="plusJakara_bold mb-0">{categories?.dustbins?.totalDustbins || 0}</h4>
                <span className="plusJakara_medium text-sm">Total Dustbins</span>
                {/* <span className="plusJakara_medium text-sm" style={{ color: categories?.dustbins?.status === 'positive' ? "#0EBE3C" : '#ee6055' }}>{categories?.dustbins?.status === 'positive' ? "+" : '-'} {categories?.dustbins?.growth}</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <StatisticsChart earningData={categories?.graph} />
    </main>
  );
};

export default Dashboard;
