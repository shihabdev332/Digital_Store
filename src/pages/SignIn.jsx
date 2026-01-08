import React, { useEffect, useState } from "react";
import Title from "../component/Title";
import Input from "../component/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../config";
import toast from "react-hot-toast";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errPassword, setErrPassword] = useState("");
  const [errEmail, setErrEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  const EmailValidation = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email) setErrEmail("Enter Your Email");
    if (!password) setErrPassword("Enter Password");

    if (email && password && EmailValidation(email)) {
      try {
        setLoading(true);
        const response = await axios.post(`${serverUrl}/api/user/login`, {
          email,
          password,
        });
        const data = response?.data;

        if (data?.success) {
            console.log("Login Data:", data);
          localStorage.setItem("token", data.token);

          // ✅ safe way to store user
          try {
            localStorage.setItem("user", JSON.stringify(data.user));
          } catch (err) {
            console.log("Error saving user to localStorage", err);
          }

          toast.success(data.message);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log("User Login Error", error);
        toast.error("Login failed, please try again!");
      } finally {
        setLoading(false);
      }
    }
  };
  console.log("Saved User:", localStorage.getItem("user"));

  return (
    <div className="w-full flex h-full items-center justify-center">
      <form className="w-full max-w-lg flex items-center justify-center mx-4 border border-gray-300 my-20 rounded-md shadow-sm shadow-orange-400">
        <div className="px-6 py-4 flex flex-col justify-center">
          <Title className="underline underline-offset-4 decoration-[1px] mb-4">
            Sign In
          </Title>
          <div>
            <div className="flex flex-col gap-0.5">
              <label htmlFor="email">Work Email</label>
              <Input
                placeholder="john@gmail.com"
                type="email"
                onChange={handleEmail}
                value={email}
              />
              {errEmail && (
                <p className="font-bold italic text-red-500 mr-1">
                  <span>!</span>
                  {errEmail}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-0.5 mt-3">
              <label htmlFor="password">Your Password</label>
              <Input
                placeholder="Enter Password"
                type="password"
                onChange={handlePassword}
                value={password}
              />
              {errPassword && (
                <p className="font-semibold italic text-red-500 mr-1">
                  <span>!</span>
                  {errPassword}
                </p>
              )}
            </div>
            <div>
              <button
                onClick={handleSignIn}
                disabled={!EmailValidation(email) || !password || loading}
                className="bg-black/80 hover:bg-black text-white hover:text-white cursor-pointer w-full text-base font-medium rounded-md duration-300 ease-in-out mt-3"
              >
                {loading ? "Processing" : "Sign In"}
              </button>
              <p className="text-sm items-center font-semibold ">
                Don't Have an Account?{" "}
                <Link to="/signup">
                  <span className="font-bold cursor-pointer text-blue-500 text-[17px] hover:underline duration-300 ease-in-out">
                    Sign Up
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
