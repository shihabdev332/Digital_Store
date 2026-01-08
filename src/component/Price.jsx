import React from 'react'
import { twMerge } from 'tailwind-merge'

const Price = ({ amount, className }) => {

    const priceAmount = Number(amount).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    });
    

    return (
        <span className={twMerge('text-base font-medium', className)}>
            {priceAmount}
        </span>
    );
}

export default Price;
