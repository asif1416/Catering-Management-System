'use client';
import Image from "next/image";
import loginBG from "../../images/loginBg.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/auth/signin");
  }

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

          <form className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Full name
              </label>
              <input
                type="text"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Email address
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
                  placeholder="Enter your password"
                  required
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
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Re-enter Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                  placeholder="Re-enter your password"
                  required
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;