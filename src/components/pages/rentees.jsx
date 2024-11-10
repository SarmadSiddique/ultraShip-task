/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import { message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { StyleSheetManager } from "styled-components";
import ProductTable from "../DataTable/productTable";
import { allUsers, getAdminRating, updateUser } from "../api/customer";
import { avatar1 } from "../icons/icon";
import StarRatings from "react-star-ratings";

const Rentees = () => {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [statusId, setStatusId] = useState("");
  const [lastId, setLastId] = useState(1);
  const [modalOpen, setModalOpen] = useState(false)
  const [loadingMoreRating, setLoadingMoreRating] = useState(false);
  const [lastId2, setLastId2] = useState(0);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [loadingRating, setLoadingRating] = useState(false);
  const [countRatiing, setcountRatiing] = useState(0);
  const [lastIdRatiing, setLastIdRatiing] = useState(1);
  const [selectedRatingData, setselectedRatingData] = useState(null)
  const [count, setcount] = useState(0);
  const [ratingData, setratingData] = useState([])
  const [categories, setCategories] = useState([]);

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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImagePreview(true);
  };

  const columns = [
    {
      name: "Name",
      sortable: true,
      minWidth: "110px",
      maxWidth: "200px",
      cell: (row) => {
        return (
          <div className="flex justify-start items-center gap-1" style={{ maxWidth: '100px', width: '100%' }}>
            <img src={row?.profilePicture || avatar1} onClick={() => handleImageClick(row?.profilePicture || avatar1)} className="cursor-pointer" style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '50%' }} alt="" />
            <span className="text_dark inter_medium">{row?.name}</span>
          </div>)
      }
    },
    {
      name: "Email",
      sortable: true,
      minWidth: "110px",
      maxWidth: "250px",
      selector: (row) => row?.email || 'Not found',
    },
    {
      name: "Phone Number",
      sortable: true,
      selector: (row) => row?.phone || 'Not found',
      minWidth: "110px",
      maxWidth: "200px",
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
          <button onClick={() => handleShowRating(row)} className="flex justify-start items-center gap-1">
            <FaStar color="#FFBE4C" />
            <span className="text_dark inter_medium">{row?.total_reviews}</span>
          </button>)
      },
      minWidth: "110px",
      maxWidth: "200px",
    },
  ];

  const handleUpdate = async (item) => {
    setStatusId(item?._id);

    setLoading2(true);
    try {
      let newStatus;
      if (item?.status === "online") {
        newStatus = "deactivated";
      } else if (item?.status === "deactivated") {
        newStatus = "online";
      } else {
        return;
      }
      const res = await updateUser(item?._id, newStatus)
      if (res?.data) {
        message.success(`User ${newStatus} Successfully`);
        // fetchData();
      }
    } catch (error) {
      setLoading2(false);
      // console.log(error);
    } finally {
      setLoading2(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await allUsers('rentee', lastId)
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
          <h5 className="plusJakara_semibold text_dark">All Rentees</h5>
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
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        style={{ zIndex: 999, maxHeight: '80vh', width: 'fit-content', overflowY: 'auto' }}
        width={700}
      >
        <h6 className="inter_regular text_dark">Reviews</h6>
        {loadingRating ?
          <div className="flex justify-center my-5 w-full">
            <CircularProgress size={20} className="text_black" />
          </div>
          : ratingData?.length === 0 ?
            <h6 className="text_dark plusJakara_medium w-full my-5 text-center">Not Reviews Found</h6>
            : ratingData?.map((item, i) => (
              <div key={i} className="flex gap-3 border-b border-gray-200 py-3">
                <div className="flex gap-2 w-full">
                  <div style={{ minWidth: '80px' }}>
                    <img src={item?.user?.profilePicture} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }} alt="" />
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
            ))}

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

export default Rentees;
