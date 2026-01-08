import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import Product from "./Product";

function Items({ currentItems }) {
  return (
    <>
      {currentItems &&
        currentItems?.map((item) => (
          <Product key={item?._id} item={item} className="w-full" />
        ))}
    </>
  );
}

const Pagination = ({ itemsPerPage, products }) => {
  const [itemOffset, setItemOffset] = useState(0);
  const [itemStart, setItemStart] = useState(1);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
    setItemStart(newOffset);
  };
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-5 lg:gap-10">
        <Items currentItems={currentItems} />
      </div>
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
        <ReactPaginate
          nextAriaLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-9 h-9 border-[1px] border-gray-300 hover:border-black duration-300 flex items-center justify-center cursor-pointer"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold"
        />
          <p className="font-medium">
            <span className="text-xl font-bold">Products from </span>{itemsPerPage === 0 ? 1 : itemStart} to {endOffset} of
            {""} <span className="font-bold text-2xl">{products?.length}</span>
          </p>
       
      </div>
    </div>
  );
};

export default Pagination;
 