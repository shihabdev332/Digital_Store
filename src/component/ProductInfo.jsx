import React from "react";
import Title from "./Title";
import PriceContainer from "./PriceContainer";
import AddToCart from "./AddToCart";
const ProductInfo = ({ product }) => {
  return (
    <div className="flex justify-center flex-col gap-5">
      <Title className="text-4xl">{product?.name}</Title>
      <PriceContainer item={product} priceStyle="text-xl" />
      <p className="text-base text-gray-600">{product?.description}</p>
      <p className="text-sm font-semibold ">Be The first to leave a review</p>
      <div>
        <p className="text-base font-semibold">
          <span className="text-orange-300 font-normal mr-1">Category:</span>
          {product?.category}
        </p>
        <p className="text-base font-semibold">
          <span className="text-orange-300 font-normal mr-1">Brand:</span>
          {product?.brand}
        </p>
      </div>
      <AddToCart item={product} />
    </div>
  );
};

export default ProductInfo;
