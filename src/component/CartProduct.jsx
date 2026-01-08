import React from "react";
import toast from "react-hot-toast";
import { ImCross } from "react-icons/im";
import PriceContainer from "./PriceContainer";
import AddToCart from "./AddToCart";
import Price from "./Price";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../redux/digitalSlice";

const CartProduct = ({ item }) => {
  const dispatch = useDispatch();
  if (!item) return null;

  return (
    <div className="w-full grid grid-cols-5 mb-4 border py-2">
      <div className="flex col-span-5 md:col-span-2 items-center gap-4 ml-4">
        <ImCross
        className="text-red-400 hover:text-red-700 cursor-pointer duration-300 ease-in-out"
          onClick={() => {
            dispatch(deleteProduct(item?._id));
            toast.success(
              `${
                item?.name?.substring(0, 10) || "Product"
              }... deleted successfully!`
            );
          }}
        />

        {item?.images?.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item?.name || "Product Image"}
            className="w-32 h-32 object-cover rounded-md border border-gray-200"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-md text-gray-400">
            No Image
          </div>
        )}

        <h1 className="font-bold">{item?.name}</h1>
      </div>

      <div className="col-span-5 md:col-span-3 flex flex-col md:flex-row md:items-center items-center justify-between p-4">
        <div className="flex w-1/3 items-center">
          <PriceContainer item={item} />
        </div>
        <div className="w-1/3 flex items-center gap-6 text-lg">
          <AddToCart item={item} />
        </div>
        <div className="w-1/3 flex items-center gap-6 text-lg">
          <Price amount={item?.price * item?.quantity} />
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
