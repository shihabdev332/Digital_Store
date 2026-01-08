import React, { useEffect, useState } from "react";
import Price from "./Price";
import { twMerge } from "tailwind-merge";
import AddToCart from "./AddToCart";
import { useSelector } from "react-redux";

const PriceContainer = ({ item, className, priceStyle }) => {
  const { products } = useSelector((state) => state.digital);
  const [cartProduct, setCartProduct] = useState(null);
  useEffect(() => {
    const existingProduct = products?.find(
      (product) => product?._id === item?._id
    );
    setCartProduct(existingProduct);
  }, [item, products]);

  const discountedPrice = cartProduct
    ? cartProduct?.quantity * item?.price
    : item?.price;


     
  const regularPrice = cartProduct ? item?.price* cartProduct?.quantity + (item?.discountedPercentage * (item?.price*cartProduct?.quantity)) / 100 : item?.price+(item?.discountedPercentage * item?.price) / 100;


  if (!item) return null;
  return (
    <div className={twMerge("flex items-center gap-2", className)}>
      <Price
        className="text-base font-normal text-gray-700 line-through"
        amount={regularPrice}
      />
      <Price amount={discountedPrice} className="text-gray-800 font-semibold" />
    </div>
  );
};

export default PriceContainer;
