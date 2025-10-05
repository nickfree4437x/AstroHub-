// src/components/compare/FunFactTooltip.jsx
import React, { useState } from "react";
import { 
  FaInfoCircle, 
  FaLightbulb, 
  FaRocket, 
  FaStar,
  FaTimes
} from "react-icons/fa";

export default function FunFactTooltip({ text, type = "info" }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const getTooltipIcon = () => {
    switch (type) {
      case "science":
        return <FaRocket className="text-purple-400" />;
      case "discovery":
        return <FaStar className="text-yellow-400" />;
      case "fun":
        return <FaLightbulb className="text-green-400" />;
      default:
        return <FaInfoCircle className="text-blue-400" />;
    }
  };

  const getTooltipColor = () => {
    switch (type) {
      case "science":
        return "from-purple-500/10 to-purple-600/10 border-purple-500/20";
      case "discovery":
        return "from-yellow-500/10 to-amber-600/10 border-yellow-500/20";
      case "fun":
        return "from-green-500/10 to-emerald-600/10 border-green-500/20";
      default:
        return "from-blue-500/10 to-cyan-600/10 border-blue-500/20";
    }
  };

  const handleMouseEnter = (e) => {
    const rect = e.target.getBoundingClientRect();
    setPosition({
      x: rect.left,
      y: rect.top
    });
    setShow(true);
  };

  const handleMouseMove = (e) => {
    if (show) {
      const rect = e.target.getBoundingClientRect();
      setPosition({
        x: rect.left,
        y: rect.top
      });
    }
  };

  return (
    <span 
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShow(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Trigger Button */}
      <button
        className={`
          relative p-1.5 rounded-full transition-all duration-300 group
          hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/50
          ${show ? 'scale-110 text-white' : 'text-gray-400 hover:text-gray-200'}
        `}
        aria-label="Show fun fact"
      >
        {/* Animated Background */}
        <div className={`
          absolute inset-0 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300
          ${getTooltipColor().replace('10', '30').replace('20', '40')}
        `}></div>
        
        {/* Icon */}
        <div className="relative z-10">
          {getTooltipIcon()}
        </div>

        {/* Pulse Animation */}
        {show && (
          <div className="absolute inset-0 rounded-full bg-current animate-ping opacity-20"></div>
        )}
      </button>

      {/* Tooltip */}
      {show && (
        <div 
          className={`
            fixed z-50 max-w-xs p-4 rounded-xl backdrop-blur-sm border-2 shadow-2xl
            transform transition-all duration-300 animate-tooltipEnter
            ${getTooltipColor()}
          `}
          style={{
            left: `${position.x}px`,
            top: `${position.y - 10}px`,
            transform: 'translateY(-100%)'
          }}
        >
          {/* Tooltip Arrow */}
          <div 
            className={`
              absolute left-3 top-full w-4 h-4 transform rotate-45 border-r-2 border-b-2
              ${getTooltipColor().split(' ').find(c => c.includes('border-'))}
            `}
          ></div>

          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getTooltipIcon()}
              <span className="text-sm font-semibold text-white capitalize">
                {type} Fact
              </span>
            </div>
            <button
              onClick={() => setShow(false)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              aria-label="Close tooltip"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-200 leading-relaxed">
            {text}
          </p>

          {/* Decorative Elements */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-600/30">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-current rounded-full opacity-40"
                ></div>
              ))}
            </div>
            <span className="text-xs text-gray-400">Did you know?</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes tooltipEnter {
          0% {
            opacity: 0;
            transform: translateY(-100%) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(-100%) scale(1);
          }
        }
        .animate-tooltipEnter {
          animation: tooltipEnter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </span>
  );
}

// Optional: Higher-order component for specific tooltip types
export const ScienceFactTooltip = ({ text }) => (
  <FunFactTooltip text={text} type="science" />
);

export const DiscoveryFactTooltip = ({ text }) => (
  <FunFactTooltip text={text} type="discovery" />
);

export const FunFactTooltipEnhanced = ({ text }) => (
  <FunFactTooltip text={text} type="fun" />
);