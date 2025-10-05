const axios = require('axios');

async function fetchAPI(url, params = {}) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('API Fetch Error:', error.message);
    return null;
  }
}

module.exports = fetchAPI;
