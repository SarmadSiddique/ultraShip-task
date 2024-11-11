/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import { Form, Input, message } from "antd";
import React, { useState } from "react";
import { } from "react-bootstrap";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import {
  eye,
  eyeoff,
  luxurelogolight,
  recyclebin,
  student
} from "../icons/icon";
// import { apiRequest } from '../../api/auth_api'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (value) => {
    const data = {
      email: value?.email,
      password: value?.password
    };
    setIsProcessing(true);
    await login(data).then((res) => {
      if (res?.status === 200) {
        localStorage.setItem("admin_token", res?.data?.token);
        localStorage.setItem(
          "admin_data",
          JSON.stringify(res?.data?.user)
        );
        localStorage.setItem("isLogin_admin", true);
        navigate("/dashboard");
        message.success("Login Successfully");
        setIsProcessing(false);
      }
    }).catch((err) => {
      if (err.response?.status === 400) {
        message.error('Invalid credentials')
        setIsProcessing(false);
      }
    }).finally(() => {
      setIsProcessing(false);
    })
  };

  return (
    <>
      <div className="w-full h-screen overflow-hidden flex flex-row">
        <div className="d-none bg_primary d-md-flex justify-content-center align-items-center p-5 w-full lg:w-1/2">
          <img className="rounded-full " width="200px" src={student} alt="ImageNotfound" />
        </div>
        <div className="w-full lg:w-1/2 h-full overflow-y-scroll justify-center items-center p-4">
          <div className="flex flex-col items-center justify-center" style={{ minHeight: '90vh' }}>

            <div className="border border-white p-xl-4">
              <h2 className="inter_semibold text-xl mb-0 md:mb-auto md:text-2xl lg:text-3xl text_black">
                Login
              </h2>
              <p className="text_secondary max-md:text-sm inter_regular my-2">
                Login to your account
              </p>
              <Form
                layout="verticle"
                className="flex flex-wrap justify-between"
                onFinish={handleSubmit}
              >
                <Form.Item
                  name="email"
                  className="mb-4 w-full inter_medium"
                  rules={[
                    {
                      type: "email",
                      message: "The Input is not valid E-mail!",
                    },
                    {
                      required: true,
                      message: "Please Input your E-mail!",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Your Email Address...." />
                </Form.Item>
                <Form.Item
                  name="password"
                  className="w-full mb-0 inter_medium"
                  rules={[
                    {
                      min: 6,
                      message: "Please Enter a strong Password",
                      required: true,
                      whitespace: true,
                    },
                  ]}
                  hasFeedback
                >
                  <div className="relative">
                    <div className="flex justify-end">
                      <img
                        src={showPassword ? eye : eyeoff}
                        className="absolute m-2 cursor-pointer"
                        alt="Toggle Password Visibility"
                        onClick={togglePasswordVisibility}
                      />
                      <Input.Password size="large" placeholder="Enter Password...." />
                    </div>
                  </div>
                </Form.Item>
                {/* <button type='button' className="my-[18px] md:my-[24px] text-sm text-[#0E73F6] inter_semibold">Forgot Password?</button> */}
                <div className="w-full my-4">
                  {!isProcessing ? (
                    <button
                      style={{ padding: "12px" }}
                      type="submit"
                      className="w-full rounded-3 bg_primary text_white inter_regular flex justify-center items-center"
                    >
                      Login
                    </button>
                  ) : (
                    <button
                      style={{ padding: "12px" }}
                      type="button"
                      className="w-full rounded-3 bg_primary text_white flex justify-center items-center"
                      disabled
                    >
                      <CircularProgress
                        style={{ color: "white" }}
                        size={24}
                        className="text_white"
                      />
                    </button>
                  )}
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
