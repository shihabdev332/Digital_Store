import React from "react";
import { FaArrowCircleRight } from "react-icons/fa";
const NextArrow = (props) => {
  const {onClick} =props
  return (
    <div className="w-16 h-10 rounded-full text-white bg-black/80 cursor-pointer flex items-center justify-center absolute  hover:bg-black  top-[35%] right-2 z-10"
    
    onClick={onClick}>
    <FaArrowCircleRight className="text-2xl"/>
    </div>
  );
};

export default NextArrow;
