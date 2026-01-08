import React, { useState } from "react";
import { IoStar } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../../config";
import toast from "react-hot-toast";

const StarRating = ({ productId, userId, userName }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    // ভ্যালিডেশন
    if (rating === 0) return toast.error("দয়া করে একটি রেটিং দিন");
    if (!comment.trim()) return toast.error("আপনার মন্তব্য লিখুন");

    try {
      setLoading(true);
      const response = await axios.post(`${serverUrl}/api/product/add-review`, {
        productId,
        userId,
        userName,
        rating,
        comment,
      });

      if (response.data.success) {
        toast.success("রিভিউ সফলভাবে যোগ করা হয়েছে! ⭐");
        setRating(0);
        setComment("");
        // রিভিউ দেওয়ার পর ডাটা আপডেট করার জন্য পেজ রিলোড বা স্টেট ম্যানেজমেন্ট করা ভালো
        setTimeout(() => window.location.reload(), 1500); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Review Error", error);
      toast.error("রিভিউ সাবমিট করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-xl bg-gray-50 mt-8 shadow-sm">
      <h3 className="font-bold mb-4 text-zinc-800 text-lg">Write a Review</h3>
      
      {/* স্টার সিলেকশন সেকশন */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <IoStar
            key={star}
            className={`cursor-pointer text-3xl transition-all duration-200 ${
              star <= (hover || rating) ? "text-yellow-400 scale-110" : "text-gray-300"
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          />
        ))}
      </div>

      {/* কমেন্ট বক্স */}
      <textarea
        value={comment}
        className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-black transition-colors text-zinc-700 bg-white"
        placeholder="How was your experience with this product?"
        rows="4"
        onChange={(e) => setComment(e.target.value)}
      />

      {/* সাবমিট বাটন */}
      <button
        disabled={loading}
        onClick={submitReview}
        className={`mt-4 w-full md:w-auto px-10 py-3 rounded-lg font-bold transition-all ${
          loading 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-black text-white hover:bg-zinc-800 active:scale-95 shadow-lg"
        }`}
      >
        {loading ? "Submitting..." : "Post Review"}
      </button>
    </div>
  );
};

export default StarRating;