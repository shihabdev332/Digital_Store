import React from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
const PreviousArrow = (props) => {
  const {onClick} =props
  return (
    <div className="w-16 h-10 rounded-full text-white bg-black/80 cursor-pointer flex items-center justify-center absolute  hover:bg-black  top-[35%] left-5 z-10"
    onClick={onClick}>
      <FaArrowCircleLeft className="text-2xl"/>
    </div>
  );
};

export default PreviousArrow;
 