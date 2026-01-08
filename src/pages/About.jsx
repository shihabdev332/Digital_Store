import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    question: "What is Digital Shop?",
    answer:
      "Digital Shop is an online marketplace that allows customers to buy digital products such as software, games, and online services easily and securely.",
  },
  {
    question: "How does Digital Shop delivery work?",
    answer:
      "Since Digital Shop provides only digital products, there is no physical delivery. You’ll receive your product instantly via email or your user dashboard after payment confirmation.",
  },
  {
    question: "What are the payment methods available?",
    answer:
      "We accept multiple payment options including bKash, Nagad, Rocket, and international debit/credit cards. All transactions are encrypted and secure.",
  },
  {
    question: "Can I request a refund?",
    answer:
      "Refunds are possible only if the purchased digital product is faulty, duplicate, or not as described. Please contact our support within 24 hours for assistance.",
  },
  {
    question: "How can I contact Digital Shop support?",
    answer:
      "You can reach our support team via the Contact page or by emailing support@digitalshop.com. We usually respond within 24 hours.",
  },
  {
    question: "Why is my product not activated?",
    answer:
      "Sometimes digital product activation may take a few minutes depending on server load. Please refresh your dashboard or check your email for the activation key.",
  },
];

const About = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-500">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <button
              className="w-full flex cursor-pointer justify-between items-center p-4 text-left"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-lg font-medium">{faq.question}</span>
              {openIndex === index ? (
                <FaChevronUp className="text-orange-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </button>

            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-600 text-sm md:text-base">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
