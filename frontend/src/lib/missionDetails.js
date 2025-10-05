// src/lib/missionDetails.js
export const missionDetails = [
  {
    id: 1,
    name: "Apollo 11",
    overview:
      "Apollo 11 was the first mission to land humans on the Moon. Objective: perform lunar landing and return safely.",
    crew: [
      { name: "Neil Armstrong", role: "Commander", image: "/crew/apollo11_neil.jpg" },
      { name: "Buzz Aldrin", role: "Lunar Module Pilot", image: "/crew/apollo11_buzz.jpg" },
      { name: "Michael Collins", role: "Command Module Pilot", image: "/crew/apollo11_michael.jpg" }
    ],
    launchVehicle: "Saturn V",
    events: [
      { time: "1969-07-16 09:32 UTC", description: "Launch from Kennedy Space Center" },
      { time: "1969-07-19 17:21 UTC", description: "Entered lunar orbit" },
      { time: "1969-07-20 20:17 UTC", description: "Lunar module landed on Moon" },
      { time: "1969-07-21 02:56 UTC", description: "First moonwalk" },
      { time: "1969-07-24 16:50 UTC", description: "Splashdown on Earth" }
    ],
    multimedia: [
      { type: "image", url: "/missions/apollo11_1.jpg" },
      { type: "image", url: "/missions/apollo11_2.jpg" },
      { type: "video", url: "/missions/apollo11_lunar_landing.mp4" }
    ],
    stats: {
      speed: "39,897 km/h",
      distance: "384,400 km",
      duration: "8 days, 3 hours, 18 minutes",
      success: true
    }
  },
  {
    id: 2,
    name: "Chandrayaan-3",
    overview:
      "Chandrayaan-3 is India's third lunar exploration mission. Objective: soft-landing on the Moon.",
    crew: [],
    launchVehicle: "GSLV MkIII",
    events: [
      { time: "2023-07-14 09:05 IST", description: "Launch from Satish Dhawan Space Centre" },
      { time: "2023-07-23 18:00 IST", description: "Entered lunar orbit" },
      { time: "2023-08-23 18:00 IST", description: "Soft landing on Moon" },
      { time: "2023-08-24 10:30 IST", description: "Rover deployed successfully" }
    ],
    multimedia: [
      { type: "image", url: "/missions/chandrayaan3_1.jpg" },
      { type: "video", url: "/missions/chandrayaan3_rover.mp4" }
    ],
    stats: {
      speed: "39,000 km/h",
      distance: "384,400 km",
      duration: "40 days",
      success: true
    }
  },
  // ... aur missions add kar sakte ho
];
