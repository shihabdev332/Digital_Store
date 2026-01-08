import React from "react";
import Apple from "../assets/images/apple1.png";
import { Link } from "react-router-dom";
import Banner1 from "../assets/images/banner5.jpg";
import Banner2 from "../assets/images/banner4.jpg";
const Sell = () => {
  return (
    <div className="w-full h-auto md:h-[550px] flex flex-col md:flex-row items-center justify-between gap-10">
      <div className="w-full md:w-1/2 h-[250px] md:h-full border border-gray-300 rounded-md overflow-hidden relative group">
        <img
          src={Apple}
          alt="apple"
          className="w-full h-full object-cover group-hover:scale-110 duration-500 ease-in-out"
        />

        <div className="absolute w-full h-full top-0 left-0 bg-black/40 text-white/80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm md:text-lg font-medium text-white">
              10% sales ongoing on phone
            </p>
            <p className="text-sm md:text-lg font-medium text-white">
              Offers on limited Time
            </p>
            <Link
              to="/shop"
              className="bg-white/70 text-black px-8 py-3 rounded-md hover:bg-white duration:300 font-medium "
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-full flex flex-col justify-between gap-10 md:gap-0 ">
        <div className="w-full h-[250px] md:h-[46%] border border-gray-300 rounded-md overflow-hidden relative group">
          <img
            src={Banner1}
            alt="image"
            className="w-full h-full object-cover group-hover:scale-110 duration-500 ease-in-out"
          />

          <div className="absolute w-full h-full top-0 left-0 bg-black/40 text-white/80 flex items-center">
            <div className="flex flex-col items-center gap-2 p-10">
              <p className="text-sm md:text-lg font-medium text-white">
                10% sales ongoing on phone
              </p>
              <p className="text-sm md:text-lg font-medium text-white">
                Offers on limited Time
              </p>
              <Link
                to="/shop"
                className="bg-white/70 text-black px-8 py-3 rounded-md hover:bg-white duration:300 font-medium "
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
        <div>
          <div className="w-full h-[250px] border border-gray-300 rounded-md overflow-hidden relative group">
            <img
              src={Banner2}
              alt="image"
              className="w-full h-full object-cover group-hover:scale-110 duration-500 ease-in-out"
            />

            <div className="absolute w-full h-full top-0 left-0 bg-black/40 text-white/80 flex items-center">
              <div className="flex flex-col items-center gap-2 p-10 ">
                <p className="text-sm md:text-lg font-medium text-white">
                  10% sales ongoing on phone
                </p>
                <p className="text-sm md:text-lg font-medium text-white">
                  Offers on limited Time
                </p>
                <Link
                  to="/shop"
                  className="bg-white/70 text-black px-8 py-3 rounded-md hover:bg-white duration:300 font-medium "
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sell;
