import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../../config";
import axios from "axios";
import ProductInfo from "../component/ProductInfo";

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${serverUrl}/api/product/single?_id=${id}`);
        const data = response?.data;

        if (data?.success) {
          setProduct(data.product);
          setMainImage(data.product.images[0]); // default big image
        } else {
          console.log("Products fetching error", data?.message);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!product) return <div className="text-center mt-10">Product not found</div>;

  return (
    <div className="container mx-auto p-4">
      {/* LG: 3 columns, MD: 2 columns, Mobile: 1 column */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Column 1: Big image */}
        <div className="flex justify-center">
          <img
            src={mainImage}
            alt={product.name}
            className="w-[350px] md:w-[500px] lg:w-[780px] h-[330px] md:h-[450px] lg:h-[550px] object-cover rounded-md transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer"
          />
        </div>

        {/* Column 2: Thumbnails */}
        <div className="flex md:flex-col gap-2 justify-center">
          {product.images.slice(0, 3).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`thumbnail-${index}`}
              className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 transition-all ${
                mainImage === img ? "border-orange-500 scale-105" : "border-gray-300"
              }`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>

        {/* Column 3: Product description + Add to Cart */}
        <div>
          <ProductInfo product={product} />
        </div>

      </div>
    </div>
  );
};

export default SingleProduct;
