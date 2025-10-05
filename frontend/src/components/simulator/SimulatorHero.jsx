// src/components/SimulatorHero.jsx
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { motion } from "framer-motion";

export default function SimulatorHero({ onStart }) {
  return (
    <section className="relative h-[80vh] flex flex-col justify-center items-center text-center text-white bg-black overflow-hidden">
      {/* 3D Background */}
      <Canvas className="absolute inset-0">
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
      </Canvas>

      {/* Overlay */}
      <div className="relative z-10 px-4">
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Survivability Simulator
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Test if life could survive on distant worlds
        </motion.p>

        <motion.button
          className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold text-white shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
        >
          Start Simulation
        </motion.button>
      </div>
    </section>
  );
}
