import React from "react";
import { motion } from "framer-motion";
import { Rocket, Search, BarChart3, Brain } from "lucide-react";

export default function HeroSection({ onQuickAsk }) {
  const quickQuestions = [
    "What are exoplanets?",
    "Latest Mars missions",
    "Black hole discoveries",
    "James Webb Telescope findings"
  ];

  return (
    <div className="text-center py-12 px-4">
      {/* Main Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            AI Space Research Assistant
          </h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-gray-300 max-w-2xl mx-auto mt-4"
        >
          Get instant answers about space missions, exoplanets, and astronomical discoveries with AI-powered research
        </motion.p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto"
      >
        {[
          { icon: <Search className="w-5 h-5" />, label: "Quick Facts", color: "from-purple-500 to-pink-500" },
          { icon: <Brain className="w-5 h-5" />, label: "Deep Research", color: "from-blue-500 to-cyan-500" },
          { icon: <BarChart3 className="w-5 h-5" />, label: "Data Analysis", color: "from-green-500 to-emerald-500" },
          { icon: <Rocket className="w-5 h-5" />, label: "Predictions", color: "from-orange-500 to-red-500" }
        ].map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 rounded-xl bg-gray-800/40 border border-gray-700/50 backdrop-blur-sm"
          >
            <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color} mb-2`}>
              {feature.icon}
            </div>
            <span className="text-sm font-medium text-gray-200">{feature.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Quick Questions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="max-w-2xl mx-auto"
      >
        <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
          Try asking:
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {quickQuestions.map((question, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onQuickAsk(question)}
              className="px-4 py-2 text-sm bg-gray-800/60 hover:bg-gray-700/60 text-gray-200 rounded-xl border border-gray-600/50 transition-colors backdrop-blur-sm"
            >
              {question}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Bottom Separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-8 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-gray-500 to-transparent"
      />
    </div>
  );
}