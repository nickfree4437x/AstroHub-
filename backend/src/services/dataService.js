const axios = require("axios");

// 🔹 SpaceX Launches (real-time)
const fetchSpaceXLaunches = async () => {
  const resp = await axios.get("https://api.spacexdata.com/v4/launches");
  const launches = resp.data;

  const yearly = {};
  launches.forEach((launch) => {
    const year = new Date(launch.date_utc).getFullYear();
    yearly[year] = (yearly[year] || 0) + 1;
  });

  return {
    chartType: "bar",
    chartData: {
      labels: Object.keys(yearly),
      values: Object.values(yearly),
    },
    sources: ["SpaceX API"],
  };
};

// 🔹 NASA Launches (via Launch Library 2)
const fetchNasaLaunches = async () => {
  const resp = await axios.get("https://llapi.thespacedevs.com/2.2.0/launch/?search=NASA&limit=200");
  const launches = resp.data.results;

  const yearly = {};
  launches.forEach((launch) => {
    const year = new Date(launch.net).getFullYear();
    yearly[year] = (yearly[year] || 0) + 1;
  });

  return {
    chartType: "bar",
    chartData: {
      labels: Object.keys(yearly),
      values: Object.values(yearly),
    },
    sources: ["Launch Library 2"],
  };
};

// 🔹 Mars Rover Discoveries (NASA Rover Photos API)
const fetchMarsRoverDiscoveries = async (rover = "curiosity") => {
  const resp = await axios.get(
    `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=1000&api_key=${process.env.NASA_API_KEY}`
  );
  const photos = resp.data.photos;

  const timeline = {};
  photos.forEach((photo) => {
    const year = new Date(photo.earth_date).getFullYear();
    timeline[year] = (timeline[year] || 0) + 1;
  });

  return {
    chartType: "timeline",
    chartData: {
      labels: Object.keys(timeline),
      values: Object.values(timeline),
    },
    sources: ["NASA Rover API"],
  };
};

// 🔹 NASA Solar Events (DONKI API)
const fetchSolarEvents = async () => {
  const resp = await axios.get(
    `https://api.nasa.gov/DONKI/FLR?api_key=${process.env.NASA_API_KEY}`
  );
  const events = resp.data;

  const yearly = {};
  events.forEach((event) => {
    const year = new Date(event.beginTime).getFullYear();
    yearly[year] = (yearly[year] || 0) + 1;
  });

  return {
    chartType: "line",
    chartData: {
      labels: Object.keys(yearly),
      values: Object.values(yearly),
    },
    sources: ["NASA DONKI API"],
  };
};

// 🔹 Dispatcher: AI ke instruction ke hisaab se dataset select karo
const fetchDataset = async (dataset, options = {}) => {
  switch (dataset) {
    case "spacex_launches":
      return await fetchSpaceXLaunches();
    case "nasa_launches":
      return await fetchNasaLaunches();
    case "mars_rover":
      return await fetchMarsRoverDiscoveries(options.rover || "curiosity");
    case "solar_events":
      return await fetchSolarEvents();
    default:
      throw new Error("Unknown dataset requested");
  }
};

module.exports = {
  fetchDataset,
  fetchSpaceXLaunches,
  fetchNasaLaunches,
  fetchMarsRoverDiscoveries,
  fetchSolarEvents,
};
