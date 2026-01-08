import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Title from "../component/Title";
import EmptyCart from "../assets/images/empty.jpg";
import { Link } from "react-router-dom";
import CartProduct from "../component/CartProduct";
import { resetCart } from "../redux/digitalSlice";
import Price from "../component/Price";
import toast from "react-hot-toast";
import axios from "axios";
import { serverUrl } from "../../config";

const Cart = () => {
  const { products } = useSelector((state) => state.digital);
  const dispatch = useDispatch();

  const [subtotal, setSubtotal] = useState(0);    // subtotal = original + discount
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);  // actual payable price

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Delivery address
  const [address, setAddress] = useState({
    district: "",
    thana: "",
    upazila: "",
    road: "",
    houseNumber: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // Load user and token
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // Checkout
  const handleCheckOut = async () => {
    if (!user || !token) {
      toast.error("Please login first to checkout!");
      return;
    }

    if (
      !address.district ||
      !address.thana ||
      !address.upazila ||
      !address.road ||
      !address.houseNumber
    ) {
      toast.error("Please fill out all delivery address fields!");
      return;
    }

    try {
      const response = await axios.post(
        `${serverUrl}/api/order/create`,
        {
          userId: user._id,
          products: products.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          totalAmount: cartTotal, // final payable
          address: `${address.houseNumber}, ${address.road}, ${address.upazila}, ${address.thana}, ${address.district}`,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(resetCart());
      }
    } catch (error) {
      console.log("Checkout Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Order creation failed!");
    }
  };

  // Totals calculation with business trick
  useEffect(() => {
    let sub = 0;   // subtotal = original + discount
    let discount = 0;
    let total = 0; // actual payable

    products?.forEach((item) => {
      const qty = item.quantity || 1;
      const originalPrice = item.price * qty;
      const discountAmount = ((item.discountedPercentage || 0) * originalPrice) / 100;
      const finalPrice = originalPrice; // customer actually pays original price

      sub += originalPrice + discountAmount; // subtotal shown to customer
      discount += discountAmount;
      total += finalPrice; // actual payable
    });

    setSubtotal(sub);
    setTotalDiscount(discount);
    setCartTotal(total);
  }, [products]);

  const handleReset = () => {
    if (window.confirm("Are you sure to reset your cart?")) {
      dispatch(resetCart());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-10 lg:px-20">
      <Title className="py-10 text-2xl font-bold text-amber-950 underline">
        My Cart
      </Title>

      {products?.length > 0 ? (
        <div className="w-full">
          {/* Cart Table Header */}
          <div className="hidden lg:grid grid-cols-5 w-full h-16 bg-gray-100 text-black px-6 text-lg font-semibold items-center rounded-t-xl">
            <h2 className="col-span-2">Product</h2>
            <h2>Price</h2>
            <h2>Quantity</h2>
            <h2>Subtotal</h2>
          </div>

          {/* Cart Products */}
          <div className="flex flex-col mt-5 gap-4">
            {products.map((item, index) => (
              <CartProduct key={item._id || index} item={item} />
            ))}
          </div>

          {/* Reset Button */}
          <div className="flex justify-center mt-5 gap-20">
            <button
              onClick={handleReset}
              className="py-2 px-10 bg-red-500 text-white font-semibold uppercase hover:bg-red-700 transition-colors duration-200 rounded-md cursor-pointer"
            >
              Reset Cart
            </button> 
            <Link
            to={"/shop"}
              
              className="py-2 px-10 bg-blue-500 text-white font-semibold uppercase hover:bg-blue-700 transition-colors duration-200 rounded-md"
            >
              More Shopping...
            </Link>
          </div>

          {/* Delivery + Totals */}
          <div className="flex justify-center mt-6">
            <div className="w-full md:w-[600px] flex flex-col border border-gray-300 rounded-md p-4 bg-white shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-center">Delivery Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="District"
                  value={address.district}
                  onChange={(e) => setAddress({ ...address, district: e.target.value })}
                  className="border border-gray-300 rounded-md p-2"
                />
                <input
                  type="text"
                  placeholder="Thana"
                  value={address.thana}
                  onChange={(e) => setAddress({ ...address, thana: e.target.value })}
                  className="border border-gray-300 rounded-md p-2"
                />
                <input
                  type="text"
                  placeholder="Upazila"
                  value={address.upazila}
                  onChange={(e) => setAddress({ ...address, upazila: e.target.value })}
                  className="border border-gray-300 rounded-md p-2"
                />
                <input
                  type="text"
                  placeholder="Road"
                  value={address.road}
                  onChange={(e) => setAddress({ ...address, road: e.target.value })}
                  className="border border-gray-300 rounded-md p-2"
                />
                <input
                  type="text"
                  placeholder="House Number"
                  value={address.houseNumber}
                  onChange={(e) => setAddress({ ...address, houseNumber: e.target.value })}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="mt-4">
                <label className="font-bold ">Payment Method:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full mt-1 cursor-pointer"
                >
                  <option value="Cash on Delivery"  className="font-bold cursor-pointer ">Cash on Delivery</option>
                  <option value="Online Payment (coming soon)">Online Payment (Coming Soon)</option>
                </select>
              </div>

              <h2 className="text-xl font-bold mt-6 mb-2 text-center">Cart Totals</h2>
              <div className="flex justify-between py-1 font-semibold border-b border-gray-200">
                <span>Subtotal:</span>
                <Price amount={subtotal} />
              </div>
              <div className="flex justify-between py-1 font-semibold border-b border-gray-200">
                <span>Discount:</span>
                <Price amount={totalDiscount} />
              </div>
              <div className="flex justify-between py-1 font-bold text-lg">
                <span>Total:</span>
                <Price amount={cartTotal} />
              </div>

              <button
                onClick={handleCheckOut}
                className="mt-5 w-full h-12 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md transition-colors duration-200 cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10 text-center">
          <img src={EmptyCart} alt="Empty Cart" className="max-w-xs md:max-w-sm" />
          <h2 className="text-xl mt-5 font-bold uppercase">Your Cart feels lonely</h2>
          <p className="text-gray-500 text-sm max-w-md mt-2">
            Your shopping cart lives to serve. Fill it with books, electronics, gadgets, and more!
          </p>
          <Link
            to="/shop"
            className="mt-6 px-6 py-2 bg-amber-500 hover:bg-amber-700 text-white font-bold rounded-md transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
