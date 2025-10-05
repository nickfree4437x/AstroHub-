// src/utils/earth.js

// Earth reference data
export const EARTH = {
  gravityG: 1,          // Earth gravity in g
  radiusRe: 1,          // Earth radius in Earth radii
  massMe: 1,            // Earth mass in Earth masses
  orbitDays: 365.25,    // Orbital period in days
  starType: "G",        // Sun type
  atmosphere: "N2-O2",  // Primary atmosphere
  stellarActivity: "Normal"
};

// Compute surface gravity in g
export function computeGravityG(mass, radius) {
  if (!mass || !radius) return 0;
  // g = G * M / R^2 relative to Earth units
  return +(mass / (radius ** 2)).toFixed(2);
}

// Convert Kelvin to Celsius
export function kToC(k) {
  if (!k) return null;
  return +(k - 273.15).toFixed(2);
}
