import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Product from "./Product"; // আপনার product component
import SearchInput from "./SearchInput";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([]);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/search?query=${encodeURIComponent(query)}`
        );
        if (res.data.success) {
          setProducts(res.data.product);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="p-4">
      
      <h2 className="text-xl font-semibold my-4">
        {query ? `Search results for "${query}"` : "Search Products"}
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <Product key={p._id} item={p} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  );
};

export default SearchPage;
