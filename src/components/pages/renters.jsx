/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import { Col, message as messageAntd, Modal, Row } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import { FaRegFile, FaStar } from "react-icons/fa";
import StarRatings from "react-star-ratings";
import { Form, Input } from "reactstrap";
import { StyleSheetManager } from "styled-components";
import ProductTable from "../DataTable/productTable";
import { allUsers, getAdminBin, getAdminRating, verifyBin } from "../api/customer";
import { avatar1, bin1 } from "../icons/icon";

const Renters = () => {
  const [loading, setLoading] = useState(false);
  const [loadingRating, setLoadingRating] = useState(false);
  const [loadingBin, setLoadingBin] = useState(false);
  const [adminBinData, setadminBinData] = useState([])
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setmessage] = useState('')
  const [lastIdBin, setLastIdBin] = useState(1);
  const [loading2, setLoading2] = useState(false);
  const [status, setStatus] = useState("");
  const [count, setcount] = useState(0);
  const [selectedRatingData, setselectedRatingData] = useState(null)
  const [loadingMoreRating, setLoadingMoreRating] = useState(false);
  const [lastId, setLastId] = useState(1);
  const [countRatiing, setcountRatiing] = useState(0);
  const [lastIdRatiing, setLastIdRatiing] = useState(1);
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpen2, setModalOpen2] = useState(false)
  const [modalOpen3, setModalOpen3] = useState(false)
  const [ratingData, setratingData] = useState([])
  const [lastId2, setLastId2] = useState(0);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);


  const handleShowRating = async (row, loadMore = false) => {
    if (loadMore === true) {
      setLoadingMoreRating(true);
    } else {
      setLastIdRatiing(1)
      setLoadingRating(true);
      setModalOpen(true);
      setselectedRatingData(row);
    }
    const page = loadMore === true ? lastIdRatiing + 1 : 1;

    await getAdminRating(row?._id, page)
      .then((res) => {
        if (res.status === 200) {
          if (loadMore) {
            setLastIdRatiing((prev) => prev + 1)
            setratingData((prev) => [...prev, ...res.data.ratings]);
          } else {
            setratingData(res.data.ratings);
            setLastIdRatiing(1)
          }
          setcountRatiing(res?.data?.count?.totalPage);
        } else {
          setLastIdRatiing(1)
          setratingData([]);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoadingRating(false);
        setLoadingMoreRating(false);
      });
  };

  const handleShowBin = async (row) => {
    setModalOpen2(true)
    setLoadingBin(true)
    const data = {
      userId: row?._id,
      // verify: false
    }
    await getAdminBin({ data: data }, lastIdBin).then((res) => {
      if (res.data?.dustbins?.length > 0) {
        setadminBinData(res.data?.dustbins)
        setLoadingBin(false)
        setLastIdBin(res?.data?.count?.totalPage);
      } else {
        setLoadingBin(false)
        setLastIdBin(1);
        setadminBinData([])
      }
    }).catch((err) => {
      setLoadingBin(false)
    })
  }

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % adminBinData?.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + adminBinData?.length) % adminBinData?.length);
  };


  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImagePreview(true);
  };

  const columns = [
    {
      name: "Name",
      sortable: true,
      minWidth: "150px",
      maxWidth: "200px",
      cell: (row) => {
        return (
          <div className="flex justify-start items-center gap-1" style={{ maxWidth: '100px', width: '100%' }}>
            <img onClick={() => handleImageClick(row?.profilePicture || avatar1)} src={row?.profilePicture || avatar1} className="cursor-pointer" style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: "50%" }} alt="" />
            <span className="text_dark inter_medium">{row?.name}</span>
          </div>)
      }
    },
    {
      name: "Phone Number",
      sortable: true,
      selector: (row) => row?.phone || 'Not found',
      minWidth: "160px",
      maxWidth: "200px",
    },
    {
      name: "Email",
      sortable: true,
      minWidth: "180px",
      maxWidth: "250px",
      selector: (row) => row?.email || 'Not found',
    },
    {
      name: "Address",
      sortable: true,
      minWidth: "250px",
      maxWidth: "300px",
      cell: (row) => (
        <span className="text_dark inter_medium">{row?.address}</span>
      )
    },
    {
      name: "Total Reviews",
      sortable: true,
      cell: (row) => {
        return (
          <button onClick={() => handleShowRating(row, false)} className="flex justify-start items-center gap-1">
            <FaStar color="#FFBE4C" />
            <span className="text_dark inter_medium">{row?.total_reviews}</span>
          </button>)
      },
      minWidth: "110px",
      maxWidth: "200px",
    },
    {
      name: "Pending Bins",
      sortable: true,
      minWidth: "140px",
      selector: (row) => row?.pendingCount || 0,
    },
    {
      name: "Verified Bins",
      sortable: true,
      minWidth: "140px",
      selector: (row) => row?.verifyCount || 0,
    },
    {
      name: "Rejected Bins",
      sortable: true,
      minWidth: "140px",
      selector: (row) => row?.rejectCount || 0,
    },
    {
      // name: "Ratings",
      sortable: true,
      cell: (row) => {
        return (
          <button onClick={() => handleShowBin(row)} style={{ backgroundColor: '#F0F0F0' }} className="flex justify-start items-center gap-1 py-1 px-2 rounded-2">
            <span className="text_primary inter_medium">View Bin</span>
          </button>)
      },
      minWidth: "110px",
      maxWidth: "200px",
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await allUsers('renter', lastId)
      if (res?.data) {
        setCategories(res?.data?.users);
        setcount(res?.data?.count?.totalPage);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lastId]);

  return (
    <StyleSheetManager
      shouldForwardProp={(prop) => !["sortActive"].includes(prop)}
    >
      <main className="lg:container p-4 mx-auto" style={{ minHeight: '90vh' }}>
        <div className="flex items-center mb-3 gap-3">
          <h5 className="plusJakara_semibold text_dark">All Renters</h5>
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
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false)
          setLastIdRatiing(1)
        }}
        style={{ zIndex: 999, maxHeight: '80vh', width: 'fit-content', overflowY: 'auto' }}
        footer={null}
        centered
        width={700}
      >
        <h6 className="inter_regular text_dark">Reviews</h6>
        {loadingRating ? (
          <div className="flex justify-center my-5 w-full">
            <CircularProgress size={20} className="text_black" />
          </div>
        ) : ratingData?.length === 0 ? (
          <h6 className="text_dark plusJakara_medium w-full my-5 text-center">Not Reviews Found</h6>
        ) : (
          ratingData?.map((item, i) => (
            <div key={i} className="flex gap-3 border-b border-gray-200 py-3">
              <div className="flex gap-2 w-full">
                <div style={{ minWidth: '80px' }}>
                  <img
                    src={item?.user?.profilePicture}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }}
                    alt=""
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <StarRatings
                      starEmptyColor="gray"
                      starRatedColor="#FFBE4C"
                      rating={item?.rating ?? 0}
                      starDimension="18px"
                      starSpacing="1px"
                    />
                    <span className="inter_medium mt-1 text_dark">{item?.rating} Star Rating</span>
                  </div>
                  <span className="inter_medium text_dark">{item?.user?.name || 'Not found'}</span>
                  <span className="inter_light text_secondary">{item?.review || "Not found"}</span>
                </div>
              </div>
            </div>
          ))
        )}
        {ratingData?.length > 0 && countRatiing > lastIdRatiing && (
          <div className="d-flex justify-center my-3 items-center">
            <button
              className="rounded-3 bg_primary text_white px-4 py-2 plusJakara_semibold"
              onClick={() => handleShowRating(selectedRatingData, true)}
              disabled={loadingMoreRating}
              style={{ zIndex: 99999, position: 'relative' }}
            >
              {loadingMoreRating ? <CircularProgress size={18} color="inherit" /> : 'See More'}
            </button>
          </div>
        )}
      </Modal>

      <Modal
        open={modalOpen2}
        onCancel={() => setModalOpen2(false)}
        footer={null}
        centered
        zIndex={9999}
        maskClosable={false}
        width={1000}
      >
        <div className="flex mb-4 justiy-between items-center w-full">
          <h5 className="inter_regular w-full mb-0 text_dark">Bin Preview</h5>
          <div className="me-4">
            <span
              style={{
                border: (adminBinData[currentPage]?.rejected === false && adminBinData[currentPage]?.verify === false) ? '1.5px solid #9d4edd' : (adminBinData[currentPage]?.rejected === false && adminBinData[currentPage]?.verify === true) ? '1.5px solid #0EBE3C' : '1.5px solid #d90429',
                color: (adminBinData[currentPage]?.rejected === false && adminBinData[currentPage]?.verify === false) ? '#9d4edd' : (adminBinData[currentPage]?.rejected === false && adminBinData[currentPage]?.verify === true) ? '#0EBE3C' : '#d90429', fontSize: '12px'
              }}
              className="bg-transparent rounded-3 px-2 py-1 plusJakara_semibold">
              {(adminBinData[currentPage]?.rejected === false && adminBinData[currentPage]?.verify === false) ? 'Pending' : (adminBinData[currentPage]?.rejected === false && adminBinData[currentPage]?.verify === true) ? 'Approved' : 'Rejected'}
            </span>
          </div>
        </div>
        {loadingBin ? (
          <div className="flex justify-center my-5 w-full">
            <CircularProgress size={20} className="text_black" />
          </div>
        ) : adminBinData?.length === 0 ? (
          <h6 className="text_dark plusJakara_medium w-full my-5 text-center">Not Dustbin Found</h6>
        ) : (
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                  <span className="text_secondary">Size</span>
                  <span className="text_dark ms-3">{adminBinData[currentPage]?.dumbster?.size}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text_secondary">Description</span>
                  <span className="text_dark ms-3">{adminBinData[currentPage]?.dumbster?.description}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text_secondary">Images</span>
                  <div className="flex justify-start items-center">
                    {adminBinData[currentPage]?.dumbster?.size === '10-12' && (
                      <img src={bin1} style={{ width: 'auto', height: '30px', objectFit: 'cover' }} alt="" />
                    )}
                    {adminBinData[currentPage]?.dumbster?.size === '15-16' && (
                      <img src={bin1} style={{ width: 'auto', height: '40px', objectFit: 'cover' }} alt="" />
                    )}
                    {adminBinData[currentPage]?.dumbster?.size === '18-20' && (
                      <img src={bin1} style={{ width: 'auto', height: '50px', objectFit: 'cover' }} alt="" />
                    )}
                    {adminBinData[currentPage]?.dumbster?.size === '30' && (
                      <img src={bin1} style={{ width: 'auto', height: '60px', objectFit: 'cover' }} alt="" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text_secondary">Bin Location</span>
                  <span className="text_dark ms-3">{adminBinData[currentPage]?.dumbster?.location}</span>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                  <span className="text_secondary">Insurance file</span>
                  <a href={adminBinData[currentPage]?.insurancefile} target="_blank" className="flex no-underline flex-col items-center">
                    <FaRegFile className="text_primary" size={28} />
                    <span className="text_secondary no-underline" style={{ fontSize: '14px' }}>click to open file</span>
                  </a>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text_secondary">Registration file</span>
                  <a href={adminBinData[currentPage]?.registrationfile} target="_blank" className="flex flex-col items-center">
                    <FaRegFile className="text_primary" size={28} />
                    <span className="text_secondary" style={{ fontSize: '14px' }}>click to open file</span>
                  </a>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text_secondary">Issue Date</span>
                  <span className="text_dark text-center ms-3">{moment(adminBinData[currentPage]?.issue_date).format('DD-MM-YYYY')}</span>
                </div>
              </div>
            </Col>
          </Row>
        )}
        {adminBinData?.length > 0 &&
          <div className="flex gap-3 mt-3 justify-between w-full">
            <div className="pagination-controls flex gap-2 items-center w-full">
              <button onClick={prevPage} disabled={currentPage === 0} style={{ backgroundColor: '#E8F7FF' }} className="p-2 rounded-2">
                <ArrowLeft className="text_primary" size={20} />
              </button>
              <div className="pagination-buttons flex gap-1 rounded-2 p-3">
                {adminBinData?.map((_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-2 rounded-2 ${index === currentPage ? 'bg_primary text_white' : 'text_dark'}`}
                    onClick={() => setCurrentPage(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button onClick={nextPage} disabled={currentPage === adminBinData?.length - 1} style={{ backgroundColor: '#E8F7FF' }} className="p-2 rounded-2">
                <ArrowRight className="text_primary" size={20} />
              </button>
            </div>
            {/* <div className="flex gap-3 items-center">
              {adminBinData[currentPage]?.verify === true ? <>
                <button disabled className="px-5 py-3 rounded-4 bg_primary text_white inter_regular">Approved</button>
                <button disabled={loading2} onClick={() => handleUpdate(adminBinData[currentPage], 'reject')} style={{ backgroundColor: '#F3F3F3' }} className="px-5 py-3 rounded-4 text_dark inter_regular">{loading2 && status === 'reject' ? <CircularProgress size={16} className="text_white" /> : 'Reject'}</button>
              </> :
                adminBinData[currentPage]?.rejected === true ? <>
                  <button disabled className="px-5 py-3 rounded-4 bg-danger text_white inter_regular">Rejected</button>
                  <button disabled={loading2} style={{ minWidth: '200px' }} onClick={() => handleUpdate(adminBinData[currentPage], 'approve')} className="px-4 bg_primary py-3 whitespace-nowrap rounded-4 text_white inter_regular">{loading2 && status === 'approve' ? <CircularProgress size={16} className="text_white" /> : 'Approve Again'}</button>
                </> : <>
                  <button disabled={loading2} onClick={() => handleUpdate(adminBinData[currentPage], 'approve')} className="px-5 py-3 rounded-4 bg_primary text_white inter_regular">{loading2 && status === 'approve' ? <CircularProgress size={16} className="text_white" /> : 'Approve'}</button>
                  <button disabled={loading2} onClick={() => handleUpdate(adminBinData[currentPage], 'reject')} style={{ backgroundColor: '#F3F3F3' }} className="px-5 py-3 rounded-4 text_dark inter_regular">{loading2 && status === 'reject' ? <CircularProgress size={16} className="text_white" /> : 'Reject'}</button>
                </>}
            </div> */}
          </div>}
      </Modal>

      <Modal
        open={showImagePreview}
        onCancel={() => setShowImagePreview(false)}
        centered
        footer={false}
      >
        <div className="pt-3">
          <img
            src={selectedImage}
            alt={selectedImage}
            className=" w-full"
            style={{ maxHeight: "20rem", borderRadius: '8px', objectFit: 'cover' }}
          />
        </div>
      </Modal>

    </StyleSheetManager>
  );
};

export default Renters;
