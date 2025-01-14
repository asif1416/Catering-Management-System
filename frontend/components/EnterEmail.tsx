"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomModal from "./CustomModal"; 

const EnterEmail = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}) => {
  const emailValidationSchema = Yup.object({
    email: Yup.string()
      .required("Email is required.")
      .email("Invalid email format."),
  });

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Enter Email">
      <Formik
        initialValues={{ email: "" }}
        validationSchema={emailValidationSchema}
        onSubmit={(values) => onSubmit(values.email)}
      >
        {() => (
          <Form className="space-y-4 p-4">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Enter Email
              </label>
              <Field
                name="email"
                type="email"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                placeholder="Enter your email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-primary hover:bg-primary-500 focus:ring-4 focus:ring-orange-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Send OTP
            </button>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
};

export default EnterEmail;
