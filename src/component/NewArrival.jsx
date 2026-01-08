import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { serverUrl } from "../../config";
import Slider from "react-slick";
import Title from "./Title.jsx";
import Product from "./Product.jsx";
import PreviousArrow from "./PreviousArrow copy.jsx";
import NextArrow from "./NextArrow.jsx";

const NewArrival = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  //  Track dragging state globally for slider
  const isDragging = useRef(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //  Dynamic slides per screen
  const slidesToShow =
    windowWidth <= 480 ? 1 : windowWidth <= 769 ? 2 : windowWidth <= 1025 ? 3 : 4;

  //  Slider settings
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PreviousArrow />,
    beforeChange: () => {
      isDragging.current = true; 
    },
    afterChange: () => {
      setTimeout(() => {
        isDragging.current = false; 
      }, 100);
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(serverUrl + "/api/product/list");
        const data = response?.data;

        if (data?.success) {
          setProducts(data?.product);
          setTotal(data?.total);
        } else {
          console.log("Products fetching error");
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //  Block product click if dragging
  const handleProductClick = (e) => {
    if (isDragging.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div className="w-full py-10">
      <Title>New Arrival</Title>

      {products?.length > 0 ? (
        <Slider key={slidesToShow} {...settings}>
          {products.map((item) => (
            <div key={item._id} onClick={handleProductClick}>
              <Product item={item} />
            </div>
          ))}
        </Slider>
      ) : (
        <div className="w-full h-80 flex items-center gap-5 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-full bg-zinc-400 animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrival;
