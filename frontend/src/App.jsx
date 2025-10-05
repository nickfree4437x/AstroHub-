import { Routes, Route } from "react-router-dom";
import Explore from "./pages/Explore.jsx";
// import Planet from "./pages/Planet.jsx";
import Compare from "./pages/Compare.jsx";
import Simulator from "./pages/Simulator.jsx";
import Missions from "./pages/Missions.jsx";
import SpaceWeather from "./pages/SpaceWeather.jsx";
import Map3D from "./pages/Map3D.jsx";
import Navbar from "./components/main_pages/Navbar.jsx";
import Hero from "./components/main_pages/Hero.jsx";
import AboutSection from "./components/main_pages/AboutSection.jsx";
import FeaturesSection from "./components/main_pages/FeaturesSection.jsx";
import DataInsights from "./components/main_pages/Insight.jsx";
import WorkflowSection from "./components/main_pages/Workflow.jsx";
import WhyUs from "./components/main_pages/WhyUs.jsx";
import Footer from "./components/main_pages/Footer.jsx";
import HabitabilityScore from "./pages/HabitabilityScore.jsx";
import AtmosphereVisualizer from "./pages/AtmosphereVisualizer.jsx";
import Astronault from "./pages/Astronault.jsx";
import GamifiedChallenge from "./pages/GamifiedChallenge.jsx";
import PredictHabitability from "./pages/PredictHabitability.jsx";
import AiResearch from "./pages/AiResearch.jsx";

export default function App() {
  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr]">
      <Navbar />
      <main className="p-4">
        <Routes>
          {/* Landing Page */}
          <Route
            path="/"
            element={
              <>
                <section className="relative z-10">
                 <Hero />
                </section>
                <AboutSection />
                <FeaturesSection />
                <DataInsights/>
                <section className="relative z-20">
                 <WorkflowSection />
                </section>
                <WhyUs />
                <Footer />
              </>
            }
          />

          {/* Explore planets */}
          <Route path="/explore" element={<Explore />} />

          {/* Habitability score page */}
          <Route path="/habitability" element={<HabitabilityScore/>} />

          {/* Compare planets - two modes */}
          <Route path="/compare" element={<Compare />} /> 

          {/* Simulator */}
          <Route path="/survivability" element={<Simulator />} />

          {/* Missions */}
          <Route path="/mission" element={<Missions />} />

          {/* Leaderboard */}
          <Route path="/space-weather" element={<SpaceWeather />} />
          
          {/* Atmosphere Visualizer */}
          <Route path="/atmosphere" element={<AtmosphereVisualizer />} />

          {/* Astronault Page */}
          <Route path="/astronaut-explore" element={<Astronault/>} />

          {/* Habitability Predictor */}
          <Route path="/habitability-predictor" element={<PredictHabitability/>}/>

          {/* 3D solar system */}
          <Route path="/solar-system" element={<Map3D />} />

          {/* Gamified Challenge */}
          <Route path="gamified-challenges" element={<GamifiedChallenge/>}/>

          {/* AI Research Assistant */}
          <Route path="/ai-research" element={<AiResearch/>}/>
        </Routes>
      </main>
    </div>
  );
}
