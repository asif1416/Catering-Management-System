'use client';
import Image from "next/image";
import loginBG from "../../images/loginBg.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";


const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required.")
    .min(4, "Name length must be at least 4 character."),
  email: Yup.string()
    .required("Email is required.")
    .email("Invalid email format.")
    .max(50, "Email must be no more than 50 characters."),
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .max(50, "Password must be no more than 50 characters.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
  confirmPassword: Yup.string()
    .required("Confirm password is required.")
    .oneOf([Yup.ref("password"), ""], "Passwords don't match."),
});

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  const handleSubmit = (values: any) => {
    console.log("Form values:", values);
    
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 relative hidden lg:block">
        <Image 
          src={loginBG} 
          alt="Culinary Odyssey Background"
          className="object-cover"
          fill
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-12">
          <h1 className="text-4xl font-bold text-white text-center">CULINARY ODESSEY</h1>
          <p className="text-white/90 text-center">A Catering management System</p>
        </div>
      </div>

      {/* Left side with form */}
      <div className="w-full lg:w-1/2 flex items-center">
        <div className="w-full max-w-md mx-auto px-6 bg-white shadow-lg border-1 border-gray-300 rounded-lg py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Sign Up</h2>
            <p className="text-gray-600">Let's get you started</p>
          </div>

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-bold text-gray-900">
                    Full name
                  </label>
                  <Field
                    name="name"
                    type="text"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                    placeholder="Enter your name"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-gray-900">
                    Email address
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
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
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 
                        <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500" /> : 
                        <AiOutlineEye className="w-5 h-5 text-gray-500" />
                      }
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-gray-900">
                    Re-enter Password
                  </label>
                  <div className="relative">
                    <Field
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? 
                        <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500" /> : 
                        <AiOutlineEye className="w-5 h-5 text-gray-500" />
                      }
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary hover:bg-primary-500 focus:ring-4 focus:ring-orange-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center mt-6"
                >
                  Sign Up
                </button>

                <div className="text-sm text-center text-gray-600">
                  Already a user?{" "}
                  <a href="#" className="text-primary hover:underline" onClick={handleSignIn}>
                    Sign in
                  </a>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
