/* eslint-disable no-unused-vars */
import { message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import { avatar1, student } from "../icons/icon";

const NavHeader = ({ broken, setToggled, toggled }) => {
  const admindata = JSON.parse(window.localStorage.getItem("admin_data"));
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.removeItem("isLogin_admin");
    message.success("Logout Successful!");
    navigate("/login");
  };

  const menuItems = [
    { label: "Students", path: "/students" },
    { label: "Features", path: "/students" },
    { label: "Pricing", path: "/pricing" },
  ];

  return (
    <main className="lg:container mx-auto">

      <nav
        style={{ position: "fixed", top: 0, zIndex: "999", backgroundColor: "rgba(0, 0, 0, 0)" }}

        className=" text px-4 sticky-top py-3 w-full lg:container mx-auto ">
        <div className=" flex justify-between items-center">
          <a href="/students" className="text-yellow-700 plusJakara_medium no-underline font-bold">
            <img src={student} width="40px" className="rounded-full" alt="" />
          </a>
          <div className="flex items-center">
            {/* Toggler button for mobile */}
            <button
              className="lg:hidden text-white text-end"
              onClick={() => setToggled(!toggled)}
            >
              <MdMenu size={28} />
            </button>

            {/* Desktop menu */}
            <div className="hidden lg:flex items-center space-x-4">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.path}
                  className="text-yellow-700 no-underline plusJakara_medium  "
                >
                  {item.label}
                </a>
              ))}
              <div className="flex items-center lg:ml-4">
                <img
                  src={admindata?.profilePicture || avatar1}
                  alt="Profile"
                  className="rounded-full w-10 h-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {toggled && (
          <div className="lg:hidden mt-2 space-y-2 bg-primary lg:px-4 py-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.path}
                className="block text-white no-underline "
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center lg:ml-4">
              <img
                onClick={handleLogout}

                src={admindata?.profilePicture || avatar1}
                alt="Profile"
                className="rounded-full w-10 h-10"
              />
            </div>
          </div>
        )}
      </nav>
    </main>
  );
};

export default NavHeader;
