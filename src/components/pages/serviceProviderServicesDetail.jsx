/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from "react";
import {
  ArrowLeft,
  Check
} from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";
import { googlemap, service1 } from "../icons/icon";

const ServiceProviderServicesDetail = () => {
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
              navigate(-1);
            }}
            className="flex items-center justify-center p-2 bg_primary rounded-3"
          >
            <ArrowLeft className="text_white" />
          </button>
          <h5 className="manrope_semibold mb-0 text_dark">Service Detail</h5>
        </div>
      </div>
      <div className="bg_white rounded-3 shadow-md overflow-hidden">
        <img
          src={service1}
          style={{ maxHeight: "20rem", width: "100%", objectFit: "cover" }}
          alt=""
        />
        <div className="flex flex-col w-full p-4">
          <div className="flex justify-between w-full mb-4 items-start">
            <div className="flex items-center mb-0 gap-3" onClick={handleMapClick}>
              <img src={googlemap} className='cursor-pointer' alt="" />
              <span className="text_secondary text-lg md:text-xl mb-0 inter_regular cursor-pointer">
                {serviceDetail?.address || '19920 Abbas Street Office'}
              </span>
            </div>
            <h3 className="text_dark mb-0 manrope_bold">
              £ {Number(serviceDetail?.price || 0)}
            </h3>
          </div>
          <div className="flex flex-col">
            <h3 className="manrope_semibold text_black">
              {serviceDetail?.title || 'Deep Cleaning Service'}
            </h3>
            {/* <h6 className="text_dark manrope_medium">
              {(serviceDetail?.cat?.name || "Cleaning")}
            </h6> */}
          </div>
          <h5 className="manrope_semibold text_dark">
            Service Price:{" "}
            <span className="text_dark manrope_medium">
              {" "}
              £{serviceDetail?.price || 0}
            </span>
          </h5>
          <h5 className="manrope_semibold text_dark">Description:</h5>
          <h6 className="manrope_regular text_dark max-md:text-sm">
            {serviceDetail?.description || 'Our Deep Cleaning Service provides an extensive and thorough cleaning of your home or office. We go beyond regular cleaning to ensure every nook and cranny is spotless. Our professional team uses high-quality, eco-friendly products and state-of-the-art equipment to deliver exceptional results.'}
          </h6>
          <hr style={{ color: "#EFEFEF" }} />
          <h5 className="manrope_semibold text_dark">Key Features:</h5>
          <div className="flex flex-col mb-3 gap-2 w-full">
            <div className="flex gap-2 items-center">
              <div className="bg_primary text_white rounded-5 p-1">
                <Check size={14} />
              </div>
              <span className="text_secondary manrope_regular">Comprehensive cleaning of all rooms</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="bg_primary text_white rounded-5 p-1">
                <Check size={14} />
              </div>
              <span className="text_secondary manrope_regular">Comprehensive cleaning of all rooms</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="bg_primary text_white rounded-5 p-1">
                <Check size={14} />
              </div>
              <span className="text_secondary manrope_regular">Comprehensive cleaning of all rooms</span>
            </div>
          </div>
          <h5 className="manrope_semibold text_dark">Main Category:</h5>
          <div style={{ width: 'fit-content' }} className="rounded-5 mb-3 px-5 py-3 border text_primary manrope_medoium">Residential Cleaning</div>
          <h5 className="manrope_semibold text_dark">Sub Category:</h5>
          <div className="flex gap-3 mb-3 items-center flex-wrap w-full">
            <div style={{ width: 'fit-content' }} className="rounded-5 px-5 py-3 border text_primary manrope_medoium">Regular Deep Cleaning</div>
            <div style={{ width: 'fit-content' }} className="rounded-5 px-5 py-3 border text_primary manrope_medoium">Move In/Out Cleaning</div>
            <div style={{ width: 'fit-content' }} className="rounded-5 px-5 py-3 border text_primary manrope_medoium">Post-Construction Cleaning</div>
          </div>
          <h5 className="manrope_semibold text_dark">Availability:</h5>
          <div className="flex flex-col mb-3 gap-2 w-full">
            <div style={{ width: 'fit-content' }} className="bg_light px-3 rounded-3 py-2 flex gap-5 justify-between">
              <h6 style={{ maxWidth: '10rem', width: '100%' }} className="text_primary mb-0 manrope_medium">Monday - Friday</h6>
              <span style={{ whiteSpace: "nowrap" }} className="text_secondary manrope_regular"> 9:00 AM - 5:00 PM</span>
            </div>
            <div style={{ width: 'fit-content' }} className="bg_light px-3 rounded-3 py-2 flex gap-5 justify-between">
              <h6 style={{ maxWidth: '10rem', width: '100%' }} className="text_primary mb-0 manrope_medium">Saturday - Sunday</h6>
              <span style={{ whiteSpace: "nowrap" }} className="text_secondary manrope_regular"> 9:00 AM - 5:00 PM</span>
            </div>
          </div>
          <h5 className="manrope_semibold text_dark">Duration:</h5>
          <div style={{ width: 'fit-content' }} className="bg_light px-3 rounded-3 py-2 flex gap-5 justify-between">
            <h6 className="text_primary mb-0 manrope_medium">Approximately 4 hours for a standard home</h6>
          </div>
          {/* <div className="flex flex-col gap-3">
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
          </div> */}
        </div>
      </div>
    </main >
  );
};

export default ServiceProviderServicesDetail;
