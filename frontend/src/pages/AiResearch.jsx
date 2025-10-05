import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import HeroSection from "../components/ai-assistant/HeroSection";
import ChatBox from "../components/ai-assistant/ChatBox";
import MessageInput from "../components/ai-assistant/MessageInput";
import VisualizationPanel from "../components/ai-assistant/VisualizationPanel";
import ErrorBoundary from "../components/ai-assistant/ErrorBoundary";
import ResearchPapersPanel from "../components/ai-assistant/ResearchPapersPanel";
import { Rocket, Zap, Book, BarChart3, Sparkles } from "lucide-react";

export default function AIResearchAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "ai",
      text: "👋 Hi! I'm your AI Space Research Assistant. Ask me anything about the universe, exoplanets, or space missions! 🚀",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("quick");
  const [papers, setPapers] = useState([]);
  const [showPapersModal, setShowPapersModal] = useState(false);
  const bgRef = useRef(null);

  // 🌌 Enhanced 3D Space Background
  useEffect(() => {
    if (!bgRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    bgRef.current.appendChild(renderer.domElement);

    const starGroups = [];

    // Small stars
    const smallStars = createStarField(3000, 1.5, 1500, 0xffffff);
    scene.add(smallStars);
    starGroups.push(smallStars);

    // Medium stars
    const mediumStars = createStarField(1500, 2.5, 1200, 0x93c5fd);
    scene.add(mediumStars);
    starGroups.push(mediumStars);

    // Large stars (twinkling)
    const largeStars = createStarField(500, 4, 800, 0xfbbf24);
    scene.add(largeStars);
    starGroups.push(largeStars);

    // Nebula Layers
    const nebulaLayers = [
      { radius: 600, color1: 0x1e40af, color2: 0x7e22ce, speed: 0.3 },
      { radius: 450, color1: 0x0ea5e9, color2: 0xec4899, speed: 0.5 },
      { radius: 300, color1: 0x10b981, color2: 0x8b5cf6, speed: 0.7 },
    ];

    nebulaLayers.forEach((layer) => {
      const nebula = createNebulaLayer(layer.radius, layer.color1, layer.color2, layer.speed);
      scene.add(nebula);
    });

    // Floating dust
    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = 1000;
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount * 3; i++) {
      dustPositions[i] = (Math.random() - 0.5) * 1000;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

    const dustMaterial = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.8,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });

    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    camera.position.z = 50;
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      starGroups.forEach((stars, index) => {
        stars.rotation.y = elapsedTime * (0.02 + index * 0.01);
        stars.rotation.x = Math.sin(elapsedTime * 0.1 + index) * 0.1;
      });

      dust.rotation.y = elapsedTime * 0.05;
      dust.rotation.x = Math.sin(elapsedTime * 0.1) * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (bgRef.current && renderer.domElement) {
        bgRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const createStarField = (count, size, range, color) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * range * 2;
      positions[i + 1] = (Math.random() - 0.5) * range * 2;
      positions[i + 2] = (Math.random() - 0.5) * range * 2;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color,
      size,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Points(geometry, material);
  };

  const createNebulaLayer = (radius, color1, color2, speed) => {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(color1) },
        color2: { value: new THREE.Color(color2) },
        time: { value: 0 },
        speed: { value: speed },
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float time;
        uniform float speed;
        varying vec3 vPosition;
        void main() {
          float noise = sin(vPosition.x * 0.005 + time * speed)
                      * cos(vPosition.y * 0.005 + time * speed * 0.7)
                      * sin(vPosition.z * 0.005 + time * speed * 0.3);
          noise = noise * 0.5 + 0.5;
          vec3 color = mix(color1, color2, noise);
          gl_FragColor = vec4(color, 0.08);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Mesh(geometry, material);
  };

  // 🧠 Query handler
  const sendQuery = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: "user", text, mode };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      let res, data;
      if (mode === "papers") {
        res = await fetch(
          `https://astrohub-aqac.onrender.com/api/ai/papers?query=${encodeURIComponent(text)}`
        );
        data = await res.json();
        setPapers(data.papers || []);
        setShowPapersModal(true);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            from: "ai",
            text: `🔍 Found ${data.count || 0} research papers related to "${text}".`,
          },
        ]);
      } else {
        res = await fetch("https://astrohub-aqac.onrender.com/api/ai/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text, mode, language: "en" }),
        });
        data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            from: "ai",
            text: data.answer || "🤔 No response from AI.",
            structuredData: data.structuredData || null,
            sources: data.sources || [],
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, from: "ai", text: "⚠️ Error contacting server." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAsk = (q) => sendQuery(q);
  const lastMsg = messages[messages.length - 1];
  const chartData =
    lastMsg?.structuredData && typeof lastMsg.structuredData === "object"
      ? lastMsg.structuredData
      : null;

  return (
    <div className="relative mt-10 min-h-screen text-white overflow-hidden">
      <div ref={bgRef} className="fixed inset-0 -z-10" />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/15 to-black/80 -z-5" />
      <div className="fixed inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 -z-5" />

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-6">

          <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
            {/* Chat Section */}
            <div className="flex-1 flex flex-col min-h-[80vh]">
              <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col">
                <HeroSection onQuickAsk={handleQuickAsk} />

                <div className="mt-6 mb-4 text-center">

                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { value: "quick", label: "Quick Facts", icon: <Zap className="w-4 h-4" /> },
                    { value: "deep", label: "Deep Research", icon: <Book className="w-4 h-4" /> },
                    { value: "data", label: "Data Analysis", icon: <BarChart3 className="w-4 h-4" /> },
                    { value: "prediction", label: "Predictions", icon: <Sparkles className="w-4 h-4" /> },
                    { value: "papers", label: "Research Papers", icon: <Book className="w-4 h-4" /> },
                  ].map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMode(m.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        mode === m.value
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                          : "bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-600/50"
                      }`}
                    >
                      {m.icon}
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

                <div className="flex-1 flex flex-col mt-4 space-y-4">
                  <ChatBox messages={messages} isLoading={isLoading} />
                  {chartData && (
                    <ErrorBoundary>
                      <VisualizationPanel data={chartData} />
                    </ErrorBoundary>
                  )}
                  <MessageInput onSend={sendQuery} disabled={isLoading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📘 Research Papers Modal */}
      {showPapersModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="bg-black/80 border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setShowPapersModal(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-4">
            </div>
            <ResearchPapersPanel papers={papers} />
          </div>
        </div>
      )}
    </div>
  );
}
