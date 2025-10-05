// src/components/EducationalSidebar.jsx
import { motion } from "framer-motion";
import { 
  FaBookOpen, 
  FaGraduationCap, 
  FaRocket, 
  FaSatellite, 
  FaBolt,
  FaGlobeAmericas,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaLightbulb,
  FaUniversity
} from "react-icons/fa";

export default function EducationalSidebar() {
  const educationalSections = [
    {
      icon: FaRocket,
      title: "What is Space Weather?",
      content: "Space weather refers to the environmental conditions in space as influenced by the Sun and the solar wind. It includes solar flares, coronal mass ejections, and geomagnetic storms that can impact technology and life on Earth.",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: FaExclamationTriangle,
      title: "Effects of Solar Storms",
      items: [
        { icon: FaSatellite, text: "Satellite disruption in communication and navigation systems" },
        { icon: FaRocket, text: "Radiation hazards for astronauts and spacecraft missions" },
        { icon: FaBolt, text: "Power grid damage from induced geomagnetic currents" },
        { icon: FaGlobeAmericas, text: "Aurora displays at lower latitudes during strong storms" }
      ],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: FaLightbulb,
      title: "Did You Know?",
      facts: [
        "A single solar flare can release energy equivalent to millions of atomic bombs",
        "The Carrington Event of 1859 caused telegraph systems to fail worldwide",
        "Astronauts on the ISS are protected by Earth's magnetic field",
        "Solar maximum occurs every 11 years, increasing storm frequency"
      ],
      color: "from-yellow-500 to-amber-500"
    }
  ];

  const resources = [
    {
      name: "NASA Space Weather",
      url: "https://www.nasa.gov/spaceweather",
      description: "Official NASA space weather monitoring and research",
      icon: FaRocket
    },
    {
      name: "NOAA Space Weather Prediction Center",
      url: "https://www.swpc.noaa.gov/",
      description: "Real-time space weather forecasts and alerts",
      icon: FaUniversity
    },
    {
      name: "ESA Space Weather",
      url: "https://www.esa.int/Space_Safety/Space_weather",
      description: "European Space Agency's space weather portal",
      icon: FaGlobeAmericas
    },
    {
      name: "Space Weather Live",
      url: "https://www.spaceweatherlive.com/",
      description: "Community-driven space weather monitoring",
      icon: FaSatellite
    }
  ];

  return (
    <motion.aside 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-8 px-4 md:px-8"
    >
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <FaGraduationCap className="text-2xl text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Space Weather Education</h2>
            <p className="text-gray-400 text-sm">Learn about solar activity and its impacts</p>
          </div>
        </div>

        {/* Educational Sections */}
        <div className="space-y-6">
          {educationalSections.map((section, index) => {
            const SectionIcon = section.icon;
            return (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-xl p-5 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300"
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color}`}>
                    <SectionIcon className="text-white text-lg" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                </div>

                {/* Content */}
                {section.content && (
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    {section.content}
                  </p>
                )}

                {/* Items List */}
                {section.items && (
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => {
                      const ItemIcon = item.icon;
                      return (
                        <div key={itemIndex} className="flex items-start gap-3">
                          <ItemIcon className="text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm leading-relaxed">{item.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Facts List */}
                {section.facts && (
                  <div className="space-y-2">
                    {section.facts.map((fact, factIndex) => (
                      <div key={factIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300 text-sm leading-relaxed">{fact}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>
            );
          })}
        </div>

        {/* Learning Resources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-5 border border-blue-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FaBookOpen className="text-xl text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Learning Resources</h3>
          </div>

          <div className="space-y-3">
            {resources.map((resource, index) => {
              const ResourceIcon = resource.icon;
              return (
                <motion.a
                  key={resource.name}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-gray-600/30 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 group"
                >
                  <ResourceIcon className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm group-hover:text-blue-300 transition-colors">
                        {resource.name}
                      </span>
                      <FaExternalLinkAlt className="text-gray-400 text-xs group-hover:text-blue-300 transition-colors" />
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{resource.description}</p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.section>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 bg-green-900/20 rounded-xl border border-green-500/30"
        >
          <div className="flex items-start gap-3">
            <FaLightbulb className="text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-green-300 font-semibold mb-2">Space Weather Tips</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Monitor KP index for aurora viewing opportunities</li>
                <li>• High solar activity can affect radio communications</li>
                <li>• Satellite operators adjust orbits during strong storms</li>
                <li>• Power companies monitor geomagnetic activity</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-400 text-sm mb-3">
            Ready to dive deeper into space weather?
          </p>
          <motion.a
            href="https://www.nasa.gov/mission_pages/sunearth/spaceweather/index.html"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/20"
          >
            <FaGraduationCap />
            Explore NASA's Guide
          </motion.a>
        </motion.div>
      </div>
    </motion.aside>
  );
}