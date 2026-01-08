import React, { useEffect, useState } from "react";
import Title from "../component/Title";
import Input from "../component/Input";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios' 
import { serverUrl } from "../../config";

const SignUp = () => {
  //Initial State
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  //error state
  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  //Email Validator
  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleChecked = (e)=>{
    setChecked(e.target.checked)
  }


  const handleName = (e) => {
    setClientName(e.target.value);
    setErrClientName("");
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (checked) {
      if (!clientName) {
        setErrClientName("Enter your name");
      }
      if (!email) {
        setErrEmail("Enter yore Email");
      } else {
        if (!EmailValidation(email)) {
          setErrEmail("Enter A valid Email");
        }
      }
      if (!password) {
        setErrPassword("Enter Your Password");
      }try {
        setLoading(true);
        if(clientName && email && EmailValidation(email) &&password){
          const response = await axios.post(
            `${serverUrl}/api/user/register`,{
              name:clientName,
              email,
              password
            }
          );
          const data= response?.data;
          if(data?.success){
            toast.success(data?.message);
            navigate("/signin")
          }else{
            toast.error(data?.message )
          }
        }
      } catch (error) {
        console.log( 'User Registration failed!', error?.message)
      }
      try {
        setLoading(true);
      } catch (error) {
        console.log(error?.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full flex h-full items-center justify-center">
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-lg flex items-center justify-center mx-4 border border-gray-300 my-20 rounded-md shadow-sm shadow-orange-400"
      >
        <div className="px-6 py-4 flex flex-col justify-center">
          <Title className="underline underline-offset-4 decoration-[1px] mb-4">
            Create your Account
          </Title>
          <div>
            <div className="flex flex-col gap-0.5">
              <label htmlFor="name">Your Full Name</label>
              <Input
                placeholder="Ex: John Doe"
                type="text"
                value={clientName}
                onChange={handleName}
              />
              {errClientName && (
                <p className="font-bold italic text-red-500 mr-1">
                  <span>!</span>
                  {errClientName}
                </p>
              )}
            </div>
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
            <div className="flex items-center md:items-center gap-2">
              <input
                type="checkbox"
                className="cursor-pointer"
                onClick={handleChecked }
              />
              <p className="text-sm ">
                A agree to the Digital
                <span className="text-blue-500">
                  Terms of services
                </span> and{" "}
                <span className="text-blue-500">Privacy Policy</span>
              </p>
            </div>
            <div>
              <button
                disabled={!checked || loading}
                onClick={handleSignUp}
                className="bg-black/80 hover:bg-black text-white hover:text-white cursor-pointer w-full text-base  rounded-md duration-300 ease-in-out mt-3 disabled:bg-gray-300 disabled:cursor-not-allowed h-8"
              >
                {loading ? "Processing..." : "Create Account"}
              </button>
              <p className="text-sm items-center font-semibold ">
                Already Have an Account?{" "}
                <Link to="/signin">
                  <span className="font-bold cursor-pointer text-blue-500 text-[17px] hover:underline hover:text-blue-700 duration-300 ease-in-out">
                    Sign In
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

export default SignUp;
