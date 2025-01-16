"use client";
import { Avatar, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import api from "@/api/api";

const Navbar = ({
  customer,
}: {
  customer: { name: string; image?: string } | null;
}) => {
  const { logout, isLoggedIn } = useAuthStore();
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  const handleLogout = async () => {
    try {
      const response = await api.get("/auth/logout");
      logout();
    } catch {
      console.log("Failed to logout");
    } finally {
      router.push("/auth/signin");
    }
  };

  return (
    <header className="p-5">
      <nav className="bg-white border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/home" className="block py-2 px-3">
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              Welcome to <span className="text-primary">Culinary Odyssey</span>
            </span>
          </Link>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
              <li>
                  <Link
                    href="/home"
                    className="block py-2 px-3 text-gray-800 hover:text-primary"
                  >
                    Home
                  </Link>
              </li>
              <li>
                  <Link
                    href="/home"
                    className="block py-2 px-3 text-gray-800 hover:text-primary"
                  >
                    Contact Us
                  </Link>
              </li>
              <li>
                {isLoggedIn ? (
                  <div className="flex items-center space-x-4">
                    <Link href="/customer">
                      <div className="flex items-center space-x-4 cursor-pointer">
                        {customer && (
                          <>
                            <Avatar
                              isBordered
                              color="primary"
                              src={
                                customer.image ||
                                "https://i.pravatar.cc/150?u=a04258a2462d826712d"
                              }
                            />
                            <span className="text-primary font-semibold">
                              {customer.name}
                            </span>
                          </>
                        )}
                      </div>
                    </Link>
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
  );
};

export default Navbar;
