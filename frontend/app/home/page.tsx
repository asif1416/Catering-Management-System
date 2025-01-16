"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Carousel from "@/components/Carousel";
import MenuCards from "@/components/MenuCards";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import foodBG from "@/images/foodBG.png";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { carouselImages } from "@/components/imageSources";
import { menuCardImages } from "@/components/imageSources";
import { useAuthStore } from "@/store/auth-store";
import api from "@/api/api";
import debounce from "lodash.debounce";

export default function Home() {
  const { isLoggedIn, login, logout } = useAuthStore();
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  interface Customer {
    name: string;
    image?: string;
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const router = useRouter();


  useEffect(() => {
    async function fetchMenuData() {
      try {
        const response = await api.get("/menu");
        if (!response.data) {
          throw new Error("Failed to fetch menu data");
        }
        setMenuData(response.data);
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
        const response = await api.get("/auth/validate");
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
        const response = await api.get("/customer/");
        setCustomer(response.data);
      } catch (err) {
        console.log("Failed to fetch customer data", err);
      }
    };
    fetchCustomerData();
    checkAuth();
  }, [login, logout]);

  const handleSearch = useCallback(
    debounce(async (searchTerm) => {
      if (searchTerm.length >= 1) {
        try {
          const response = await api.get(`/menu/search?name=${searchTerm}`);
          setSearchResults(response.data);
        } catch (err) {
          console.error("Error searching menu items:", err);
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    []
  );

  return (
    <>
      <Navbar customer={customer} />
      <main>
        <Carousel images={carouselImages} />
        <section className="container mx-auto w-9/12 p-5 bg-white rounded-lg shadow-lg mt-10">
          <div className="flex flex-row justify-between">
            <h2 className="text-secondary text-2xl font-bold">Our meal plans</h2>
            <div>
            <form className="max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
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
              onChange={(e) => handleSearch(e.target.value)}
              required
            />
            {/* <button
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
            </button> */}
          </div>
        </form>
            </div>
          </div>
          <hr className="mt-2 border-primary" />
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <MenuCards cards={searchResults.length > 0 ? searchResults : menuData} images={menuCardImages} />
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
