import { useState, useEffect, useRef } from "react";
import {
  ChevronDown, Menu, X, Rocket, Star, Globe,
  Telescope, Users, Brain, Map, Database, Target,
  Shield, TrendingUp, Calendar, Cloud, Eye, LayoutDashboard, Grid
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImg from "./logo_1.jpg";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const researchRef = useRef(null);
  const explorerRef = useRef(null);
  const communityRef = useRef(null);
  const toolsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const refs = { research: researchRef, explorer: explorerRef, community: communityRef, tools: toolsRef };
      Object.entries(refs).forEach(([key, ref]) => {
        if (ref.current && !ref.current.contains(event.target)) {
          if (dropdownOpen === key) setDropdownOpen(null);
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Reset states on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(null);
    setMobileDropdownOpen(null);
  }, [location.pathname]);

  const navLinks = [{ path: "/", label: "Home", icon: <Star size={16} /> }];

  const explorerLinks = [
    { path: "/explore", label: "Planet Data Explorer", icon: <Database size={16} /> },
    { path: "/habitability", label: "Habitability Score", icon: <Target size={16} /> },
    { path: "/habitability-predictor", label: "Habitability Predictor", icon: <TrendingUp size={16} /> },
    { path: "/solar-system", label: "Explore Solar System", icon: <Map size={16} /> },
  ];

  const researchLinks = [
    { path: "/space-weather", label: "Space Weather Tracker", icon: <Cloud size={16} /> },
    { path: "/atmosphere", label: "Atmosphere Visualizer", icon: <Eye size={16} /> },
    { path: "/astronaut-explore", label: "Astronauts Details", icon: <Users size={16} /> },
    { path: "/mission", label: "Explore Space Missions", icon: <Calendar size={16} /> },
  ];

  const communityLinks = [
    { path: "/analytics", label: "Analytics Dashboard", icon: <LayoutDashboard size={16} /> },
    { path: "/space-travel", label: "Space Travel Planner", icon: <Rocket size={16} /> },
  ];

  const toolsLinks = [
    { path: "/ai-research", label: "AI Research Assist", icon: <Brain size={16} /> },
    { path: "/compare", label: "Earth vs Planet", icon: <Globe size={16} /> },
  ];

  const isActive = (path) =>
    location.pathname === path ? "text-purple-300 font-semibold" : "text-gray-200";

  const handleExploreClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 800, behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 800, behavior: "smooth" }), 200);
    }
    setMenuOpen(false);
  };

  const toggleMobileDropdown = (dropdown) => {
    setMobileDropdownOpen(mobileDropdownOpen === dropdown ? null : dropdown);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-gray-900/80 backdrop-blur-md border-b border-purple-900/30 shadow-xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 relative z-10">
        {/* Logo */}
        {/* ✅ Logo (replaced PlanetLogo with JPG) */}
        <Link
          to="/"
          className="flex items-center space-x-3 group"
          onClick={() => setMenuOpen(false)}
        >
          <div className="relative w-14 h-14">
            <img
              src={logoImg}
              alt="AstroHub Logo"
              className="w-full h-full object-cover rounded-full transition-all duration-300"
            />
          </div>
          <span className="text-4xl font-extrabold transition-all duration-300">
            AstroHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center flex-1 space-x-1 mx-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all group ${isActive(
                link.path
              )} hover:text-purple-300 hover:bg-gray-800/30 relative overflow-hidden`}
            >
              <span className="mr-2 opacity-80 group-hover:opacity-100 transition-opacity">
                {link.icon}
              </span>
              {link.label}
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span
                className={`absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ${
                  isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}

          {/* Dropdowns (Explorer, Research, Tools, More) */}
          {[
            { id: "explorer", label: "Explorer", icon: <Globe size={16} />, links: explorerLinks },
            { id: "research", label: "Research", icon: <Telescope size={16} />, links: researchLinks },
            { id: "tools", label: "Tools", icon: <LayoutDashboard size={16} />, links: toolsLinks },
          ].map((menu) => (
            <div className="relative" ref={menu.id === "explorer" ? explorerRef : menu.id === "research" ? researchRef : menu.id === "tools" ? toolsRef : communityRef} key={menu.id}>
              <button
                onClick={() =>
                  setDropdownOpen(dropdownOpen === menu.id ? null : menu.id)
                }
                className={`flex items-center px-4 py-3 rounded-lg transition-all group relative overflow-hidden ${
                  dropdownOpen === menu.id
                    ? "text-purple-300 bg-gray-800/30"
                    : "text-gray-200 hover:text-purple-300 hover:bg-gray-800/30"
                }`}
              >
                {menu.icon}
                <span className="ml-2">{menu.label}</span>
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform duration-300 ${
                    dropdownOpen === menu.id ? "rotate-180" : ""
                  }`}
                />
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>

              {dropdownOpen === menu.id && (
                <div className="absolute mt-2 left-0 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl w-56 overflow-hidden py-2 z-50 animate-fadeIn">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent opacity-50"></div>
                  {menu.links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="flex items-center px-4 py-3 hover:bg-purple-900/30 transition group relative"
                      onClick={() => setDropdownOpen(null)}
                    >
                      <span className="mr-3 text-purple-400 group-hover:scale-110 transition-transform">
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Side Button */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={handleExploreClick}
            className="relative px-6 py-2.5 rounded-lg font-medium text-white group overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-purple-900 group-hover:from-indigo-600 group-hover:to-purple-800 transition-all duration-300"></span>
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.2),transparent_70%)]"></span>
            <span className="flex items-center gap-2 relative z-10">
              <Rocket className="text-purple-200" size={16} />
              Explore Cosmos
            </span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg text-gray-200 hover:bg-gray-800/30 transition relative z-20"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-700 px-4 py-3 space-y-1 relative z-40 animate-slideIn max-h-screen overflow-y-auto">
          {/* Home */}
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setTimeout(() => setMenuOpen(false), 150);
              }}
              className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition ${isActive(
                link.path
              )} hover:text-purple-300 hover:bg-gray-800/30 relative`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.label}
            </button>
          ))}

          {/* Dropdowns for Mobile */}
          {[ 
            { id: "explorer", label: "Explorer", icon: <Globe size={16} />, links: explorerLinks, color: "purple" },
            { id: "research", label: "Research", icon: <Telescope size={16} />, links: researchLinks, color: "blue" },
            { id: "tools", label: "Tools", icon: <LayoutDashboard size={16} />, links: toolsLinks, color: "yellow" },
            { id: "community", label: "More", icon: <Grid size={16} />, links: communityLinks, color: "green" },
          ].map((menu) => (
            <div className="pl-0" key={menu.id}>
              <button
                onClick={() => toggleMobileDropdown(menu.id)}
                className="flex items-center w-full px-4 py-3 rounded-lg text-left hover:text-purple-300 hover:bg-gray-800/30 transition"
              >
                {menu.icon}
                <span className="ml-3">{menu.label}</span>
                <ChevronDown
                  size={16}
                  className={`ml-auto transition-transform duration-300 ${
                    mobileDropdownOpen === menu.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileDropdownOpen === menu.id && (
                <div
                  className={`pl-4 mt-1 space-y-1 border-l-2 border-${menu.color}-500/30 ml-3`}
                >
                  {menu.links.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => {
                        navigate(link.path);
                        setTimeout(() => {
                          setMenuOpen(false);
                          setMobileDropdownOpen(null);
                        }, 150);
                      }}
                      className="flex items-center w-full text-left px-4 py-3 rounded-lg hover:text-purple-300 hover:bg-gray-800/30 transition"
                    >
                      <span className={`mr-3 text-${menu.color}-400`}>
                        {link.icon}
                      </span>
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Explore Button Mobile */}
          <div className="pt-4 border-t border-gray-700 mt-2">
            <button
              onClick={handleExploreClick}
              className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-white font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-purple-900"></span>
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.2),transparent_70%)]"></span>
              <Rocket size={18} className="mr-2 relative z-10" />
              <span className="relative z-10">Explore Cosmos</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
