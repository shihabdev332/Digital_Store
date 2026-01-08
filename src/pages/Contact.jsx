import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConImg from "../assets/images/contact.png"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required.";
    if (!formData.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Please enter a valid email.";
    if (!formData.message.trim()) errs.message = "Message cannot be empty.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }
    setErrors({});
    console.log("Contact form submitted:", formData);
    toast.success("Your message has been sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden md:flex">
        {/* Left Image Section */}
        <div className="md:w-1/2">
          <img
            src={ConImg}
            alt="Contact us"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form Section */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            Have questions or need help? Fill out the form below and our team
            will get back to you shortly.
          </p>

          {/* Contact Info */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3 text-gray-700">
              <FaPhoneAlt className="text-blue-600" />
              <span>+88 0123 456 789</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <FaEnvelope className="text-blue-600" />
              <span>info@digitalshop.com</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <FaMapMarkerAlt className="text-blue-600" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full py-2 px-3 border rounded-md focus:outline-none ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full py-2 px-3 border rounded-md focus:outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className={`mt-1 block w-full py-2 px-3 border rounded-md focus:outline-none ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Write your message here..."
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
