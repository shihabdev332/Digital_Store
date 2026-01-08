import React from "react";
import { FaAngleDown } from "react-icons/fa";

const ProductBanner = ({itemsPerPageFormBanner}) => {
  return (
    <div className="flex flex-col md:flex-row w-full justify-between">
      <div>Sorting filter</div>
      <div className="flex items-center gap-2 text-black relative">
        <label htmlFor="itemsPerPage">Show</label>
        <select name="" id="" className="w-16 md:w-20 border-[1px] border-gray-300 py-1 px-4 cursor-pointer text-black/80 text-base block appearance-none focus-within:outline-node focus-visible:border-amber-50"
        onChange={(e)=>itemsPerPageFormBanner(e.target.value)}>
          <option value="8">8</option>
          <option value="16">16</option>
          <option value="24">24</option>
          <option value="32">32</option>
        </select>
        <FaAngleDown  className="absolute ml-24"/>
      </div>
    </div>
  );
};

export default ProductBanner;
