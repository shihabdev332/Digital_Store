import { useEffect, useState } from "react";
import axios from "axios";
import Banner from "./component/Banner";
import Sell from "./component/Sell";
import NewArrival from "./component/NewArrival";
import Container from "./component/Container";

const App = () => {
  const [products, setProducts] = useState([]);

  // .env ফাইল থেকে ব্যাক-এন্ড লিঙ্কটি নেওয়া হচ্ছে
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ব্যাক-এন্ড থেকে ডেটা কল করা
        const response = await axios.get(`${API_URL}/api/products`); 
        setProducts(response.data);
        console.log("Products loaded:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (API_URL) {
      fetchProducts();
    }
  }, [API_URL]);

  return (
    <main>
      <Banner />
      {/* এখানে প্রোডাক্টস ডেটা প্রপস হিসেবে পাঠানো যেতে পারে */}
      <NewArrival products={products} /> 
      <Container className="py-5 md:py-10">
        <Sell />
      </Container>
    </main>
  );
};

export default App;
