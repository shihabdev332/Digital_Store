import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/digitalSlice";
import { twMerge } from "tailwind-merge";
import { FaPlus } from "react-icons/fa";
import { TiMinus } from "react-icons/ti";

const AddToCart = ({ item, className }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(item));
    toast.success(`${item?.name} added Successfully`);
  };

  const { products } = useSelector((state) => state.digital);
  const [cartProduct, setCartProduct] = useState(null);

  useEffect(() => {
    const existingProduct = products?.find(
      (product) => product?._id === item?._id
    );
    setCartProduct(existingProduct);
  }, [item, products]);

  const handleIncreaseQuantity = () => {
    dispatch(increaseQuantity(item?._id));
    toast.success(`${item?.name} increased Successfully`);
  };
  const handleDecreaseQuantity = () => {
    dispatch(decreaseQuantity(item?._id));
    toast.success(`${item?.name} decreased Successfully`);
  };

  return (
    <div>
      {cartProduct ? (
        <div className="w-32 h-full flex items-center justify-between font-bold bg-gray-200 rounded-md text-2xl ">
         <button
         disabled={cartProduct?.quantity ===1}
         className="cursor-pointer  text-gray-600 hover:text-black disabled:cursor-not-allowed"
         
         onClick={handleDecreaseQuantity}>
           <TiMinus
          />
         </button>

          <p>{cartProduct?.quantity}</p>
          <FaPlus
            onClick={handleIncreaseQuantity}
            className="text-gray-600 hover:text-black cursor-pointer"
          />
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className={twMerge(
            "bg-black/80 text-white/80 text-sm font-medium py-2 w-full rounded-md mt-2 hover:text-white hover:bg-black  cursor-pointer",
            className
          )}
        >
          Add To Cart
        </button>
      )}
    </div>
  );
};
export default AddToCart;
