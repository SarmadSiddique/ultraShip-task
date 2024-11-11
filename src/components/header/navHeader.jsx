/* eslint-disable no-unused-vars */
import { Menu, Transition } from "@headlessui/react";
import { message } from "antd";
import React, { Fragment, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { MdMenu } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import {
  avatar1,
  avatar3
} from "../icons/icon";

const NavHeader = ({ broken, setToggled, toggled }) => {
  const admindata = JSON.parse(window.localStorage.getItem('admin_data'))
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.removeItem("isLogin_admin");
    message.success("Logout Successful!");
    navigate("/login");
  };

  return (
    <>
      <Navbar
        bg="white"
        // style={{ backgroundColor: '#0EBE3C' }}
        expand="lg"
        sticky="top"
        className="p-3 shadow-sm w-[100%]"
        id="navbar"
      >
        <Container fluid="lg" className="w-full">
          <div className="flex items-center gap-3 md:w-1/2">
            {broken && (
              <button
                className="sb-button"
                onClick={() => setToggled(!toggled)}
              >
                <MdMenu size={28} />
              </button>
            )}
            {/* <h3 className="d-none d-md-block poppins_medium mb-0 text_dark"></h3> */}
          </div>
          <Nav className="ms-auto flex">
            <div className="flex justify-center items-center">
              <Menu as="div" className="relative">
                <Menu.Button className="relative flex items-center me-3 no-underline gap-2">
                  <img className="rounded-full" src={admindata?.profilePicture || avatar1} width="40px" alt="" />
                  <div className="d-flex flex-column align-items-start justify-content-start me-4">
                    <span style={{ fontSize: '12px' }} className="text_secondary plusJakara_medium">User</span>
                  </div>
                  <IoIosArrowDown style={{ color: '#000' }} />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    className="absolute z-10 mt-4 flex flex-col shadow-sm bg_white rounded-3 py-2"
                    style={{
                      minWidth: "10rem",
                      right: "0px",
                    }}
                  >
                    {/* <Link
                      // to='profile'
                      // onClick={handleLogout}
                      style={{ textDecoration: "none" }}
                      className="px-4 py-2 plusJakara_semibold sub_grid_dashboard2 text_dark no-underline"
                    >
                      Setting
                    </Link> */}
                    <Link
                      onClick={handleLogout}
                      style={{ textDecoration: "none" }}
                      className="px-4 py-2 plusJakara_semibold sub_grid_dashboard2 text_dark no-underline"
                    >
                      Sign out
                    </Link>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavHeader;
