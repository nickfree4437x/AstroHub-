import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Bot, Sparkles, FileText, BarChart3 } from "lucide-react";

export default function ChatBox({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Simple mode indicator
  const getModeIcon = (mode) => {
    const icons = {
      quick: <Sparkles className="w-3 h-3" />,
      deep: <FileText className="w-3 h-3" />,
      data: <BarChart3 className="w-3 h-3" />,
      prediction: <Sparkles className="w-3 h-3" />,
      papers: <FileText className="w-3 h-3" />
    };
    return icons[mode] || <Sparkles className="w-3 h-3" />;
  };

  const getModeLabel = (mode) => {
    const labels = {
      quick: "Quick Facts",
      deep: "Deep Research", 
      data: "Data Analysis",
      prediction: "Prediction",
      papers: "Research Papers"
    };
    return labels[mode] || mode;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 rounded-2xl backdrop-blur-md bg-black/20 border border-white/10 space-y-3 scroll-smooth">
      {messages.map((msg, index) => (
        <motion.div
          key={msg.id || index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex gap-3 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
        >
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            msg.from === "user" 
              ? "bg-gradient-to-r from-indigo-500 to-purple-500" 
              : "bg-gradient-to-r from-blue-500 to-cyan-500"
          }`}>
            {msg.from === "user" ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>

          {/* Message Content */}
          <div className={`flex-1 max-w-[85%] ${msg.from === "user" ? "text-right" : "text-left"}`}>
            {/* Message Bubble */}
            <div
              className={`inline-block p-4 rounded-2xl text-sm leading-relaxed ${
                msg.from === "user"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-800/60 text-gray-100 border border-gray-700/50"
              }`}
            >
              {/* Message Text */}
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-600/50">
                  <div className="text-xs text-gray-400 font-medium mb-1">📚 Sources:</div>
                  <div className="text-xs text-gray-300 space-y-1">
                    {msg.sources.slice(0, 3).map((source, idx) => (
                      <div key={idx} className="truncate">• {source}</div>
                    ))}
                    {msg.sources.length > 3 && (
                      <div className="text-gray-400">+ {msg.sources.length - 3} more</div>
                    )}
                  </div>
                </div>
              )}

              {/* Mode Indicator */}
              {msg.mode && (
                <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                  {getModeIcon(msg.mode)}
                  <span>{getModeLabel(msg.mode)}</span>
                </div>
              )}

              {/* Visualization Available */}
              {msg.structuredData && (
                <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                  <BarChart3 className="w-3 h-3" />
                  <span>Data visualization available below</span>
                </div>
              )}
            </div>

            {/* Timestamp */}
            <div className={`text-xs text-gray-500 mt-1 px-1 ${msg.from === "user" ? "text-right" : "text-left"}`}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Loading Indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex gap-3"
        >
          {/* AI Avatar */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>

          {/* Loading Message */}
          <div className="flex-1 max-w-[85%]">
            <div className="inline-block p-4 rounded-2xl bg-gray-800/60 border border-gray-700/50">
              <div className="flex items-center gap-3">
                {/* Animated dots */}
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-300">AI is researching...</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}