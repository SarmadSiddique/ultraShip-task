import { Award, BookOpen, CalendarIcon, GraduationCap, Mail, MapPin, Phone, User2, Clipboard } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'react-feather';
import { Link, useLocation } from 'react-router-dom';
import { profileavatar } from '../icons/icon';
import { Card } from "antd";

const DetailPage = () => {
    const userdata = JSON.parse(window.localStorage.getItem('admin_data'))
    const [previewData, setPreviewData] = useState(null);
    const location = useLocation();

    const handleParamsData = () => {
        const params = new URLSearchParams(location.search);
        if (params.get("data")) {
            setPreviewData(JSON.parse(params.get("data")));
        }
    };

    useEffect(() => {
        handleParamsData();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    console.log(previewData)
    return (
        <main className="container mx-auto p-4" style={{ minHeight: '90vh' }}>
            <div className="flex items-center mb-4 gap-3">
                <Link to={-1} className="p-2 bg-gray-800 rounded-full text-blue-500 hover:bg-gray-300 hover:text-blue-700">
                    <ArrowLeft size={20} />
                </Link>
                <h5 className="plusJakara_semibold text-dark mt-1">
                    {previewData?.class ? 'Student' : 'Courses'} Detail
                </h5>
            </div>
            {
                previewData?.class ? (
                    <div className="container mx-auto p-4 space-y-4">
                        <Card style={{ width: "fit-content" }} className=" mx-auto shadow-lg px-3 py-2 bg-transparent border-0">

                            <Card.Body className="grid justify-around md:grid-cols-2">

                                <div className='d-flex flex-lg-row flex-col justify-center gap-3'>
                                    <div className="space-y-6">
                                        <div className=" borderclasses px-5 py-3 w-fit  rounded-lg  flex justify-center">
                                            <div className="flex flex-col items-center justify-center gap-1">

                                                <img

                                                    src={userdata?.profilePicture || profileavatar}
                                                    style={{ width: '110px', height: "110px", borderRadius: "50%" }}

                                                    alt=""
                                                />

                                                <span
                                                    className={
                                                        previewData?.status === "Active"
                                                            ? "gilroy-semibold text-success text-sm"
                                                            : "gilroy-semibold text-danger text-sm"
                                                    }
                                                >
                                                    {previewData?.status}
                                                </span>

                                                <span className="gilroy-semibold text-black text-sm">
                                                    {previewData?.name}
                                                </span>
                                                <span className="gilroy-regular text-xs text-black mb-2">
                                                    {previewData?.email}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="border-0  px-3 bg_primary text-white text-center py-[6px] h-auto"
                                                    style={{
                                                        cursor: "pointer",
                                                        minWidth: "100%",
                                                        borderRadius: "10px",
                                                    }}
                                                >
                                                    chat
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6 flex flex-row flex-wrap  gap-md-5 gap-3">
                                        <div className="space-y-2">
                                            <h6 className=" font_custom">Personal Information</h6>
                                            <div className="grid gap-2">
                                                <div className="flex items-center gap-2">
                                                    <User2 className="h-4 w-4 text-gray-500" />
                                                    <span className="font-medium">{previewData?.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-gray-500" />
                                                    <span>{previewData?.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-gray-500" />
                                                    <span>{previewData?.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                                                    <span>DOB: {formatDate(previewData?.dateOfBirth)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-gray-500" />
                                                    <span>{previewData?.address}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="">
                                            <p className="font_custom text-[20px] m-0" > Academic Information</p>
                                            <div className="grid gap-2 mt-1">
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="h-4 w-4 text-gray-500" />
                                                    <span>Class: {previewData?.class}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-gray-500" />
                                                    <span>Roll Number: {previewData?.rollNumber}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Award className="h-4 w-4 text-gray-500" />
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${previewData?.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {previewData?.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>) :
                    ""
            }

        </main>
    );
};

export default DetailPage;
