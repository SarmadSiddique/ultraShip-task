/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { BsClockHistory } from "react-icons/bs";
import { FaUserGraduate } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { MdAssignment } from "react-icons/md";
import { Skeleton } from "@mui/material";
import StatisticsChart from "../common/statisticsChart";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 150,
    assignmentsCompleted: 35,
    averagePerformance: 85,
    attendanceRate: 92,


  });
  const graphdata =
    [

      { x: 'Day 2', value: 60 },
      { x: 'Day 3', value: 55 },
      { x: 'Day 4', value: 70 },
      { x: 'Day 5', value: 80 },
      { x: 'Day 6', value: 90 },
      { x: 'Day 7', value: 100 },

    ]

  useEffect(() => {
    // Simulate loading data for 1 second
    setTimeout(() => {
      setLoading(false);
      // You can set the dashboard data here if needed
    }, 1000);
  }, []);

  return (
    <main className="min-h-screen lg:container py-4 px-5 mx-auto">
      <div className="bg_white rounded-5 shadow-sm p-3 p-md-5">
        <div className="flex flex-col w-full">
          <h5 className="poppins_medium text_dark">Today’s Summary</h5>
          <h6 className="poppins_regular text_secondary">Student Dashboard Overview</h6>
          <div className="gridDashboard w-full mt-5">
            {/* Total Students */}
            <div className="sub_grid_dashboard w-100 p-4 rounded-4 gap-3 d-flex flex-column" style={{ backgroundColor: '#E0F7FA' }}>
              {loading ? (
                <>
                  <Skeleton variant="circular" width={50} height={50} style={{ backgroundColor: '#00ACC1' }} />
                  <div className="flex flex-col gap-2">
                    <Skeleton variant="text" width="70%" height={32} />
                    <Skeleton variant="text" width="50%" height={24} />
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex justify-content-center rounded-5 align-items-center" style={{ width: '50px', height: '50px', backgroundColor: '#00ACC1' }}>
                    <FaUserGraduate style={{ color: '#fff' }} size={24} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="plusJakara_bold mb-0">{dashboardData.totalStudents}</h4>
                    <span className="plusJakara_medium text-sm">Total Students</span>
                  </div>
                </>
              )}
            </div>

            {/* Assignments Completed */}
            <div className="sub_grid_dashboard w-100 p-4 rounded-4 gap-3 d-flex flex-column" style={{ backgroundColor: '#E8F5E9' }}>
              {loading ? (
                <>
                  <Skeleton variant="circular" width={50} height={50} style={{ backgroundColor: '#43A047' }} />
                  <div className="flex flex-col gap-2">
                    <Skeleton variant="text" width="70%" height={32} />
                    <Skeleton variant="text" width="50%" height={24} />
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex justify-content-center rounded-5 align-items-center" style={{ width: '50px', height: '50px', backgroundColor: '#43A047' }}>
                    <MdAssignment style={{ color: '#fff' }} size={24} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="plusJakara_bold mb-0">{dashboardData.assignmentsCompleted}</h4>
                    <span className="plusJakara_medium text-sm">Assignments Completed</span>
                  </div>
                </>
              )}
            </div>

            {/* Performance Overview */}
            <div className="sub_grid_dashboard w-100 p-4 rounded-4 gap-3 d-flex flex-column" style={{ backgroundColor: '#FFF3E0' }}>
              {loading ? (
                <>
                  <Skeleton variant="circular" width={50} height={50} style={{ backgroundColor: '#FB8C00' }} />
                  <div className="flex flex-col gap-2">
                    <Skeleton variant="text" width="70%" height={32} />
                    <Skeleton variant="text" width="50%" height={24} />
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex justify-content-center rounded-5 align-items-center" style={{ width: '50px', height: '50px', backgroundColor: '#FB8C00' }}>
                    <IoIosStats style={{ color: '#fff' }} size={24} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="plusJakara_bold mb-0">{dashboardData.averagePerformance}%</h4>
                    <span className="plusJakara_medium text-sm">Average Performance</span>
                  </div>
                </>
              )}
            </div>

            {/* Attendance */}
            <div className="sub_grid_dashboard w-100 p-4 rounded-4 gap-3 d-flex flex-column" style={{ backgroundColor: '#F3E5F5' }}>
              {loading ? (
                <>
                  <Skeleton variant="circular" width={50} height={50} style={{ backgroundColor: '#8E24AA' }} />
                  <div className="flex flex-col gap-2">
                    <Skeleton variant="text" width="70%" height={32} />
                    <Skeleton variant="text" width="50%" height={24} />
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex justify-content-center rounded-5 align-items-center" style={{ width: '50px', height: '50px', backgroundColor: '#8E24AA' }}>
                    <BsClockHistory style={{ color: '#fff' }} size={24} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="plusJakara_bold mb-0">{dashboardData.attendanceRate}%</h4>
                    <span className="plusJakara_medium text-sm">Attendance Rate</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <StatisticsChart graphdata={graphdata} />
    </main>
  );
};

export default Dashboard;
