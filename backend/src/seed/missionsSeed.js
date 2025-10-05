const mongoose = require("mongoose");
const Mission = require("../models/Mission");

const seedMissions = [
  {
    name: "Artemis I",
    agency: "NASA",
    destination: "Moon",
    vehicle: "SLS Block 1",
    payloadMassKg: 26000,
    crewed: false,
    status: "Success",
    program: "Artemis",
    launchDateUTC: new Date("2022-11-16T06:47:00Z"),
    arrivalDateUTC: new Date("2022-12-11T17:40:00Z"),
    milestones: [
      { title: "Launch", dateUTC: "2022-11-16T06:47:00Z", description: "SLS launched Artemis I." },
      { title: "Lunar Flyby", dateUTC: "2022-11-21T12:44:00Z", description: "Closest lunar approach." },
      { title: "Splashdown", dateUTC: "2022-12-11T17:40:00Z", description: "Orion reentry and splashdown." }
    ],
    media: [
      { type: "image", url: "https://www.nasa.gov/sites/default/files/thumbnails/image/artemis1.jpg", title: "Launch" }
    ],
    links: [
      { title: "NASA Artemis I", url: "https://www.nasa.gov/artemis-1" }
    ]
  },
  {
    name: "Chandrayaan-3",
    agency: "ISRO",
    destination: "Moon",
    vehicle: "LVM3-M4",
    payloadMassKg: 3900,
    crewed: false,
    status: "Success",
    program: "Chandrayaan",
    launchDateUTC: new Date("2023-07-14T09:05:00Z"),
    arrivalDateUTC: new Date("2023-08-23T12:32:00Z"),
    milestones: [
      { title: "Launch", dateUTC: "2023-07-14T09:05:00Z", description: "LVM3 launched Chandrayaan-3." },
      { title: "Lunar Landing", dateUTC: "2023-08-23T12:32:00Z", description: "Soft landing near south pole." }
    ],
    links: [
      { title: "ISRO Chandrayaan-3", url: "https://www.isro.gov.in/Chandrayaan3" }
    ]
  },
  {
    name: "Mars 2020 (Perseverance)",
    agency: "NASA",
    destination: "Mars",
    vehicle: "Atlas V 541",
    payloadMassKg: 1025,
    crewed: false,
    status: "Success",
    program: "Mars Exploration",
    launchDateUTC: new Date("2020-07-30T11:50:00Z"),
    arrivalDateUTC: new Date("2021-02-18T20:55:00Z"),
    milestones: [
      { title: "Launch", dateUTC: "2020-07-30T11:50:00Z", description: "Atlas V launched Perseverance rover." },
      { title: "Landing", dateUTC: "2021-02-18T20:55:00Z", description: "Landed in Jezero Crater." }
    ],
    media: [
      { type: "image", url: "https://mars.nasa.gov/system/resources/detail_files/25798_PIA23764-web.jpg", title: "Rover on Mars" }
    ],
    links: [
      { title: "NASA Mars 2020", url: "https://mars.nasa.gov/mars2020/" }
    ]
  }
];

async function seedMissionsData() {
  try {
    await Mission.deleteMany({});
    await Mission.insertMany(seedMissions);
    console.log("✅ Missions seeded successfully");
  } catch (err) {
    console.error("❌ Error seeding missions:", err);
  } finally {
    await mongoose.connection.close();
  }
}

// 👉 direct function export
module.exports = seedMissionsData;
