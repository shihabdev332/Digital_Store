import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../../config";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // ১. স্টেটগুলো সবসময় অ্যারে [] দিয়ে শুরু করুন যেন .length এরর না আসে
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  const fetchProducts = async () => {
    if (isFetched && products.length > 0) return;

    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/api/product/list`);
      
      if (response.data?.success) {
        const data = response.data?.products || response.data?.product || [];
        setProducts(data);
        setFilteredProducts(data); // শুরুতে ফিল্টারড লিস্টেও সব ডাটা থাকবে
        setIsFetched(true);
      }
    } catch (error) {
      console.error("Context Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ক্যাটাগরি বা ব্র্যান্ড অনুযায়ী ফিল্টার করার লজিক
  const applyFilter = (category = "All", brand = "All") => {
    let temp = [...products];

    if (category !== "All") {
      temp = temp.filter((p) => p.category === category);
    }
    if (brand !== "All") {
      temp = temp.filter((p) => p.brand === brand);
    }

    setFilteredProducts(temp);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        filteredProducts, // এটি এখন আর undefined হবে না
        loading, 
        fetchProducts, 
        applyFilter 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};