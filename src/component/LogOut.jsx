import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";

const LogOut = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    try {
      // 1️⃣ Clear user authentication
      localStorage.removeItem("token");

      // Optional: clear other user-related data
      localStorage.removeItem("cart");
      localStorage.removeItem("userInfo");

      // 2️⃣ Show success toast
      toast.success("Logged out successfully!", {
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
        },
        duration: 2000,
      });

      // 3️⃣ Navigate immediately
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <button
      onClick={handleLogOut}
      className="flex items-center justify-center gap-2 px-5 py-2 
                 bg-gradient-to-r from-orange-500 to-orange-600
                 hover:from-orange-600 hover:to-orange-700
                 text-white font-medium rounded-full shadow-md
                 transition-all duration-300 ease-in-out 
                 active:scale-95 cursor-pointer"
    >
      <FiLogOut className="text-lg" />
      Log Out
    </button>
  );
};

export default LogOut;
