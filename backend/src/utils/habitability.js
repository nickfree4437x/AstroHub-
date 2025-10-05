// backend/utils/habitability.js
// ✅ NASA + Earth Similarity Index (ESI) Based Habitability Model (updated - no non-Earth 100%)
// Reference: Kopparapu et al. 2013, Schulze-Makuch et al. 2011 (ESI)
// Author: AstroHub Hackathon Team (updated)

function clamp(v, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, v));
}

/** Linear band scoring helper */
function scoreWithBand(value, idealMin, idealMax, falloffMin, falloffMax) {
  if (value == null || isNaN(value)) return 0;
  const v = Number(value);
  if (v >= idealMin && v <= idealMax) return 100;
  if (v < idealMin) {
    if (falloffMin == null) return (v / idealMin) * 100;
    if (v <= falloffMin) return 0;
    return ((v - falloffMin) / (idealMin - falloffMin)) * 100;
  }
  if (v > idealMax) {
    if (falloffMax == null) return (idealMax / v) * 100;
    if (v >= falloffMax) return 0;
    return ((falloffMax - v) / (falloffMax - idealMax)) * 100;
  }
  return 0;
}

/** Kopparapu et al. 2013 empirical habitable zone model */
function getHabitableZone(luminosity, starTemp) {
  if (!luminosity || !starTemp) return null;

  const T_star = starTemp - 5780;
  const S_eff_sun = { moistGreenhouse: 1.014, maxGreenhouse: 0.343 };
  const coeffs = {
    moistGreenhouse: [8.177e-5, 1.706e-9, -1.814e-12, -1.975e-16],
    maxGreenhouse: [5.447e-5, 1.527e-9, -2.170e-12, -3.828e-16],
  };

  function S_eff(base, c) {
    return base + c[0] * T_star + c[1] * T_star ** 2 + c[2] * T_star ** 3 + c[3] * T_star ** 4;
  }

  const inner = Math.sqrt(luminosity / S_eff(S_eff_sun.moistGreenhouse, coeffs.moistGreenhouse));
  const outer = Math.sqrt(luminosity / S_eff(S_eff_sun.maxGreenhouse, coeffs.maxGreenhouse));

  return { inner, outer };
}

/** 🌍 Earth Similarity Index (ESI) — scientific metric (0..100) */
// uses radius, density, escape velocity, temperature
function calculateESI(planet = {}, planetName = "Unknown") {
  // Earth reference values (normalized to 1 where appropriate)
  const R_E = 1.0; // Earth radii
  const D_E = 1.0; // Earth density (relative)
  const V_E = 1.0; // escape velocity (relative)
  const T_E = 288; // K

  const radius = planet.radiusRe ?? planet.pl_rade ?? planet.radius ?? null;
  const density = planet.density ?? null;
  const escVel = planet.escapeVelocity ?? null;
  const teqK = planet.teqK ?? planet.pl_teq ?? planet.temperatureK ?? null;

  // If everything available, compute terms; otherwise we'll apply penalties later
  const safeRadius = radius != null ? radius : R_E;
  const safeDensity = density != null ? density : D_E;
  const safeEsc = escVel != null ? escVel : V_E;
  const safeTemp = teqK != null ? teqK : T_E;

  // term exponents (common ESI weights)
  const wRadius = 0.57;
  const wDensity = 1.07;
  const wEsc = 0.70;
  const wTemp = 5.58;

  // term function (1 - |x - xe| / (x + xe)) ^ w
  function term(x, xe, w) {
    // guard against zero denominators
    if (x + xe === 0) return 0;
    const base = 1 - Math.abs(x - xe) / (x + xe);
    return Math.pow(Math.max(0, base), w);
  }

  const rTerm = term(safeRadius, R_E, wRadius);
  const dTerm = term(safeDensity, D_E, wDensity);
  const vTerm = term(safeEsc, V_E, wEsc);
  const tRatio = safeTemp / T_E;
  const tTerm = term(tRatio, 1, wTemp);

  let esiFloat = rTerm * dTerm * vTerm * tTerm; // 0..1
  let esiPercent = Math.round(clamp(esiFloat * 100, 0, 100));

  // Missing-data penalty: if any of the core parameters are missing, penalize ESI
  const missing = [];
  if (radius == null) missing.push("radius");
  if (density == null) missing.push("density");
  if (escVel == null) missing.push("escapeVelocity");
  if (teqK == null) missing.push("temperature");

  if (missing.length > 0) {
    // Penalty scales with number of missing key fields: -10% each missing (cumulative)
    const penaltyPct = Math.min(40, missing.length * 10); // at most -40%
    esiPercent = Math.round(clamp(esiPercent - penaltyPct, 0, 100));
  }

  // Deterministic small downward bias for non-Earth to avoid accidental 100
  const isEarthName = String(planetName).toLowerCase() === "earth" || String(planetName).toLowerCase() === "sol";
  if (!isEarthName) {
    // Ensure no non-Earth reaches 100
    if (esiPercent >= 100) esiPercent = 99;
    // extra small cap: avoid unrealistic 99 -> clamp to 98 for very incomplete data
    if (missing.length > 0 && esiPercent > 95) esiPercent = 95;
  } else {
    // For Earth keep 100 if computed/assumed so
    esiPercent = Math.round(clamp(esiPercent, 0, 100));
  }

  return { esi: esiPercent, esiFloat, missing };
}

/** Slight deterministic variation for realism */
function nameHash(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i);
  return Math.abs(h % 1000) / 1000;
}

function randomNoise(seed) {
  // deterministic micro noise in -2.5..+2.5 range
  return (((Math.sin(seed * 12.9898) * 43758.5453) % 1) * 5) - 2.5;
}

