/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { message } from 'antd';
import { Calendar, Eye, GraduationCap, Hash, Mail, MapPin, Phone, Trash2, User, X } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { Edit2 } from 'react-feather';
import { FaEllipsisH } from 'react-icons/fa';
import { StyleSheetManager } from "styled-components";
import axiosInstanceStudent from "../../utils/axiosInstanceStudent";
import StudentCardSkeleton from "../common/studentCardSkeleton";
const Students = () => {
  const [isOpen, setIsOpen] = useState(null);
  const toggleMenu = (index) => {
    setIsOpen(isOpen === index ? null : index);
  };
  const [isVisible, setIsVisible] = useState(true)
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [students, setStudents] = useState();
  const [isModal, setIsModal] = useState(false);


  const StudentPreview = ({ student, onClose }) => (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <InfoItem icon={<Hash className="w-5 h-5 text-gray-500" />} label="Roll Number" value={<span className={`${isModal ? 'text-[15px]' : 'text-[13px]'}`}>{student.rollNumber}</span>} />
          <InfoItem
            icon={<GraduationCap className="w-5 h-5 text-blue-500" />}
            label="Class"
            value={<span className={`${isModal ? 'text-[15px]' : 'text-[13px]'}`}>{student.class}</span>}
          />
          <InfoItem
            icon={<User className="w-5 h-5 text-orange-500" />}
            label="Gender"
            value={<span className={`${isModal ? 'text-[15px]' : 'text-[13px]'}`}>{student.gender}</span>}
          />
          <InfoItem
            icon={<Phone className="w-5 h-5 text-green-500" />}
            label="Phone"
            value={<span className={`${isModal ? 'text-[15px]' : 'text-[13px]'}`}>{student.phone}</span>}
          />
          <InfoItem
            icon={<MapPin className="w-5 h-5 text-red-500" />}
            label="Address"
            value={<span className={`${isModal ? 'text-[15px]' : 'text-[13px]'}`}>{student.address}</span>}
          />
          <InfoItem
            icon={<Mail className="w-5 h-5 text-blue-500" />}
            label="Email"
            value={<span className={`${isModal ? 'text-[15px]' : 'text-[13px]'}`}>{student.email}</span>}
          />

          <InfoItem
            icon={<Calendar className="w-5 h-5 text-purple-500" />}
            label="Date of Birth"
            value={new Date(student.dateOfBirth).toLocaleDateString()}
          />
          <div className="border-t flex  items-center justify-between    flex-wrap border-gray-200">
            <p className={`${isModal ? 'text-[14px] m-0 mt-2' : 'text-[13px]'} text-gray-500 m-0 mt-2`}>
              <span className="plusJakara_medium">Created:</span> {new Date(student.createdAt).toLocaleString()}
            </p>

            <p className={`${isModal ? 'text-[14px] m-0 mt-2' : 'text-[13px]'} text-gray-500 m-0 mt-2`}>
              <span className="plusJakara_medium">Last Updated:</span> {new Date(student.updatedAt).toLocaleString()}
            </p>

          </div>
        </div>
      </div>
    </div>
  )
  const handleEdit = () => {
    setIsOpen(null)
    message.info('This functionality is currently unavailable, but I can implement it for you if needed.');
  };

  const handleDelete = () => {
    setIsOpen(null)
    message.info('This functionality is currently unavailable, but I can implement it for you if needed.');

  };

  const handlePreview = (card) => {
    console.log('Preview clicked');
    setSelectedStudent(card)
    setIsModal(true)
    setIsOpen(null)
  };
  const actions = [
    {
      label: 'Edit',
      icon: <Edit2 size={16} />,
      onClick: handleEdit,
    },
    {
      label: 'Preview',
      icon: <Eye size={16} />,
      onClick: (card) => handlePreview(card),
    },
    {
      label: 'Delete',
      icon: <Trash2 size={16} />,
      onClick: handleDelete,
    }
  ];


  const fetchData = () => {
    setLoading(true);
    const res = axiosInstanceStudent.post('/getUser').then((response) => {
      if (response) {
        setStudents(response?.data?.data);

        setLoading(false);

      }
    }).catch((error) => {
      setLoading(false);
    })
  }
  useEffect(() => {
    fetchData();
  }, []);
  function InfoItem({ icon, label, value }) {
    return (
      <div className="flex items-center md:flex-nowrap sm:flex-wrap gap-2">
        {icon}
        <div className='flex gap-3'>
          {
            label ? (

              <p className=" text-[14px] plusJakara_bold  text-gray-800 text-nowrap m-0 gap-2">{label}</p>
            ) : ''
          }

          <p className="text-base text-[12px] text-gray-800 text-nowrap m-0 gap-2">{value}</p>
        </div>
      </div>
    )
  }


  return (
    <StyleSheetManager
      shouldForwardProp={(prop) => !["sortActive"].includes(prop)}
    >
      <main className="lg:container  sm:px-12 px-4 py-4 mx-auto  bg-gradient-to-br from-purple-100 to-blue-200" style={{ minHeight: '100vh' }}>
        <div className="flex items-center mb-3 gap-3 mt-16 mx-2">
          <h5 className="plusJakara_semibold text-lg text_dark">All Students</h5>
        </div>
        {loading ? (
          <div className="wrapper">
            {[...Array(5)].map((_, index) => (
              <StudentCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="wrapper">
            {students?.map((card, index) => (
              <div className="flex items-center justify-center" key={index}>
                <div
                  className={`bg-[#ffff] bg-opacity-20 backdrop-blur-lg px-3 py-2 rounded-xl shadow-lg  max-w-md w-full transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  <div className="flex justify-between">
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-[16px] font-bold text-gray-800">{card.name}</h2>
                      <span className="px-2 text-[12px] font-semibold text-green-800 bg-green-200 rounded-full">
                        {card.status}
                      </span>
                    </div>

                    <div className="flex justify-center items-center">
                      <div
                        className="relative"
                      >
                        <button
                          className="text-xl cursor-pointer p-2 rounded-full hover:bg-gray-200"
                          onClick={() => toggleMenu(index)}
                        >
                          <FaEllipsisH style={{ color: '#ffae4d' }} />
                        </button>

                        {(isOpen === index || null) && (
                          <div className="absolute right-0 top-7  mt-2 h-[80px]  bg-white text-black rounded-md shadow-lg">
                            <div className="flex flex-col gap-1">
                              {actions.map((action, index) => (
                                <button
                                  key={index}
                                  onClick={() => action.onClick(card)}  // Use card if needed, or remove if not required
                                  className={index === 1 ? 'w-full px-4 py-1 text-left text-sm hover:bg-[#0f1e30] hover:text-white' : "w-full px-4  text-left text-sm hover:bg-[#0f1e30] hover:text-white"}
                                >
                                  <div className="flex justify-center items-center gap-3">
                                    <p className="m-0 text-[14px]">{action.label}</p>
                                    {action.icon}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* <Space wrap>
                      <Dropdown.Button
                        menu={{
                          items,
                          onClick: (e) => handleMenuClick(e.key, card), // Pass the student data (card) here
                        }}
                        onClick={handleButtonClick}
                      />
                    </Space> */}
                  </div>

                  <div className="flex flex-row md:flex-nowrap flex-wrap gap-3 mb-1 py-2">
                    <InfoItem icon={<User className="w-5 h-5 text-orange-500" />} value={card.gender} />
                    <InfoItem icon={<Phone className="w-5 h-5 text-green-500" />} value={card.phone} />
                    <InfoItem
                      icon={<Calendar className="w-5 h-5 text-purple-500" />}

                      value={new Date(card.dateOfBirth).toLocaleDateString()}
                    />                  </div>

                  <div className="border-t border-gray-200">
                    <p className="text-xs mb-0 py-1 text-end text-gray-500">
                      Created: {new Date(card.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {selectedStudent && (
        <StudentPreview
          student={selectedStudent}
          onClose={() => {
            setIsModal(false)
            setSelectedStudent(null)
          }}
        />
      )}
    </StyleSheetManager>
  );
};

export default Students;
