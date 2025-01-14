import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomModal from "./CustomModal";
import api from "@/api/api";
import toast from "react-hot-toast";

const ResetPassword = ({
  isOpen,
  onClose,
  onSubmit,
  email, 
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  email: string; 
}) => {
  const passwordValidationSchema = Yup.object({
    password: Yup.string()
      .required("Password is required.")
      .min(8, "Password must be at least 8 characters long.")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      }),
    confirmPassword: Yup.string()
      .required("Confirm Password is required.")
      .oneOf([Yup.ref("password")], "Passwords must match."),
  });

  const handleResetPassword = async (password: string, confirmPassword: string) => {
    try {
      const response = await api.post("/auth/reset-password", {
        email,
        password,
        confirmPassword, 
      });
      toast.success(response.data.message || "Password reset successfully!");
      onSubmit();
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to reset the password."
      );
    }
  };
  

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Reset Password">
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={passwordValidationSchema}
        onSubmit={(values) => handleResetPassword(values.password, values.confirmPassword)}
      >
        {() => (
          <Form className="space-y-4 p-4">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                New Password
              </label>
              <Field
                name="password"
                type="password"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                placeholder="Enter new password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Confirm Password
              </label>
              <Field
                name="confirmPassword"
                type="password"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                placeholder="Confirm new password"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-primary hover:bg-primary-500 focus:ring-4 focus:ring-orange-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Reset Password
            </button>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
};

export default ResetPassword;