/** 🪐 Main Hybrid Habitability Model (final) */
function calculateHabitability(doc = {}) {
  const teqK = doc.teqK ?? doc.pl_teq ?? doc.temperatureK ?? null;
  const radius = doc.radiusRe ?? doc.pl_rade ?? doc.radius ?? null;
  const mass = doc.massMe ?? doc.pl_bmasse ?? doc.mass ?? null;
  const insolation = doc.insolation ?? doc.pl_insol ?? doc.Sflux ?? null;
  const distanceAU = doc.orbitalDistance ?? doc.pl_orbsmax ?? doc.a ?? null;
  const starTemp = doc.starTemp ?? doc.st_teff ?? 5780;
  const luminosity = doc.st_lum ?? doc.starLuminosity ?? 1.0;
  const name = doc.name ?? "Unknown";

  // Step 1: Habitable Zone (Kopparapu)
  const hz = getHabitableZone(luminosity, starTemp);
  if (!hz) {
    // If we cannot determine habitable zone, return low-confidence result
    const esiResult = calculateESI(doc, name);
    return {
      score: 10,
      esi: esiResult.esi,
      label: "Unknown",
      breakdown: { reason: "Missing stellar data", esiMissing: esiResult.missing },
    };
  }

  // Step 2: Orbit Score
  let orbitScore = 0;
  if (distanceAU) {
    if (distanceAU < hz.inner * 0.5 || distanceAU > hz.outer * 1.5) orbitScore = 0;
    else if (distanceAU >= hz.inner && distanceAU <= hz.outer) orbitScore = 100;
    else {
      const delta = Math.min(Math.abs(distanceAU - hz.inner), Math.abs(distanceAU - hz.outer));
      orbitScore = clamp(100 - delta * 200); // degrade rapidly outside HZ
    }
  }

  // Step 3: Hard physical exclusions
  if ((teqK && teqK > 500) || (teqK && teqK < 150) || (radius && radius > 3) || (radius && radius < 0.3)) {
    const esiResult = calculateESI(doc, name);
    // Final: never allow non-Earth to be 100
    const esiOut = esiResult.esi;
    return {
      score: 0,
      esi: esiOut,
      label: "Uninhabitable",
      breakdown: { reason: "Extreme temperature or unsuitable size", habitableZone: hz, esiMissing: esiResult.missing },
    };
  }

  // Step 4: NASA weighted base score
  const tempScore = scoreWithBand(teqK, 250, 320, 180, 380);
  const radiusScore = scoreWithBand(radius, 0.8, 1.8, 0.5, 2.5);
  const massScore = scoreWithBand(mass, 0.8, 5, 0.5, 10);
  const insolationScore = scoreWithBand(insolation, 0.35, 1.7, 0.2, 2.5);

  // missing-data penalty for baseScore (if core physicals absent)
  let baseMissingPenalty = 0;
  if (radius == null) baseMissingPenalty += 10;
  if (mass == null) baseMissingPenalty += 10;
  if (teqK == null) baseMissingPenalty += 10;
  // clamp penalty to 30%
  baseMissingPenalty = Math.min(30, baseMissingPenalty);

  const baseScoreRaw =
    0.35 * tempScore +
    0.25 * orbitScore +
    0.15 * radiusScore +
    0.15 * massScore +
    0.10 * insolationScore;

  const baseScore = Math.round(clamp(baseScoreRaw - baseScoreRaw * (baseMissingPenalty / 100), 0, 100));

  // Step 5: ESI calculation with its own missing-data logic
  const esiResult = calculateESI(doc, name);
  let esiPercent = esiResult.esi;

  // Step 6: Combine baseScore and ESI (weighted), add small deterministic noise
  const seed = nameHash(name);
  const noise = randomNoise(seed); // -2.5 .. +2.5

  // Combine: weighting favoring NASA base slightly more (60/40)
  let combined = (baseScore * 0.6) + (esiPercent * 0.4) + noise;
  combined = Math.round(clamp(combined, 0, 100));

  // Important: ensure only Earth can be 100 (exact match). For non-Earth, cap below 100.
  const isEarthName = String(name).toLowerCase() === "earth" || String(name).toLowerCase() === "sol";
  if (!isEarthName) {
    // Prevent accidental 100 due to rounding/noise
    if (esiPercent >= 100) esiPercent = 99;
    if (combined >= 100) combined = 99;
    // If missing core data, apply extra downshift to combined to avoid false highs
    if (esiResult.missing.length > 0 || baseMissingPenalty > 0) {
      // small extra reduction proportional to missing severity
      const extraPenalty = Math.min(15, Math.ceil((esiResult.missing.length * 7) + (baseMissingPenalty / 3)));
      combined = Math.round(clamp(combined - extraPenalty, 0, 99));
    }
  } else {
    // For Earth keep possibility of 100 but still clamp
    esiPercent = Math.round(clamp(esiPercent, 0, 100));
    combined = Math.round(clamp(combined, 0, 100));
  }

  const finalScore = combined;
  let label = "Uninhabitable";
  if (finalScore >= 70) label = "Potentially Habitable";
  else if (finalScore >= 40) label = "Marginal";

  return {
    score: finalScore,
    esi: esiPercent,
    label,
    breakdown: {
      tempScore,
      orbitScore,
      radiusScore,
      massScore,
      insolationScore,
      habitableZone: hz,
      baseHabitability: baseScore,
      esiFloat: esiResult.esiFloat,
      esiMissing: esiResult.missing,
      noise: Math.round(noise * 100) / 100,
    },
  };
}

module.exports = { calculateHabitability };
