import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "./ProductContext";
import Product from "./Product";
import Title from "./Title";

const RecommendedProduct = () => {
  const { products, loading } = useContext(ProductContext);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      // ✅ ডাটা থেকে ৮টি র‍্যান্ডম প্রোডাক্ট ফিল্টার করা
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setRecommended(shuffled.slice(0, 8));
    }
  }, [products]);

  return (
    <div className="w-full pb-20">
      <Title>Recommended for You</Title>
      
      {loading ? (
        // Loading Skeleton
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-full h-80 bg-zinc-200 animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {recommended.map((item) => (
            <Product key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedProduct;