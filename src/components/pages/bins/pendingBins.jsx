/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import { Col, message as messageAntd, Modal, Row } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import { FaRegFile } from "react-icons/fa";
import { Form, Input } from "reactstrap";
import { StyleSheetManager } from "styled-components";
import ProductTable from "../../DataTable/productTable";
import { allUsers, getAdminBin, verifyBin } from "../../api/customer";
import { avatar1, bin1 } from "../../icons/icon";
import { getBinCount } from "../../api/count";
import { setBinCounts } from "../../redux/binStatus";
import { useDispatch } from "react-redux";

const PendingBins = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingBin, setLoadingBin] = useState(false);
  const [adminBinData, setadminBinData] = useState([])
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setmessage] = useState('')
  const [lastIdBin, setLastIdBin] = useState(1);
  const [loading2, setLoading2] = useState(false);
  const [status, setStatus] = useState("");
  const [count, setcount] = useState(0);
  const [lastId, setLastId] = useState(1);
  const [modalOpen2, setModalOpen2] = useState(false)
  const [modalOpen3, setModalOpen3] = useState(false)
  const [lastId2, setLastId2] = useState(0);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const handleShowBin = async (row) => {
    setModalOpen2(true)
    setLoadingBin(true)
    const data = {
      userId: row?._id,
      verify: false,
      rejected: false
    }
    await getAdminBin({ data: data }, lastIdBin,).then((res) => {
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

  const handleUpdate = async (item, status) => {
    setStatus(status);
    if (status === 'reject') {
      setModalOpen3(true);
      setModalOpen2(false);
    } else {
      setLoading2(true);
      const data = { status: 'approve' };
      try {
        const res = await verifyBin({ data: data }, item?._id,);
        if (res?.data) {
          messageAntd.success(`Bin ${status} Successfully`);
          setadminBinData(prevData =>
            prevData.map((bin) =>
              bin._id === item._id ? { ...bin, verify: true, } : bin
            )
          );
          await getBinCount().then((res) => {
            if (res.status === 200) {
              dispatch(setBinCounts(res?.data))
            }
          }).catch((err) => {
          })

        }
      } catch (error) {
        // console.log(error);
      } finally {
        setLoading2(false);
      }
    }
  };

  const handleSendRejection = async () => {
    setLoading2(true);
    const data = {
      status: 'reject',
      reason: message,
    };
    try {
      const res = await verifyBin({ data: data }, adminBinData[currentPage]?._id);
      if (res?.data) {
        messageAntd.success(`Bin rejected with reason: ${message}`);
        setadminBinData(prevData => prevData.map((bin, index) =>
          bin._id === adminBinData[currentPage]?._id ? { ...bin, rejected: true } : bin
        ));
        await getBinCount().then((res) => {
          if (res.status === 200) {
            dispatch(setBinCounts(res?.data))
          }
        }).catch((err) => {
        })
        setModalOpen3(false);
        setModalOpen2(true);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading2(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await allUsers('renter', lastId, 'pending')
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
          <h5 className="plusJakara_semibold text_dark">Pending Bins</h5>
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
        open={modalOpen2}
        onCancel={() => setModalOpen2(false)}
        footer={null}
        centered
        zIndex={9999}
        maskClosable={false}
        width={1000}
      >
        <h5 className="inter_regular mb-4 text_dark">Bin Preview</h5>
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
            <div className="flex gap-3 items-center">
              {adminBinData[currentPage]?.verify === true ? <>
                <button disabled style={{ minWidth: "150px" }} className="px-4 py-3 rounded-4 bg_primary text_white inter_regular">Approved</button>
                {/* <button disabled={loading2} onClick={() => handleUpdate(adminBinData[currentPage], 'reject')} style={{ backgroundColor: '#F3F3F3' }} className="px-4 py-3 rounded-4 text_dark inter_regular">{loading2 && status === 'reject' ? <CircularProgress size={16} className="text_white" /> : 'Reject'}</button> */}
              </> :
                adminBinData[currentPage]?.rejected === true ? <>
                  <button disabled style={{ minWidth: "150px" }} className="px-4 py-3 rounded-4 bg-danger text_white inter_regular">Rejected</button>
                  {/* <button disabled={loading2} style={{ minWidth: '200px' }} onClick={() => handleUpdate(adminBinData[currentPage], 'approve')} className="px-4 bg_primary py-3 whitespace-nowrap rounded-4 text_white inter_regular">{loading2 && status === 'approve' ? <CircularProgress size={16} className="text_white" /> : 'Approve Again'}</button> */}
                </> : <>
                  <button disabled={loading2} onClick={() => handleUpdate(adminBinData[currentPage], 'approve')} style={{ minWidth: "150px" }} className="px-4 py-3 rounded-4 bg_primary text_white inter_regular">{loading2 && status === 'approve' ? <CircularProgress size={16} className="text_white" /> : 'Approve'}</button>
                  <button disabled={loading2} onClick={() => handleUpdate(adminBinData[currentPage], 'reject')} style={{ backgroundColor: '#F3F3F3', minWidth: "150px" }} className="px-4 py-3 rounded-4 text_dark inter_regular">{loading2 && status === 'reject' ? <CircularProgress size={16} className="text_white" /> : 'Reject'}</button>
                </>}
            </div>
          </div>}
      </Modal>

      <Modal
        open={modalOpen3}
        onCancel={() => setModalOpen3(false)}
        footer={null}
        maskClosable={false}
        centered
        zIndex={9999}
      >
        <h6 className="text_dark plusJakara_medium">Send Reason</h6>
        <Form
          className="flex mt-3 form_data flex-col gap-2 w-full"
          onSubmit={e => {
            e.preventDefault();
            handleSendRejection();
          }}
        >
          <Input
            type="textarea"
            required
            className="form-control w-full plusJakara_regular"
            placeholder="Enter the reason for Rejection"
            value={message}
            onChange={(e) => setmessage(e.target.value)}
          />
          <div className="flex justify-end w-full">
            <button disabled={loading2} type="submit" className="bg_dark rounded-3 plusJakara_medium text_white py-2 px-4">
              {loading2 ? <CircularProgress size={14} className="text_white" /> : 'Send'}
            </button>
          </div>
        </Form>
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

export default PendingBins;
