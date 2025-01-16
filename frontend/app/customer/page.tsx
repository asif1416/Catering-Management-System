"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import api from "@/api/api";
import { FaEdit } from "react-icons/fa";

const CustomerPage = () => {
  const { isLoggedIn, login, logout } = useAuthStore();
  const [customer, setCustomer] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

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

    const fetchCustomerDetails = async () => {
      try {
        const response = await api.get("/customer");
        const data = response.data;
        setCustomer(data);
        setFormData({
          name: data.name,
          address: data.address || "",
          phone: data.phone || "",
        });
      } catch (err) {
        console.error("Failed to fetch customer data", err);
      }
    };

    checkAuth();
    fetchCustomerDetails();
  }, [login, logout]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async () => {
    try {
      const response = await api.patch(`/customer/${customer.id}`, {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
      });
      if (response.status === 200) {
        setCustomer({ ...customer, ...formData });
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update customer data", err);
    }
  };  

  if (!isLoggedIn) {
    return (
      <div className="text-center p-10">
        <h2 className="text-red-500">Please sign in to view this page.</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar customer={customer} />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Customer Information</h1>
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto relative">
          <button
            className="absolute top-4 right-4 text-primary hover:text-primary-600"
            onClick={handleEditClick}
          >
            
            <span className="flex items-center gap-1"><FaEdit />
            Edit</span>
          </button>

          <div className="flex items-center mb-6">
            <img
              className="w-16 h-16 rounded-full mr-4"
              src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
              alt="Customer Avatar"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{customer.name}</h2>
              <p className="text-gray-600">{customer.email}</p>
            </div>
          </div>
          <hr className="mb-6" />

          {isEditing ? (
            <div className="space-y-4">
              {/* Edit Form */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Address:
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Phone:
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-600"
                  onClick={handleSaveClick}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Display Data */}
              <p>
                <strong className="text-gray-700">Address:</strong>{" "}
                {customer.address || "Not provided"}
              </p>
              <p>
                <strong className="text-gray-700">Phone:</strong>{" "}
                {customer.phone || "Not provided"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CustomerPage;
