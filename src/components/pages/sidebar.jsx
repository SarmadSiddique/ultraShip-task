/* eslint-disable no-unused-vars */
import React, { Fragment, useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../authRoutes/useAuth";
import {
  coursedark,
  courselight,
  dashboard3,
  dashboarddark,
  student,
  user4,
  userdark
} from "../icons/icon";
const SidebarMenu = ({ children, setToggled, toggled, setBroken }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedLink, setSelectedLink] = useState("0");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = useAuth();

  const handleLinkClick = (itemId, path) => {
    setSelectedLink(itemId);
    setToggled(false);
    setShow(false);
    navigate(path);
  };

  const isChildPath = (parentPath, childPath) => {
    return childPath.startsWith(parentPath);
  };



  const menuItems = [
    {
      image: dashboard3,
      image2: dashboarddark,
      items: "Home",
      path: "/dashboard",
    },
    {
      image: user4,
      image2: userdark,
      items: "Students",
      path: "/students",
    },
    {
      image: courselight,
      image2: coursedark,
      items: "Courses",
      path: "/courses",
    },


  ];

  return (
    <>
      {isLogin ? (
        <div className="flex h-screen min-h-screen ">
          <div className="h-screen relative" style={{ zIndex: 9999 }}>
            <Sidebar
              width="260px"
              style={{ height: "100%", zIndex: 9999 }}
              collapsed={collapsed}
              toggled={toggled}
              backgroundColor="#fff"
              onBackdropClick={() => {
                setToggled(false);
                setShow(false);
              }}
              onBreakPoint={setBroken}
              breakPoint="xl"
            >
              <div
                className="scrolbar"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                  height: "100%",
                  paddingTop: "1rem",
                }}
              >
                <div className="flex items-center mb-3 justify-center">
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                    }}
                    className=""
                  >
                    <img
                      style={{ height: "5rem", width: "auto" }}
                      src={student}
                      className="rounded-full"
                      alt=""
                    />
                  </button>
                </div>
                <Menu className="container mx-auto flex flex-col justify-between h-full">
                  <div>
                    {menuItems.map((item, i) => (
                      <Fragment key={i}>
                        {item.subItems ? (
                          <SubMenu
                            label={
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-4">
                                  <img
                                    src={item.image2}
                                    alt=""
                                    style={{ width: '20px', height: 'auto' }}
                                  />
                                  <span>{item.items}</span>
                                </div>
                                {item.badge && (
                                  <span
                                    className="ml-auto me-2 rounded-full plusJakara_medium"
                                    style={{ fontSize: "0.7rem", padding: '1px 7px', backgroundColor: 'red', color: 'white' }}
                                  >
                                    {item?.badge}
                                  </span>
                                )}
                              </div>
                            }
                            className={`w-full manrope_semibold text_secondary mb-2`}
                          >
                            {item.subItems.map((subItem, j) => (
                              <MenuItem
                                key={`${i}-${j}`}
                                onClick={() =>
                                  handleLinkClick(`${i}-${j}`, subItem.path)
                                }
                                component={<Link to={subItem.path} />}
                                className={`w-full text_secondary rounded-3 ${isChildPath(subItem.path, location.pathname)
                                  ? "bg_primary text_white manrope_semibold"
                                  : ""
                                  }`}
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <span style={{ fontSize: '14px' }} className="manrope_semibold">
                                    {subItem.label}
                                  </span>
                                  {subItem.badge && (
                                    <span
                                      className="ml-auto me-2 rounded-full plusJakara_medium"
                                      style={{ fontSize: "0.7rem", padding: '1px 7px', backgroundColor: 'red', color: 'white' }}
                                    >
                                      {subItem?.badge}
                                    </span>
                                  )}
                                </div>
                              </MenuItem>
                            ))}
                          </SubMenu>
                        ) : (
                          <MenuItem
                            key={i}
                            onClick={() =>
                              handleLinkClick(i.toString(), item.path)
                            }
                            component={<Link to={item.path} />}
                            className={`w-full text_secondary rounded-3 mb-2 ${isChildPath(item.path, location.pathname)
                              ? "bg_primary text_white manrope_semibold"
                              : ""
                              }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex gap-4 items-center">
                                <img
                                  style={{ height: "auto", width: "22px" }}
                                  src={isChildPath(item.path, location.pathname) ? item.image : item.image2}
                                  alt=""
                                />
                                <div className="manrope_semibold">
                                  {item.items}
                                </div>
                              </div>
                              {item.badge && (
                                <span
                                  className="ml-auto me-2 rounded-full plusJakara_medium"
                                  style={{ fontSize: "0.7rem", padding: '1px 7px', backgroundColor: 'red', color: 'white' }}
                                >
                                  {item?.badge}
                                </span>
                              )}
                            </div>
                          </MenuItem>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </Menu>
              </div>
            </Sidebar>
          </div>
          <main
            className="w-full overflow-auto"
            style={{ backgroundColor: "#F3F3F9" }}
          >
            {children}
          </main>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default SidebarMenu;
