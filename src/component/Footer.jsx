import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaYoutube, FaLinkedin, FaFacebook, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    alert("Subscribed successfully with: " + email);
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-10 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">More about Digital Shop</h3>
          <p className="text-sm mb-4">
            Welcome to Digital Shop, your online store for mobile phones, tablets, laptops, and electronics. We offer quality devices at competitive prices, fast delivery, and a seamless shopping experience, making it easy to stay connected and up-to-date with technology.
          </p>
          <div className="flex space-x-4">
            <Link to="#"><FaGithub size={22} /></Link>
            <Link to="#"><FaYoutube size={22} /></Link>
            <Link to="#"><FaLinkedin size={22} /></Link>
            <Link to="#"><FaFacebook size={22} /></Link>
            <Link to="#"><FaEnvelope size={22} /></Link>
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/accessories">Accessories</Link></li>
            <li><Link to="/shop">Clothes</Link></li>
            <li><Link to="/shop">Electronics</Link></li>
            <li><Link to="/shop">Home appliances</Link></li>
            <li><Link to="/shop">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Account Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Your account</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/address">Addresses</Link></li>
            <li><Link to="/profile">Account Details</Link></li>
            <li><Link to="/shop">Privacy</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Subscribe to our newsletter</h3>
          <p className="text-sm mb-4">
            Stay updated with our latest offers and products.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Insert your email ..."
              className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none text-sm"
            />
            {error && <span className="text-red-500 text-xs">{error}</span>}
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
            >
              Subscribe
            </button>
          </form>

          {/* Payment icons */}
          <div className="flex space-x-4 mt-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" className="h-5" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
