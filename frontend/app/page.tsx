import Image from "next/image";
import Carousel from "./components/Carousel";
import FoodCards from "./components/FoodCards";
import Footer from "./components/Footer";
import logo from "./images/CulinaryOdyssey.jpg";
import bg1 from "./images/bg1.png";
import bg2 from "./images/bg2.jpg";
import bg3 from "./images/bg3.jpg";
import foodBG from "./images/foodBG.png";
import { FaGooglePlay, FaApple } from "react-icons/fa";

const carouselImages = [
  { src: bg1, alt: "Culinary Image 1" },
  { src: bg2, alt: "Culinary Image 2" },
  { src: bg3, alt: "Culinary Image 3" },
];

async function getMenuData() {
  const res = await fetch('http://localhost:3000/menu');
  if (!res.ok) {
    throw new Error('Failed to fetch menu data');
  }
  return res.json();
}

export default async function Home() {
  const menuData = await getMenuData();

  return (
    <>
      <header className="p-5">
        <nav className="bg-white border-gray-200">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <Image
                src={logo}
                alt="Culinary Odyssey Logo"
                width={60}
                height={60}
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap">
                Welcome to{" "}
                <span className="text-primary">Culinary Odyssey</span>
              </span>
            </a>
            <button
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
                <li>
                  <a
                    href="#"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
                    aria-current="page"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
                  >
                    Contact us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
                  >
                    Sign in
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <Carousel images={carouselImages} />
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
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
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
          <FoodCards cards={menuData} />
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

