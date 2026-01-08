import React from 'react';
import { Link } from 'react-router-dom';
import Price from './Price'; 
import { FaArrowRightLong } from "react-icons/fa6";

const ProductItem = ({ id, images, name, price }) => {
  return (
    <Link 
      to={`/product/${id}`} 
      className='group relative bg-white p-2 md:p-4 rounded-[2rem] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col cursor-pointer'
    >
      {/* ইমেজ সেকশন */}
      <div className='relative overflow-hidden rounded-[1.5rem] bg-[#f9f9f9] aspect-square flex items-center justify-center'>
        {images && images.length > 0 ? (
          <>
            <img 
              className='w-[85%] h-[85%] object-contain group-hover:scale-105 transition-all duration-700 ease-in-out group-hover:opacity-0' 
              src={images[0]} 
              alt={name} 
            />
            {/* সেকেন্ড ইমেজ হোভার ইফেক্ট */}
            {images && images.length > 1 && (
              <img 
                className='absolute inset-0 w-[85%] h-[85%] m-auto object-contain opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-in-out' 
                src={images[1]} 
                alt={name} 
              />
            )}
          </>
        ) : (
          <div className='text-gray-300 text-[10px] font-black uppercase tracking-widest'>No Image</div>
        )}

        {/* প্রিমিয়াম হোভার লেয়ার */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* টেক্সট সেকশন */}
      <div className='mt-4 px-2 pb-2'>
        <div className="flex flex-col gap-1">
          <p className='text-[10px] font-black text-orange-500 uppercase tracking-[0.15em] opacity-80'>Digital Asset</p>
          <p className='text-sm md:text-base font-bold text-zinc-800 line-clamp-1 group-hover:text-black transition-colors'>
            {name}
          </p>
        </div>

        <div className='mt-4 flex items-center justify-between border-t border-gray-50 pt-4'>
          <div className='flex flex-col'>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Price</span>
            <p className='text-base font-black text-zinc-900'>
              <Price amount={price} />
            </p>
          </div>
          
          {/* স্টাইলিশ ডিটেইলস বাটন */}
          <div className='w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500'>
            <FaArrowRightLong className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;