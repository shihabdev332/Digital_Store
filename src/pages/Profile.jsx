import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../component/Title";
import LogOut from "../component/LogOut";

const Profile = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
 
    if (!token) {
      navigate("/signIn");
    }
  }, [token, navigate]);

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <Title>Profile</Title>
      <p className="mt-2 text-gray-500">Welcome to your profile dashboard!</p>
      <div className="mt-6">
        <LogOut />
      </div>
    </div>
  );
};

export default Profile;
