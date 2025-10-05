import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Zap, Book, BarChart3, Sparkles, FileText } from "lucide-react";

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("quick");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Mode options with icons
  const modeOptions = [
    { value: "quick", label: "Quick", icon: <Zap className="w-4 h-4" /> },
    { value: "deep", label: "Deep", icon: <Book className="w-4 h-4" /> },
    { value: "data", label: "Data", icon: <BarChart3 className="w-4 h-4" /> },
    { value: "prediction", label: "Predict", icon: <Sparkles className="w-4 h-4" /> },
    { value: "papers", label: "Papers", icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <motion.div
      className="mt-4 flex flex-col sm:flex-row items-end gap-3 p-4 rounded-2xl backdrop-blur-md bg-black/40 border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >

      {/* Input Field */}
      <div className="flex-1 w-full">
        <div className="relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about exoplanets, space missions, or astronomical phenomena..."
            disabled={disabled}
            className="w-full p-3 pr-12 rounded-xl bg-gray-800/60 text-white placeholder-gray-400 border border-gray-600/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50"
          />
          {text && (
            <button
              onClick={() => setText("")}
              className="absolute right-12 top-1/2 border:outline transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Send Button */}
      <div className="w-full sm:w-auto">
        <label className="block text-xs font-semibold text-gray-400 mb-2 invisible">
          Action
        </label>
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Send className="w-4 h-4" />
          Send
        </motion.button>
      </div>
    </motion.div>
  );
}