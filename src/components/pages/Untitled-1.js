/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Col, Form, Input, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { edit2, fileavatar, trash } from "../icons/icon";
import { Input as InputStrap } from 'reactstrap';
import { CircularProgress } from "@mui/material";
import ProductTable from "../DataTable/productTable";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
import axios from "axios";

const Ammendies = () => {
    // states-------
    const [isProcessing, setIsProcessing] = useState(false);
    const [isProcessing2, setIsProcessing2] = useState(false);
    const [fileLoading, setFileLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [lastId, setLastId] = useState(1);
    const [categories, setCategories] = useState([])
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [lastId2, setLastId2] = useState(0);
    const [count, setcount] = useState(0);
    const [selectedImg, setSelectedImg] = useState(null);
    const [courseImage, setCourseImage] = useState(null)
    const [data, setData] = useState([]);
    const [form] = Form.useForm();


    const uploadFoodFile = (courseFile) => {
        setFileLoading(true);
        if (!courseFile) return;
        const currentDate = new Date();
        const uniqueFileName = `${currentDate.getTime()}_${courseFile?.name}`;
        const imageRef = ref(storage, `ammendy_image/${uniqueFileName}`);
        uploadBytes(imageRef, courseFile).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setFileLoading(false);
                setCourseImage(url);
            });
        });
    };

    const handleCourseFile = (e) => {
        setFileLoading(true);
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImg(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImg(null);
        }
        if (file) {
            uploadFoodFile(file);
        }
    };

    const handleSubmit = async (values) => {
        setIsProcessing(true)
        try {
            const res = await axios.post(`${global.BASEURL}api/facilities/create`,
                {
                    name: values?.catName,
                    image: courseImage
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': `${global.TOKEN}`
                }
            })
            if (res) {
                message.success('Ammendy created Successfully')
                form.resetFields()
                setSelectedImg('')
            }
        } catch (error) {
            setIsProcessing(false)
            message.error("Your Ammendy did not create")
            // console.log(error);
        } finally {
            setIsProcessing(false)
        }
    }

    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`,
        };
        setLoading(true);
        try {
            const res = await axios.get(`${global.BASEURL}api/facilities/admin/${lastId}`, { headers });
            if (res?.data) {
                setCategories(res?.data?.facilities);
                setcount(res?.data?.count?.totalPage)
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

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImagePreview(true);
    };

    const columns = [
        {
            name: "Ammendy Name",
            sortable: true,
            maxwidth: "35px",
            selector: (row) => row?.name,
        },
        {
            name: "Icon",
            sortable: true,
            cell: (row) => {
                return (
                    <div className="">
                        <img src={row?.image}
                            onClick={() => handleImageClick(row?.image)}
                            className="rounded-5"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', cursor: 'pointer' }} alt=""
                        />
                    </div>
                );
            },
        },
        {
            name: "Action",
            allowoverflow: true,
            noSort: true,
            minwidth: "112px",
            cell: () => {
                return (
                    <div className="flex gap-1">
                        <button
                            style={{ width: '24px', height: '24px', backgroundColor: '#54A6FF' }}
                            className="bg-[#54A6FF] flex justify-center rounded-3 items-center">
                            <img style={{ width: '14px', height: 'auto' }} src={edit2} alt="" />
                        </button>
                        <button
                            style={{ width: '24px', height: '24px', backgroundColor: '#CE2C60' }}
                            className="bg-[#CE2C60] flex justify-center rounded-3 items-center">
                            <img style={{ width: '14px', height: 'auto' }} src={trash} alt="" />
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <div>
                <main className="min-h-screen lg:container py-5 px-4 mx-auto">
                    <div className="flex justify-between max-md:flex-col max-md:gap-3 mb-2 md:items-center w-full">
                        <div className="w-full">
                            <h3 className="manrope_bold mb-3 text_black">
                                Ammendies
                            </h3>
                            <h6 className="text_secondary max-md:text-sm manrope_regular mb-3">
                                Explore our wide selection of categories and add the ones that
                                best suit your needs!
                            </h6>
                            <div className="">
                                <Card
                                    className="p-3 border-0  w-100"
                                    style={{
                                        maxWidth: "30rem",
                                        height: "auto",
                                        boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
                                    }}
                                >
                                    <Form className="flex flex-wrap" form={form} onFinish={handleSubmit}>
                                        <Col span={24} className="mt-">
                                            <h6 className="manrope_medium text-[#252C32]">
                                                Add Ammendy{" "}
                                            </h6>
                                            <div className="flex flex-col mb-3 gap-2">
                                                <div>
                                                    <label style={{ cursor: 'pointer' }} htmlFor="fileInput" className="cursor-pointer">
                                                        {fileLoading ? <div style={{ width: '120px', height: '100px', }} className='border rounded-3 d-flex justify-content-center align-items-center'>
                                                            <CircularProgress size={20} />
                                                        </div> :
                                                            selectedImg ? (
                                                                <img src={selectedImg} alt="Preview" style={{ width: '120px', height: '100px', objectFit: 'cover' }} className="rounded-3 object-cover" />
                                                            ) : (
                                                                <div style={{ width: '120px', height: '100px' }} className="border rounded-3 flex justify-center items-center">
                                                                    <img src={fileavatar} alt="Camera Icon" />
                                                                </div>
                                                            )}
                                                    </label>
                                                    <InputStrap
                                                        type="file"
                                                        required
                                                        id="fileInput"
                                                        className="visually-hidden"
                                                        onChange={handleCourseFile}
                                                    />
                                                </div>
                                            </div>
                                            <Form.Item
                                                name="catName"
                                                className="mt-2 mb-[20px]"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please enter the Ammendy Name",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    size="large"
                                                    className="manrope_regular text-[#9AA6AC]"
                                                    type="text"
                                                    placeholder="Ammendy Name"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <div className="d-flex w-100 justify-content-end">
                                            {isProcessing === false ? (
                                                <button
                                                    type="submit"
                                                    disabled={fileLoading}
                                                    className="px-4 py-2 text_white rounded-3 bg_dark manrope_medium"
                                                >
                                                    Continue
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="px-5 py-2 text_white rounded-3 bg_dark manrope_medium"
                                                    disabled
                                                >
                                                    <CircularProgress color="inherit" size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </Form>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 ">
                        <h4 className="mt-5 manrope_bold mb-3">Ammendy List</h4>
                        {loading ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                            <CircularProgress size={24} className='text_dark' />
                        </main> :
                            !categories || categories.length === 0 ?
                                <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                                    <span className="text_secondary manrope_medium">No Ammendy Found</span>
                                </main> :
                                <ProductTable
                                    count={count}
                                    loading={loading}
                                    setCurrentPage={setLastId2}
                                    currentPage={lastId2}
                                    columns={columns}
                                    data={categories}
                                    setLastId={setLastId}
                                />
                        }
                    </div>
                </main>
            </div>

            <Modal
                open={showImagePreview}
                onCancel={() => setShowImagePreview(false)}
                footer={null}
            >
                <img
                    src={selectedImage}
                    alt={selectedImage}
                    className="object-cover w-full"
                    style={{ maxHeight: "30rem" }}
                />
            </Modal>
        </>
    );
};

export default Ammendies;




/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Col, Form, Input, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { edit2, fileavatar, trash } from "../icons/icon";
import { Input as InputStrap } from 'reactstrap';
// import { createCategory, getCategory } from "../api/category";
import { CircularProgress } from "@mui/material";
import ProductTable from "../DataTable/productTable";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
import axios from "axios";

const Category = () => {
    // states-------
    const [isProcessing, setIsProcessing] = useState(false);
    const [isProcessing2, setIsProcessing2] = useState(false);
    const [fileLoading, setFileLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [lastId, setLastId] = useState(1);
    const [categories, setCategories] = useState([])
    const [lastId2, setLastId2] = useState(0);
    const [count, setcount] = useState(0);
    const [selectedImg, setSelectedImg] = useState(null);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [courseImage, setCourseImage] = useState(null)
    const [data, setData] = useState([]);
    const [form] = Form.useForm();


    const uploadFoodFile = (courseFile) => {
        setFileLoading(true);
        if (!courseFile) return;
        const currentDate = new Date();
        const uniqueFileName = `${currentDate.getTime()}_${courseFile?.name}`;
        const imageRef = ref(storage, `category_image/${uniqueFileName}`);
        uploadBytes(imageRef, courseFile).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setFileLoading(false);
                setCourseImage(url);
            });
        });
    };

    const handleCourseFile = (e) => {
        setFileLoading(true);
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImg(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImg(null);
        }
        if (file) {
            uploadFoodFile(file);
        }
    };

    const handleSubmit = async (values) => {
        setIsProcessing(true)
        try {
            const res = await axios.post(`${global.BASEURL}api/cat/create`,
                {
                    name: values?.catName,
                    image: courseImage
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': `${global.TOKEN}`
                }
            })
            if (res) {
                message.success('Category created Successfully')
                form.resetFields()
                setSelectedImg('')
            }
        } catch (error) {
            setIsProcessing(false)
            message.error("Your category did not create")
            // console.log(error);
        } finally {
            setIsProcessing(false)
        }
    }

    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`,
        };
        setLoading(true);
        try {
            const res = await axios.get(`${global.BASEURL}api/cat/admin/${lastId}`, { headers });
            if (res?.data) {
                setCategories(res?.data?.categories);
                setcount(res?.data?.count?.totalPage)
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

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImagePreview(true);
    };

    const columns = [
        {
            name: "Category Name",
            sortable: true,
            selector: (row) => row?.name,
        },
        {
            name: "Icon",
            sortable: true,
            cell: (row) => {
                return (
                    <div className="">
                        <img src={row?.image}
                            onClick={() => handleImageClick(row?.image)}
                            className="rounded-5"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', cursor: 'pointer' }} alt=""
                        />
                    </div>
                );
            },
        },
        {
            name: "Action",
            allowoverflow: true,
            noSort: true,
            minwidth: "112px",
            cell: () => {
                return (
                    <div className="flex gap-1">
                        <button
                            style={{ width: '24px', height: '24px', backgroundColor: '#54A6FF' }}
                            className="bg-[#54A6FF] flex justify-center rounded-3 items-center">
                            <img style={{ width: '14px', height: 'auto' }} src={edit2} alt="" />
                        </button>
                        <button
                            style={{ width: '24px', height: '24px', backgroundColor: '#CE2C60' }}
                            className="bg-[#CE2C60] flex justify-center rounded-3 items-center">
                            <img style={{ width: '14px', height: 'auto' }} src={trash} alt="" />
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <div>
                <main className="min-h-screen lg:container py-5 px-4 mx-auto">
                    <div className="flex justify-between max-md:flex-col max-md:gap-3 mb-2 md:items-center w-full">
                        <div className="w-full">
                            <h3 className="manrope_bold mb-3 text_black">
                                Accomodation Categories
                            </h3>
                            <h6 className="text_secondary max-md:text-sm manrope_regular mb-3">
                                Explore our wide selection of categories and add the ones that
                                best suit your needs!
                            </h6>
                            <div className="">
                                <Card
                                    className="p-3 border-0  w-100"
                                    style={{
                                        maxWidth: "30rem",
                                        height: "auto",
                                        boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
                                    }}
                                >
                                    <Form className="flex flex-wrap" form={form} onFinish={handleSubmit}>
                                        <Col span={24} className="mt-">
                                            <h6 className="manrope_medium text-[#252C32]">
                                                Add Category{" "}
                                            </h6>
                                            <div className="flex flex-col mb-3 gap-2">
                                                <div>
                                                    <label style={{ cursor: 'pointer' }} htmlFor="fileInput" className="cursor-pointer">
                                                        {fileLoading ? <div style={{ width: '120px', height: '100px', }} className='border rounded-3 d-flex justify-content-center align-items-center'>
                                                            <CircularProgress size={20} />
                                                        </div> :
                                                            selectedImg ? (
                                                                <img src={selectedImg} alt="Preview" style={{ width: '120px', height: '100px', objectFit: 'cover' }} className="rounded-3 object-cover" />
                                                            ) : (
                                                                <div style={{ width: '120px', height: '100px' }} className="border rounded-3 flex justify-center items-center">
                                                                    <img src={fileavatar} alt="Camera Icon" />
                                                                </div>
                                                            )}
                                                    </label>
                                                    <InputStrap
                                                        type="file"
                                                        required
                                                        id="fileInput"
                                                        className="visually-hidden"
                                                        onChange={handleCourseFile}
                                                    />
                                                </div>
                                            </div>
                                            <Form.Item
                                                name="catName"
                                                className="mt-2 mb-[20px]"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please enter the Category Name",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    size="large"
                                                    className="manrope_regular text-[#9AA6AC]"
                                                    type="text"
                                                    placeholder="Category Name"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <div className="d-flex w-100 justify-content-end">
                                            {isProcessing === false ? (
                                                <button
                                                    type="submit"
                                                    disabled={fileLoading}
                                                    className="px-4 py-2 text_white rounded-3 bg_dark manrope_medium"
                                                >
                                                    Continue
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="px-5 py-2 text_white rounded-3 bg_dark manrope_medium"
                                                    disabled
                                                >
                                                    <CircularProgress color="inherit" size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </Form>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 ">
                        <h4 className="mt-5 manrope_bold mb-3">Category List</h4>
                        {loading ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                            <CircularProgress size={24} className='text_dark' />
                        </main> :
                            !categories || categories.length === 0 ?
                                <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                                    <span className="text_secondary manrope_medium">No Category Found</span>
                                </main> :
                                <ProductTable
                                    count={count}
                                    loading={loading}
                                    setCurrentPage={setLastId2}
                                    currentPage={lastId2}
                                    columns={columns}
                                    data={categories}
                                    setLastId={setLastId}
                                />
                        }
                    </div>
                </main>
            </div>

            <Modal
                open={showImagePreview}
                onCancel={() => setShowImagePreview(false)}
                footer={null}
            >
                <img
                    src={selectedImage}
                    alt={selectedImage}
                    className="object-cover w-full"
                    style={{ maxHeight: "30rem" }}
                />
            </Modal>
        </>
    );
};

export default Category;



/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import ProductTable from '../DataTable/productTable';
import { dataTable } from '../DataTable/productsData';
import { avatarman, preview, trash } from '../icons/icon';
import { StyleSheetManager } from 'styled-components';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import { message } from 'antd';

const Customers = () => {
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [statusId, setStatusId] = useState('')
    const [lastId, setLastId] = useState(1);
    const [lastId2, setLastId2] = useState(0);
    const [count, setcount] = useState(0);
    const [categories, setCategories] = useState([])

    const columns = [
        {
            name: 'Customer Name',
            sortable: true,
            selector: (row) => !row?.fname && !row?.lname ? 'User Not found' : row?.fname + ' ' + row?.lname
        },
        {
            name: "Email",
            sortable: true,
            minWidth: '260px',
            selector: (row) => row?.email
        },
        {
            name: "Phone",
            sortable: true,
            selector: (row) => row?.phone
        },
        {
            name: "Address",
            sortable: true,
            selector: (row) => row?.location?.address
        },
        {
            name: 'Action',
            allowoverflow: true,
            minwidth: '100px',
            cell: (row) => {
                return (
                    <div className='flex gap-1'>
                        <button
                            style={{
                                backgroundColor: row.status === 'online' ? '#d15a5a' : '#06D6A0'
                            }}
                            disabled={loading2}
                            onClick={() => handleUpdate(row)}
                            className={`text_white flex justify-center rounded-3 py-1 px-2 items-center relative`}
                        >
                            {statusId === row._id && loading2 ? (
                                <CircularProgress
                                    size={15}
                                    color='inherit'
                                />
                            ) : (
                                row.status === 'online' ? 'Deactivate' : 'Activate'
                            )}
                        </button>
                    </div>
                );
            }
        }
    ]

    const handleUpdate = async (item) => {
        setStatusId(item?._id)
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`,
        };
        setLoading2(true);
        try {
            let newStatus;
            if (item?.status === 'online') {
                newStatus = 'deactivated';
            } else if (item?.status === 'deactivated') {
                newStatus = 'online';
            } else {
                return;
            }
            const res = await axios.put(`${global.BASEURL}api/users/admin/update/${item._id}/${newStatus}`, {}, { headers });
            if (res?.data) {
                message.success(`User ${newStatus} Successfully`)
                fetchData()
            }
            // console.log(res);
        } catch (error) {
            setLoading2(false);
            // console.log(error);
        } finally {
            setLoading2(false);
        }
    }

    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`,
        };
        setLoading(true);
        try {
            const res = await axios.get(`${global.BASEURL}api/users/admin/all/customer/${lastId}`, { headers });
            if (res?.data) {
                setCategories(res?.data?.users);
                setcount(res?.data?.count?.totalPage)
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
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            <main className="min-h-screen lg:container py-5 px-4 mx-auto">
                <div className="flex items-center mb-3 gap-3">
                    <h5 className="plusJakara_semibold text_dark">All Customers</h5>
                </div>
                {loading ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                    <CircularProgress size={24} className='text_dark' />
                </main> :
                    !categories || categories.length === 0 ?
                        <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                            <span className="text_secondary plusJakara_medium">No Data Found</span>
                        </main> :
                        <ProductTable
                            count={count}
                            loading={loading}
                            setCurrentPage={setLastId2}
                            currentPage={lastId2}
                            columns={columns}
                            data={categories}
                            setLastId={setLastId}
                        />
                }
            </main>
        </StyleSheetManager>
    )
}

export default Customers;