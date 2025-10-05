// src/data/staticAtmospheres.js
export default {
  Mercury: {
    composition: { He: 42, H: 29, O: 22, Na: 6 },
    meanMolecularWeight: 20.0,
    surfacePressure: 0,
    pressureUnit: "Pa",
    scaleHeight: 100,
    layers: [
      { name: "Exosphere (surface-bound)", rangeKm: [0, 1000], composition: { Na:6, He:42 }, color: "#fef3c7", thicknessKm: 1000 },
    ],
    special: ["Very tenuous exosphere", "Surface sputtering"]
  },

  Venus: {
    composition: { CO2: 96.5, N2: 3.5 },
    meanMolecularWeight: 43.45,
    surfacePressure: 9_200_000, // in Pa
    pressureUnit: "Pa",
    scaleHeight: 15.9,
    layers: [
      { name: "Troposphere", rangeKm: [0, 65], temp: "737°C → cooler", pressure: "≈92 bar", composition: { CO2:96.5 }, thicknessKm: 65, color: "#f97316" },
      { name: "Upper cloud", rangeKm: [50, 80], temp: "-10→60°C", composition: { H2SO4: 1 }, color: "#fca5a5" },
    ],
    special: ["Thick sulfuric acid clouds", "Runaway greenhouse"]
  },

  Earth: {
    composition: { N2: 78.08, O2: 20.95, Ar: 0.93, CO2: 0.04 },
    meanMolecularWeight: 28.97,
    surfacePressure: 101325,
    pressureUnit: "Pa",
    scaleHeight: 8.5,
    layers: [
      { name: "Troposphere", rangeKm: [0, 12], temp: "15→-56°C", pressure: "1013→226 hPa", composition: { N2:78.08, O2:20.95 }, thicknessKm: 12, color: "#60a5fa" },
      { name: "Stratosphere", rangeKm: [12, 50], temp: "-56→-2°C", pressure: "226→1 hPa", composition: { N2:78.08, O2:20.95 }, thicknessKm: 38, color: "#7dd3fc" },
      { name: "Mesosphere", rangeKm: [50, 85], temp: "-2→-90°C", pressure: "<1 hPa", composition: { N2:78.08 }, thicknessKm: 35, color: "#93c5fd" },
      { name: "Thermosphere", rangeKm: [85, 600], temp: "500→2000°C", composition: { N2:70, O2:30 }, thicknessKm: 515, color: "#bfdbfe" },
    ],
    special: ["Aurora (poles)", "Ozone layer (stratosphere)"]
  },

  Mars: {
    composition: { CO2: 95.97, N2:1.89, Ar:1.93, O2:0.146 },
    meanMolecularWeight: 44.01,
    surfacePressure: 610,
    pressureUnit: "Pa",
    scaleHeight: 11.1,
    layers: [
      { name: "Lower atmosphere", rangeKm: [0, 50], temp: "-63°C avg", pressure: "≈0.6 kPa", composition: { CO2:95.97 }, thicknessKm: 50, color: "#fb7185" },
      { name: "Exosphere", rangeKm: [50, 200], temp: "varies", composition: { CO2:95 }, thicknessKm: 150, color: "#fda4af" },
    ],
    special: ["Global dust storms", "Thin CO₂ atmosphere"]
  },

  Jupiter: {
    composition: { H2: 89, He: 10, CH4: 0.3, NH3: 0.03 },
    meanMolecularWeight: 2.2,
    surfacePressure: null,
    pressureUnit: "bar",
    scaleHeight: 27,
    layers: [
      { name: "Upper clouds", rangeKm: [0, 100], temp: "-145°C avg", composition: { H2:89, He:10 }, thicknessKm: 100, color: "#fef08a" },
      { name: "Deep atmosphere", rangeKm: [100, 1000], composition: { H2:89, He:10 }, color: "#fde68a" },
    ],
    special: ["Strong auroras", "Banding & storms (Great Red Spot)"]
  },

  Saturn: {
    composition: { H2: 96.3, He: 3.25, CH4: 0.4 },
    meanMolecularWeight: 2.2,
    surfacePressure: null,
    pressureUnit: "bar",
    scaleHeight: 60,
    layers: [
      { name: "Upper atmosphere", rangeKm: [0, 200], composition: { H2:96.3, He:3.25 }, color: "#c7d2fe", thicknessKm: 200 },
    ],
    special: ["Rings interact with upper atmosphere", "Auroras"]
  },

  Uranus: {
    composition: { H2: 82.5, He: 15.2, CH4: 2.3 },
    meanMolecularWeight: 2.3,
    surfacePressure: null,
    pressureUnit: "bar",
    scaleHeight: 27,
    layers: [
      { name: "Upper atmosphere", rangeKm: [0, 500], composition: { H2:82.5, He:15.2, CH4:2.3 }, thicknessKm: 500, color: "#7dd3fc" },
      { name: "Stratosphere", rangeKm: [500, 2000], composition: { H2:82.5, He:15.2, CH4:2.3 }, thicknessKm: 1500, color: "#38bdf8" },
    ],
    special: ["Methane gives blue color", "Extreme tilt (rotation)"]
  },

  Neptune: {
    composition: { H2: 80, He: 19, CH4: 1 },
    meanMolecularWeight: 2.3,
    surfacePressure: null,
    pressureUnit: "bar",
    scaleHeight: 27,
    layers: [
      { name: "Upper atmosphere", rangeKm: [0, 500], composition: { H2:80, He:19, CH4:1 }, thicknessKm: 500, color: "#60a5fa" },
      { name: "Stratosphere", rangeKm: [500, 2000], composition: { H2:80, He:19, CH4:1 }, thicknessKm: 1500, color: "#3b82f6" },
    ],
    special: ["Strong winds", "Methane absorbs red light → blue color"]
  }
};
