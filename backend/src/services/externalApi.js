const axios = require("axios");

const parseISODurationToHours = (durationStr) => {
  // Parses ISO 8601 duration like "P396DT11H33M45S" -> hours (float)
  if (!durationStr) return 0;
  const pattern = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const m = durationStr.match(pattern);
  if (!m) return 0;
  const days = parseInt(m[1] || 0, 10);
  const hours = parseInt(m[2] || 0, 10);
  const mins = parseInt(m[3] || 0, 10);
  const secs = parseInt(m[4] || 0, 10);
  const totalHours = days * 24 + hours + mins / 60 + secs / 3600;
  return Number(totalHours.toFixed(3));
};

const fetchJson = async (url, options = {}, timeoutMs = 20000) => {
  const res = await axios.get(url, { ...options, timeout: timeoutMs });
  return res.data;
};

module.exports = {
  parseISODurationToHours,
  fetchJson
};
