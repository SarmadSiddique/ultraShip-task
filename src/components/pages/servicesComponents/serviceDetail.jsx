/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Check,
  Code,
  Download,
  Phone,
  PhoneCall,
  Trash,
  Trash2,
} from "react-feather";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Form, message } from "antd";
import { MdDiscount, MdPets } from "react-icons/md";
import { googlemap, news1, pdflogo, service1 } from "../../icons/icon";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const serviceDetail = state?.serviceDetail || null;

  const handleUpdate = () => {
    navigate(`/services/${serviceDetail?._id}`, {
      state: { serviceDetail: serviceDetail },
    });
  };

  const handleMapClick = () => {
    const lng = parseFloat(serviceDetail?.location?.coordinates?.[0]);
    const lat = parseFloat(serviceDetail?.location?.coordinates?.[1]);

    if (!isNaN(lat) && !isNaN(lng)) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else {
      console.error('Invalid latitude or longitude');
    }
  };


  const toCapitalized = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <main className="container m-auto min-h-screen py-4">
      <div className="flex justify-between flex-wrap gap-3 items-center mb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              navigate("/services");
            }}
            className="flex items-center justify-center p-2 bg_primary rounded-3"
          >
            <ArrowLeft className="text_white" />
          </button>
          <h5 className="manrope_semibold mb-0 text_dark">Service Detail</h5>
        </div>
        {serviceDetail?.type === "accomodation" ? (
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="button-tooltip-2">
                You cannot Edit Accomodation Services.
              </Tooltip>
            }
          >
            <button
              type="button"
              // style={{ width: '150px' }}
              className="bg_secondary p-2 rounded-3 text_white plusKajara_semibold"
              disabled
            >
              <span className="manrope_semibold text-sm text_white">
                Edit Service
              </span>
            </button>
          </OverlayTrigger>
        ) : (
          <button
            onClick={() => handleUpdate(serviceDetail)}
            type="button"
            className="flex justify-center bg_primary px-3 py-2 rounded-3 items-center"
          >
            <span className="manrope_semibold text-sm text_white">
              Edit Service
            </span>
          </button>
        )}
      </div>
      <div className="bg_white rounded-3 shadow-md overflow-hidden">
        <img
          src={serviceDetail?.images[0]}
          style={{ maxHeight: "20rem", width: "100%", objectFit: "cover" }}
          alt=""
        />
        <div className="flex flex-col w-full p-4">
          <div className="flex justify-between w-full mb-4 items-start">
            <div className="flex items-center mb-0 gap-3" onClick={handleMapClick}>
              <img src={googlemap} className='cursor-pointer' alt="" />
              <span className="text_secondary text-lg md:text-xl mb-0 inter_regular cursor-pointer">
                {serviceDetail.address}
              </span>
            </div>
            <h3 className="text_dark mb-0 manrope_bold">
              £ {Number(serviceDetail?.price || 0)}
            </h3>
          </div>
          <div className="flex flex-col">
            <h3 className="manrope_semibold text_black">
              {serviceDetail?.title}
            </h3>
            <h6 className="text_dark manrope_medium">
              {toCapitalized(serviceDetail?.cat?.name)}
            </h6>
          </div>
          <h5 className="manrope_semibold text_dark">
            Service Price:{" "}
            <span className="text_dark manrope_medium">
              {" "}
              £{serviceDetail?.price || 0}
            </span>
          </h5>
          <h5 className="manrope_semibold mb-1 text_dark">Description:</h5>
          <h6 className="manrope_regular text_dark max-md:text-sm">
            {serviceDetail?.description}
          </h6>
          <hr style={{ color: "#EFEFEF" }} />
          <div className="flex flex-col gap-3">
            <h3 className="manrope_semibold text_black">Preview</h3>
            <div className="flex gap-4 flex-wrap w-full">
              {serviceDetail?.images?.map((item, i) => (
                <img
                  key={i}
                  src={item}
                  style={{
                    height: "8rem",
                    width: "10rem",
                    borderRadius: "20px",
                    objectFit: "cover",
                  }}
                  alt=""
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main >
  );
};

export default ServiceDetail;
