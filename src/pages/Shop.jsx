import React, { useState } from "react";

import Title from "../component/Title";
import PaginationProductList from "../component/PaginationProductList";


const Shop = () => {
  const [products, setProducts] = useState([]);

  return (
    <div>
      <Title>Available Products on Sale</Title>
      <div className="m-5 flex gap-10">
        <PaginationProductList products={products} />
      </div>
    </div>
  );
};

export default Shop;
