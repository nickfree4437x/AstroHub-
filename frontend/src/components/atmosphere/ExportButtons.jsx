// src/components/atmosphere/ExportButtons.jsx
import React from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

export default function ExportButtons({ targetId, compositionData, layerData }) {
  const handleScreenshot = async () => {
    const canvasEl = document.getElementById(targetId);
    if (!canvasEl) return;
    const canvas = await html2canvas(canvasEl);
    canvas.toBlob(blob => {
      saveAs(blob, "planet-atmosphere.png");
    });
  };

  const handleExportCSV = () => {
    let csv = "Layer,Composition\n";
    layerData.forEach(l => {
      const comp = l.composition
        ? Object.entries(l.composition).map(([g,v]) => `${g}:${v}%`).join("|")
        : "";
      csv += `${l.name},${comp}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "layers_composition.csv");
  };

  return (
    <div className="flex gap-2 mt-2">
      <button onClick={handleScreenshot} className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-sm">
        📸 Screenshot
      </button>
      <button onClick={handleExportCSV} className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-sm">
        📄 Export CSV
      </button>
    </div>
  );
}
// src/pages/AtmosphereVisualizer.jsx