"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import CustomModal from "./CustomModal"; 
import api from "@/api/api";

const EnterOtp = ({
  email,
  isOpen,
  onClose,
  onSubmit,
}: {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
}) => {
  const [resetTime, setResetTime] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Decrease resetTime every second
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResendDisabled && resetTime > 0) {
      timer = setTimeout(() => setResetTime(resetTime - 1), 1000);
    } else if (resetTime === 0) {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resetTime, isResendDisabled]);

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email is missing");
      return;
    }
  
    try {
      setResetTime(60);
      setIsResendDisabled(true);
      const response = await api.post("http://localhost:3000/auth/send-otp", { email });
  
        toast.success(response.data.message || "OTP resent successfully.");
        setResetTime(60);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    }
  };
  

  const otpValidationSchema = Yup.object({
    otp: Yup.string()
      .required("OTP is required.")
      .length(6, "OTP must be exactly 6 digits.")
      .matches(/^\d+$/, "OTP must be numeric."),
  });

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Enter OTP">
      <Formik
      initialValues={{ otp: "" }}
      validationSchema={otpValidationSchema}
      onSubmit={(values) => onSubmit(values.otp)}
    >
      {() => (
        <Form className="space-y-4 p-2">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-900">
              Enter OTP
            </label>
            <Field
              name="otp"
              type="text"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
              placeholder="Enter 6-digit OTP"
            />
            <ErrorMessage
              name="otp"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white bg-primary hover:bg-primary-500 focus:ring-4 focus:ring-orange-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Submit OTP
          </button>

          <div className="text-sm text-center mt-4">
            <button
              type="button"
              className={`font-bold ${
                isResendDisabled
                  ? "text-gray-400"
                  : "text-primary hover:underline"
              }`}
              onClick={handleResendOtp}
              disabled={isResendDisabled}
            >
              {isResendDisabled ? `Resend OTP in ${resetTime}s` : "Resend OTP"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
    </CustomModal>
    
  );
};

export default EnterOtp;
