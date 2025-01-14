"use client";

import Image from "next/image";
import loginBG from "@/images/loginBg.png";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import EnterEmail from "@/components/EnterEmail";
import EnterOtp from "@/components/EnterOtp";
import ResetPassword from "@/components/ResetPassword";
import api from "@/api/api";
import { useAuthStore } from "@/store/auth-store";

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required.")
    .email("Invalid email format."),
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
});

const SignIn = () => {
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    const { email, password } = values;
    console.log("Form Submitted:", { email, password });
    try {
      const response = await api.post("/auth/login", { email, password });
      toast.success(response.data.message);
      login();
      setEmail(email);
      setIsOtpModalOpen(true);
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setIsEmailModalOpen(true);
  };

  const handleEmailSubmit = async (submittedEmail: string) => {
    try {
      setEmail(submittedEmail);
      setIsEmailModalOpen(false);
      setIsOtpModalOpen(true);
      const response = await api.post("/auth/send-otp", {
        email,
      });
      toast.success(response.data.message || "OTP sent successfully.");
    } catch {
      toast.error("Failed to send OTP");
    }
  };

  const handleOtpSubmit = () => {
    setIsOtpModalOpen(false);
    setIsResetModalOpen(true);
  };

  const handleResetSubmit = () => {
    setIsResetModalOpen(false);
    toast.success("Password reset successfully!");
  };

  return (
    <div className="flex min-h-screen">
      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex items-center">
        <div className="w-full max-w-md mx-auto px-6 bg-white shadow-lg border-1 border-gray-300 rounded-lg py-12">
          <h2 className="text-2xl font-semibold mb-8">Sign In</h2>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-bold text-gray-900">
                    Email
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

                <div>
                  <label className="block mb-2 text-sm font-bold text-gray-900">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500" />
                      ) : (
                        <AiOutlineEye className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary hover:bg-primary-500 focus:ring-4 focus:ring-orange-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center mt-6"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>

                <div className="text-sm text-center text-gray-600">
                  <p className="mb-2">
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={handleForgotPassword}
                    >
                      Forgot your password?
                    </button>
                  </p>
                  <p>
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/auth/signup"
                      className="text-primary hover:underline"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Left side with image */}
      <div className="w-1/2 relative hidden lg:block">
        <Image
          src={loginBG}
          alt="Culinary Odyssey Background"
          className="object-cover"
          fill
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-12">
          <h1 className="text-4xl font-bold text-white text-center">
            CULINARY ODESSEY
          </h1>
          <p className="text-white/90 text-center">
            A Catering management System
          </p>
        </div>
      </div>

      {/* Modals */}
      {isEmailModalOpen && (
        <EnterEmail
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onSubmit={handleEmailSubmit}
        />
      )}

      {isOtpModalOpen && (
        <EnterOtp
          email={email}
          isOpen={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          onSubmit={handleOtpSubmit}
        />
      )}

      {isResetModalOpen && (
        <ResetPassword
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          onSubmit={handleResetSubmit}
          email={email}
        />
      )}
    </div>
  );
};

export default SignIn;
