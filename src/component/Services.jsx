import React from "react";
import { FaTruck, FaHeadset, FaLock } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";

const services = [
  {
    icon: <FaTruck className="text-4xl text-blue-600" />,
    title: "FREE DELIVERY",
    desc: "Free shipping on all order",
  },
  {
    icon: <BiRefresh className="text-4xl text-blue-600" />,
    title: "RETURNS",
    desc: "Back guarantee under 7 days",
  },
  {
    icon: <FaHeadset className="text-4xl text-blue-600" />,
    title: "SUPPORT 24/7",
    desc: "Support online 24 hours a day",
  },
  {
    icon: <FaLock className="text-4xl text-blue-600" />,
    title: "PAYMENTS",
    desc: "100% payment security",
  },
];

const Services = () => {
  return (
    <div className="bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow"
          >
            {service.icon}
            <div>
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
