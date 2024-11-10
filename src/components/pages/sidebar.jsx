/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  bin,
  customerdark,
  customerlight,
  dashboard3,
  dashboarddark,
  dumpsterdark,
  dumpsterlight,
  OrderIcon,
  OrderIconW,
  parentdark,
  parentlight,
  recyclebin,
  user4,
  userdark
} from "../icons/icon";
import axiosInstance, { headers } from "./ApiFunction/axiosInstance";
import { useAuth } from "../authRoutes/useAuth";
import { useSelector } from "react-redux";

const SidebarMenu = ({ children, setToggled, toggled, setBroken }) => {
  const [collapsed, setCollapsed] = useState(false);
  const binCounts = useSelector((state) => state.binStatus.binCounts);
  const [selectedLink, setSelectedLink] = useState("0");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [dustbinCount, setDustbinCount] = useState([]);
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


  const fetchData = async () => {
    try {
      const res = await axiosInstance.get(`api/bin/admin/check-bin`, {
        headers,
      });
      if (res?.data) {
        setDustbinCount(res?.data);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const menuItems = [
    {
      image: dashboard3,
      image2: dashboarddark,
      items: "Dashboard",
      path: "/dashboard",
    },
    // {
    //   image: categoryIcon,
    //   image2: categoryIconW,
    //   items: "Category",
    //   path: "/category",
    // },
    // {
    //   image: quizdark,
    //   image2: quizlight,
    //   items: "Services",
    //   path: "/services",
    // },
    {
      image: parentlight,
      image2: parentdark,
      items: "Renters",
      path: "/renters",
    },
    {
      items: "Bins",
      image: dumpsterlight,
      image2: bin,
      badge: binCounts?.pending > 0 ? binCounts?.pending : null,
      subItems: [
        {
          label: "Pending",
          path: "/pending-bin",
          badge: binCounts?.pending > 0 ? binCounts?.pending : null
        },
        {
          label: "Approved",
          path: "/approved-bin",
          // badge: binCounts?.verify > 0 ? binCounts?.verify : null
        },
        {
          label: "Rejected",
          path: "/rejected-bin",
          // badge: binCounts?.reject > 0 ? binCounts?.reject : null
        },
      ],
    },
    {
      image: user4,
      image2: userdark,
      items: "Rentees",
      path: "/rentees",
    },
    {
      items: "Dumpster",
      image: dumpsterlight,
      image2: dumpsterdark,
      subItems: [
        {
          label: "Create Dumpster",
          path: "/add-dumpster",
        },
        {
          label: "Dumpster List",
          path: "/dumpster-list",
        },
      ],
    },
    {
      image: OrderIconW,
      image2: OrderIcon,
      items: "All Orders",
      path: "/all-orders",
    },
    {
      image: customerlight,
      image2: customerdark,
      items: "Support",
      path: "/support",
      badge: binCounts?.totalPendingSupports > 0 ? binCounts?.totalPendingSupports : null
    },
    // {
    //   image: employeeIcon,
    //   image2: employeWIconW,
    //   items: "Service Providers",
    //   path: "/service-providers",
    // },
    // {
    //   image: historyIcon,
    //   image2: historyWIconW,
    //   items: "Estimates",
    //   path: "/estimates",
    // },
    // {
    //   image: parentdark,
    //   image2: parentlight,
    //   items: "Sub-Admins",
    //   path: "/sub-admins",
    // },
    // {
    //   image: AmenitiesIcon,
    //   image2: AmenitiesIconW,
    //   items: "Facilities",
    //   path: "/facilities",
    // },
    // {
    //   image: categoryIcon,
    //   image2: categoryIconW,
    //   items: "Sub category",
    //   path: "/sub-category",
    // },

    // {
    //   image: creditIcon,
    //   image2: creditWIconW,
    //   items: "Referal & Credits",
    //   path: "/referal",
    // },
    // {
    //   image: eventIcon,
    //   image2: eventWIconW,
    //   items: "Reports",
    //   path: "/reports",
    // },
    // { image: parentdark, image2: parentlight, items: "Help", path: '/help-support' },
    // { image: parentdark, image2: parentlight, items: "FAQs", path: '/faq' },
    // { image: parentdark, image2: parentlight, items: "All Orders", path: '/all-orders' },
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
                      src={recyclebin}
                      className=""
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
