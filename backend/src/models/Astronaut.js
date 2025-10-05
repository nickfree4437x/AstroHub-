const mongoose = require("mongoose");

const MissionSchema = new mongoose.Schema({
  externalId: { type: String },
  name: String,
  role: String,
  launchDate: Date,
  landingDate: Date,
  spacecraft: String,
  durationHours: Number,
  EVAcount: Number,
  EVADurationHours: Number,
  crew: [String],          // new: crew member names
  launchSite: String,      // new: launch site
  missionType: String      // new: type like 'ISS Expedition', 'Apollo', etc.
}, { _id: false });

const AstronautSchema = new mongoose.Schema({
  externalId: { type: String, index: true, unique: true }, // Launch Library external id
  name: { type: String, required: true },
  nickname: String,
  fuzzySearchKeys: [String], // new: for fuzzy search by nickname / alias
  profileImage: String,
  profileImageThumb: String,
  nationality: String,
  countryCode: String,       // new: ISO alpha-2
  flagUrl: String,           // new: frontend display
  agency: {
    id: Number,
    name: String,
    abbrev: String,
    country_code: String,
    logo_url: String,
    image_url: String
  },
  status: String, // Active/Retired/Deceased
  type: String,
  in_space: Boolean,
  timeInSpaceHours: Number,
  evaTimeHours: Number,
  totalSpaceHours: Number,   // new: computed field
  EVAcount: Number,          // new: computed field
  age: Number,
  date_of_birth: Date,
  date_of_death: Date,
  bio: String,
  education: String,         // new: enriched from Wikipedia / curated JSON
  previousOccupation: String,// new: enriched from Wikipedia / curated JSON
  twitter: String,
  instagram: String,
  wiki: String,
  flights_count: Number,
  landings_count: Number,
  spacewalks_count: Number,
  first_flight: Date,
  last_flight: Date,
  firstFlightYear: Number,   // new: computed from first_flight
  gender: { type: String, enum: ["Male", "Female", "Other", null], default: null },
  achievements: [String],
  badges: [String],          // new: auto-compute badges
  quotes: [String],
  missions: [MissionSchema], // detailed timeline
}, { timestamps: true });

module.exports = mongoose.model("Astronaut", AstronautSchema);
