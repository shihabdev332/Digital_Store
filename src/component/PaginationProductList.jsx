import React, { useState, useEffect } from "react";
import { serverUrl } from "../../config";
import axios from "axios";
import ProductBanner from "./ProductBanner";
import Pagination from "./Pagination";

const PaginationProductList = () => {
    const [products, setProducts] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);


  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get(serverUrl + "/api/product/list");
        const data = response?.data;

        if (data?.success) {
          setProducts(data?.product);
          setTotal(data?.total);
        } else {
          console.log("Products fetching error", data?.message);
        }
      };
      fetchData();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, []);
  console.log("value", itemsPerPage)

  const itemsPerPageFormBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };
  return (
    <div className="w-full flex flex-col gap-5">
      <ProductBanner itemsPerPageFormBanner={itemsPerPageFormBanner}/>
      <Pagination itemsPerPage={itemsPerPage} products={products}/>
    </div>
  );
};

export default PaginationProductList;
