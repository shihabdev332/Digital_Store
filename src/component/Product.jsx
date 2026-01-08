import React from "react";
import Badge from "./Badge";
import PriceContainer from "./PriceContainer";
import AddToCart from "./AddToCart";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";


const Product = ({ item, className }) => {
  return (
    <div className={twMerge("w-full group pr-2.5", className)}>
      <div className="h-64 border border-gray-400 rounded-tr-md rounded-tl-md overflow-hidden relative">
        <Link
          to={`/product/${item?._id}`}
          className="w-full h-full overflow-hidden bg-gray-300 "
        >
          <img
            src={item?.images[0]}
            alt="productImages"
            className="w-full h-full hover:scale-125 duration-300 object-cover cursor-pointer"
          />
        </Link>
        <div className="absolute top-2 right-2 ">
          {!item?.offer && <Badge title="sale" className="rounded-sm" />}
        </div>
      </div>
      <div className="w-full py-6 flex flex-col mb-2 gap-1 border-[1px] border-t-0 border-gray-300 px-5 rounded-md">
        <p>{item?.name}</p>
        <PriceContainer item={item} />
        <AddToCart item={item} />
      </div>
    </div>
  );
};

export default Product;
