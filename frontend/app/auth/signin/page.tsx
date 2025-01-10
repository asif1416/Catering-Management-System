'use client';
import Image from "next/image";
import loginBG from "../../images/loginBg.png";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = (event: { preventDefault: () => void; }) => {
    event.preventDefault(); 

    router.push("/dashboard");
  };

  const handleSignUp = () => {
    router.push("/auth/signup");
  };

  return (
    <div className="flex min-h-screen">
      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex items-center">
        <div className="w-full max-w-md mx-auto px-6 bg-white shadow-lg border-1 border-gray-300 rounded-lg py-12">
          <h2 className="text-2xl font-semibold mb-8">Sign In</h2>

          <form className="space-y-4" onSubmit={handleSignIn}>
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Email
              </label>
              <input
                type="email"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                  placeholder="Enter password"
                  required
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
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-primary"
                id="terms"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to Terms & Conditions and Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-primary hover:bg-primary-500 focus:ring-4 focus:ring-orange-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center mt-6"
            >
              Sign In
            </button>

            <div className="text-sm text-center text-gray-600">
              <p className="mb-2">
                <Link
                  href="/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot your password?
                </Link>
              </p>
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="text-primary hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

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
    </div>
  );
};

export default SignIn;
