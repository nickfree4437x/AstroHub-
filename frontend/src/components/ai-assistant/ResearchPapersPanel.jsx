import React from "react";
import { motion } from "framer-motion";
import { FileText, User, Calendar, ExternalLink } from "lucide-react";

export default function ResearchPapersPanel({ papers }) {
  if (!papers || papers.length === 0) {
    return (
      <div className="w-full p-6 rounded-2xl backdrop-blur-md bg-black/40 border border-white/10 text-center">
        <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400">No research papers found</p>
        <p className="text-sm text-gray-500 mt-1">Try searching for space-related topics</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
        <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Research Papers</h3>
          <p className="text-sm text-gray-400">{papers.length} papers found</p>
        </div>
      </div>

      {/* Papers List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {papers.map((paper, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-gray-600/70 transition-colors"
          >
            {/* Title */}
            <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2 leading-relaxed">
              {paper.title || "Untitled Research Paper"}
            </h4>

            {/* Authors */}
            {paper.authors && paper.authors.length > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-400 truncate">
                  {paper.authors.slice(0, 2).join(", ")}
                  {paper.authors.length > 2 && ` +${paper.authors.length - 2}`}
                </span>
              </div>
            )}

            {/* Year */}
            {paper.year && (
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-400">{paper.year}</span>
              </div>
            )}

            {/* Summary */}
            {paper.summary && (
              <p className="text-xs text-gray-300 leading-relaxed mb-3 line-clamp-3">
                {paper.summary}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              {paper.pdfUrl ? (
                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  View PDF
                </a>
              ) : (
                <span className="text-xs text-gray-500">No PDF available</span>
              )}
              
              {paper.doi && (
                <span className="text-xs text-gray-400 truncate max-w-[120px]">
                  DOI: {paper.doi}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}