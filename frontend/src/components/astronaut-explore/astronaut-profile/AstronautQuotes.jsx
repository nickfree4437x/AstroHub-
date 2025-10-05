// src/components/astronauts/AstronautQuotes.jsx
import React from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AstronautQuotes({ quotes }) {
  if (!quotes || quotes.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-xl p-6 mb-4 shadow-md">
      <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Famous Quotes</h3>
      <ul className="space-y-4">
        {quotes.map((q, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
            className="relative text-gray-200 text-sm md:text-base"
          >
            <FaQuoteLeft className="absolute -left-5 top-0 text-yellow-400" />
            <span className="italic">"{q}"</span>
            <FaQuoteRight className="absolute -right-5 bottom-0 text-yellow-400" />
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
