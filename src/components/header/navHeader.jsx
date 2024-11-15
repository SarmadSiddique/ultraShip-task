/* eslint-disable no-unused-vars */
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import { avatar1, student } from "../icons/icon";
const NavHeader = ({ setToggled, toggled }) => {
  const [scrolled, setScrolled] = useState(false);
  const admindata = JSON.parse(window.localStorage.getItem("admin_data"));
  const navigate = useNavigate();
  const handleLogout = () => {
    window.localStorage.removeItem("isLogin_admin", false);
    message.success("Logout Successful!");
    navigate("/");
  };
  const menuItems = [
    { label: "Students", path: "/students" },
    { label: "Features", path: "/students" },
    { label: "Pricing", path: "/students" },
  ];
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <main className="lg:container mx-auto">

      <nav
        style={{
          position: "fixed",
          top: 0,
          zIndex: "999",
          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
          backgroundColor: scrolled ? "#0f1e30" : "rgba(0, 0, 0, 0)",
          boxShadow: scrolled ? "0px 4px 12px rgba(0, 0, 0, 0.2)" : "none",
        }}
        className="text sm:px-14 px-4 sticky-top py-3 w-full lg:container mx-auto"
      >
        <div className="flex justify-between items-center">
          <a href="/students" className="text_primary plusJakara_medium no-underline font-bold">
            <img src={student} width="40px" className="rounded-full" alt="" />
          </a>
          <div className="flex items-center">
            <button
              className="lg:hidden text-white text-end"
              onClick={() => setToggled(!toggled)}
            >
              <MdMenu size={28} />
            </button>

            <div className="hidden lg:flex items-center space-x-4 pe-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={scrolled ? 'text-white no-underline plusJakara_medium' : "text_primary no-underline plusJakara_medium"}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center lg:ml-4 group relative">
                {/* Profile image */}
                <img
                  src={admindata?.profilePicture || avatar1}
                  alt="Profile"
                  className="rounded-full cursor-pointer w-10 h-10"
                />

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-7 mt-2 w-40 bg-white text-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-[#0f1e30] hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {toggled && (
          <div className="lg:hidden mt-2 space-y-2 bg_primary text_white rounded-md px-5 lg:px-4 py-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="block text-white no-underline"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center lg:ml-4">
              <img
                onClick={handleLogout}
                src={admindata?.profilePicture || avatar1}
                alt="Profile"
                className="rounded-full cursor-pointer w-10 h-10"
              />
            </div>
          </div>
        )}
      </nav>

    </main>
  );
};

export default NavHeader;
