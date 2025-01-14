"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {Avatar} from "@nextui-org/react";
import Carousel from ".././components/Carousel";
import MenuCards from "../components/MenuCards";
import Footer from ".././components/Footer";
import logo from "../images/CulinaryOdyssey.jpg";
import foodBG from "../images/foodBG.png";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { carouselImages } from ".././components/imageSources";
import { menuCardImages } from ".././components/imageSources";
import { useAuthStore } from "@/store/auth-store";
import api from "@/api/api";

export default function Home() {
  const { isLoggedIn, login, logout } = useAuthStore();
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  interface Customer {
    name: string;
    image?: string;
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  const handleLogout = async () => {
    try {
      const response = await api.get("http://localhost:3000/auth/logout");
      logout();
    } catch {
      console.log("Failed to logout");
    } finally {
      router.push("/auth/signin");
    }
  };

  useEffect(() => {
    async function fetchMenuData() {
      try {
        const response = await fetch("http://localhost:3000/menu");
        if (!response.ok) {
          throw new Error("Failed to fetch menu data");
        }
        const data = await response.json();
        setMenuData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMenuData();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("http://localhost:3000/auth/validate");
        if (response) {
          login();
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    };
    const fetchCustomerData = async () => {
      try {
        const response = await api.get("http://localhost:3000/customer/");
        setCustomer(response.data);
        //console.table(response.data);
      } catch (err) {
        console.log("Failed to fetch customer data", err);
      }
    };
    fetchCustomerData();
    checkAuth();
  }, [login, logout]);

  return (
    <>
      <header className="p-5">
        <nav className="bg-white border-gray-200">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
            
              <span className="self-center text-2xl font-semibold whitespace-nowrap">
                Welcome to{" "}
                <span className="text-primary">Culinary Odyssey</span>
              </span>
            </a>
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
                <li>
                  <a href="#" className="block py-2 px-3 hover:text-primary">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-3 hover:text-primary">
                    Contact us
                  </a>
                </li>
                <li>
                {isLoggedIn ? (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-4 cursor-pointer" onClick={() => router.push("/customer")}>
                        {customer && (
                          <>
                            <Avatar isBordered color="primary" src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                            <span className="text-primary font-semibold">
                              {customer.name}
                            </span>
                          </>
                        )}
                      </div>
                      <button
                        className="block py-2 px-3 text-white bg-primary rounded hover:bg-primary-500"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      className="block py-2 px-3 text-white bg-primary rounded hover:bg-primary-500"
                      onClick={handleSignIn}
                    >
                      Sign in
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <Carousel images={carouselImages} /> {/* Pass the images as props */}
        <section className="container mx-auto w-9/12 p-5 bg-white rounded-lg shadow-lg mt-10">
          <div className="flex flex-row justify-between">
            <h2 className="text-secondary text-2xl font-bold">
              Our meal plans
            </h2>

            <div>
              <form className="max-w-md mx-auto">
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only"
                >
                  Search
                </label>
                <div className="relative">
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary"
                    placeholder="Search meal plans"
                    required
                  />
                  <button
                    type="submit"
                    className="text-white absolute end-2.5 bottom-2.5 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                  >
                    <svg
                      className="w-4 h-4 text-primary"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
          <hr className="mt-2 border-primary " />
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <MenuCards cards={menuData} images={menuCardImages} />
          )}
        </section>
        <section className="py-16 mt-40 relative">
          <Image
            src={foodBG}
            alt="Food Background"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-white/80" />
          <div className="container mx-auto text-center relative z-10">
            <h2 className="text-3xl font-bold mb-8">
              <span className="text-primary">DOWNLOAD</span>
              <span className="ml-2 text-neutral-600">THE APP</span>
            </h2>
            <div className="flex justify-center gap-4">
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 bg-neutral-600 text-white rounded-lg hover:bg-neutral-500 transition-colors"
              >
                <FaGooglePlay className="mr-2" />
                Get it on Android
              </a>
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 bg-neutral-600 text-white rounded-lg hover:bg-neutral-500 transition-colors"
              >
                <FaApple className="mr-2" />
                Get it on iOS
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
