// src/components/Footer.jsx
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaEnvelope, 
  FaRocket, 
  FaGlobe, 
  FaSatellite, 
  FaRegPaperPlane,
  FaHome,
  FaGlobeAmericas,
  FaUserAstronaut,
  FaMap,
  FaChartBar,
  FaSatelliteDish,
  FaBook,
  FaGraduationCap,
  FaBolt,
  FaStar
} from "react-icons/fa";
import { SiNasa, SiSpacex } from "react-icons/si";
import { IoPlanet, IoRocket, IoSchool } from "react-icons/io5";
import { GiGalaxy } from "react-icons/gi";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, Float, Sparkles } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import * as THREE from 'three';

// Animated Asteroid Component
function Asteroid({ position, size }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 6, 6]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          roughness={0.8}
          metalness={0.2}
          emissive="#4c1d95"
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

// Satellite Component
function Satellite({ position }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshStandardMaterial color="#60a5fa" emissive="#1d4ed8" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#93c5fd" />
      </mesh>
    </group>
  );
}

// Enhanced 3D Scene Component
function SpaceScene({ isMobile }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#7e22ce" />
      <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#3b82f6" />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#6366f1" />
      
      <Stars 
        radius={isMobile ? 80 : 120} 
        depth={isMobile ? 40 : 60} 
        count={isMobile ? 2000 : 4000} 
        factor={4} 
        fade 
        speed={0.5}
      />
      
      <Sparkles 
        count={isMobile ? 30 : 50}
        scale={[20, 10, 20]}
        size={2}
        speed={0.3}
        color="#8b5cf6"
      />
      
      {/* Asteroids */}
      <Asteroid position={[-3, 1, -5]} size={0.3} />
      <Asteroid position={[4, -1, -7]} size={0.2} />
      <Asteroid position={[2, 2, -3]} size={0.15} />
      
      {/* Satellites */}
      <Satellite position={[-2, -1, -4]} />
      <Satellite position={[3, 1, -6]} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate={true} 
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

export default function Footer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const quickLinks = [
    { name: "Home", path: "/", icon: <FaHome className="text-purple-400" /> },
    { name: "Explore Planets", path: "/explore", icon: <IoPlanet className="text-blue-400" /> },
    { name: "Survival Simulator", path: "/survivability", icon: <FaUserAstronaut className="text-green-400" /> },
    { name: "3D Solar System", path: "/solar-system", icon: <FaMap className="text-yellow-400" /> },
    { name: "Mission Tracker", path: "/mission", icon: <FaSatelliteDish className="text-red-400" /> },
  ];

  const resources = [
    { name: "NASA Exoplanet Archive", url: "https://exoplanetarchive.ipac.caltech.edu/", icon: <FaBook className="text-orange-400" /> },
    { name: "Kepler Mission Data", url: "https://www.nasa.gov/mission_pages/kepler/main/index.html", icon: <GiGalaxy className="text-purple-400" /> },
    { name: "TESS Mission", url: "https://tess.mit.edu/", icon: <FaStar className="text-yellow-400" /> },
    { name: "Space APIs", url: "https://api.nasa.gov/", icon: <FaBolt className="text-cyan-400" /> },
    { name: "Educational Resources", url: "https://www.nasa.gov/stem/foreducators", icon: <FaGraduationCap className="text-green-400" /> },
  ];

  const partners = [
    { name: "NASA", icon: <SiNasa className="text-red-500 text-xl" />, color: "from-red-500 to-red-700" },
    { name: "SpaceX", icon: <SiSpacex className="text-white text-xl" />, color: "from-gray-300 to-gray-500" },
    { name: "ESA", icon: <FaGlobe className="text-blue-400 text-xl" />, color: "from-blue-400 to-blue-600" },
    { name: "MIT", icon: <FaSatellite className="text-red-300 text-xl" />, color: "from-red-300 to-red-500" },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="relative w-full bg-black text-gray-300 pt-16 pb-8 overflow-hidden">
      {/* Enhanced 3D Space Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <SpaceScene isMobile={isMobile} />
        </Canvas>
      </div>

      {/* Advanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-blue-900/30 to-black/90 -z-5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-purple-900/20 to-transparent -z-5" />
      <div className="absolute inset-0 bg-radial-gradient(at-30%-70%, rgba(139, 92, 246, 0.3) 0%, transparent 50%) -z-5" />
      <div className="absolute inset-0 bg-radial-gradient(at-70% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 50%) -z-5" />

      {/* Animated Cosmic Particles */}
      {mounted && (
        <div className="absolute inset-0 -z-1 overflow-hidden pointer-events-none">
          {[...Array(isMobile ? 20 : 40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `cosmicFloat ${4 + Math.random() * 6}s infinite ease-in-out ${Math.random() * 3}s`
              }}
            />
          ))}
          
          {/* Shooting Stars */}
          {[...Array(isMobile ? 3 : 6)].map((_, i) => (
            <div
              key={`shooter-${i}`}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${10 + Math.random() * 80}%`,
                animation: `shootingStar ${3 + Math.random() * 4}s infinite ease-out ${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/30">
                  <FaRocket className="text-white text-xl" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-30"></div>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AstroHub
              </h2>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-6 backdrop-blur-md bg-black/40 p-4 rounded-xl border border-purple-500/20">
              AI-powered interactive platform transforming NASA exoplanet data into immersive space exploration experiences. 
              Discover, learn, and simulate space like never before.
            </p>
            
            <div className="flex space-x-3">
              {[
                { icon: FaGithub, color: "hover:bg-purple-600/40", border: "border-purple-500/30" },
                { icon: FaLinkedin, color: "hover:bg-blue-600/40", border: "border-blue-500/30" },
                { icon: FaTwitter, color: "hover:bg-cyan-600/40", border: "border-cyan-500/30" },
                { icon: FaEnvelope, color: "hover:bg-pink-600/40", border: "border-pink-500/30" }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border ${social.border} ${social.color}`}
                >
                  <social.icon className="text-lg text-gray-300 hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-6 pb-3 border-b border-purple-500/40 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Explore Universe
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.path} 
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300 flex items-center group backdrop-blur-sm bg-black/30 p-3 rounded-lg hover:bg-purple-900/20 hover:border-purple-500/30 border border-transparent"
                  >
                    <span className="text-sm mr-3 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                    <FaRegPaperPlane className="ml-auto text-xs opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-6 pb-3 border-b border-blue-500/40 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Space Resources
            </h3>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-all duration-300 flex items-center group backdrop-blur-sm bg-black/30 p-3 rounded-lg hover:bg-blue-900/20 hover:border-blue-500/30 border border-transparent"
                  >
                    <span className="text-sm mr-3 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                      {resource.icon}
                    </span>
                    <span className="text-sm">{resource.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-6 pb-3 border-b border-cyan-500/40 flex items-center">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
              Our Partners
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {partners.map((partner, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-2 p-3 bg-gradient-to-r ${partner.color} backdrop-blur-md rounded-lg border border-gray-700/30 bg-opacity-20`}
                >
                  {partner.icon}
                  <span className="text-sm text-gray-200 font-medium">{partner.name}</span>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-green-300 mb-4 pb-2 border-b border-green-500/40 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Space Updates
            </h3>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="w-full bg-white/10 backdrop-blur-md border border-gray-600/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  required
                />
                <FaEnvelope className="absolute right-3 top-3 text-gray-400 text-sm" />
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 group"
              >
                <span>Join Mission</span>
                <FaRocket className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Enhanced Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700/30"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-black px-4 text-sm text-gray-500 backdrop-blur-md bg-black/40 rounded-full border border-gray-700/30 flex items-center gap-2">
              <IoRocket className="text-purple-400" />
              Exploring the Final Frontier
              <IoRocket className="text-purple-400 rotate-180" />
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-500 backdrop-blur-md bg-black/40 px-4 py-2 rounded-full border border-gray-700/30 flex items-center gap-1">
            © {new Date().getFullYear()} AstroHub. Made with <span className="text-pink-500 animate-pulse">♥</span> for space enthusiasts worldwide
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            {["Privacy Policy", "Terms of Service", "Contact"].map((item, index) => (
              <a 
                key={index}
                href={`/${item.toLowerCase().replace(' ', '-')}`} 
                className="text-gray-500 hover:text-purple-400 transition backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full hover:bg-purple-900/20"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="text-sm text-gray-500 flex items-center backdrop-blur-md bg-black/40 px-4 py-2 rounded-full border border-gray-700/30">
            <SiNasa className="text-red-500 mr-2" />
            Powered by NASA Open Data & AI
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes cosmicFloat {
          0%, 100% { 
            transform: translateY(0) rotate(0deg) scale(1); 
            opacity: 0.3; 
          }
          33% { 
            transform: translateY(-10px) rotate(120deg) scale(1.1); 
            opacity: 0.7; 
          }
          66% { 
            transform: translateY(5px) rotate(240deg) scale(0.9); 
            opacity: 0.5; 
          }
        }
        
        @keyframes shootingStar {
          0% { 
            transform: translateX(0) translateY(0) scale(0.5); 
            opacity: 0; 
          }
          10% { 
            opacity: 1; 
          }
          100% { 
            transform: translateX(-100px) translateY(50px) scale(1.5); 
            opacity: 0; 
          }
        }
      `}</style>
    </footer>
  );
}