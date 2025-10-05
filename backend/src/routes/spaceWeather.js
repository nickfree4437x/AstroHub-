const express = require('express');
const router = express.Router();
const spaceWeatherController = require('../controllers/spaceWeatherController');

router.get('/summary', spaceWeatherController.getSpaceWeather);
router.get('/kp', spaceWeatherController.getKpIndex);
router.get('/solar-wind', spaceWeatherController.getSolarWind);
router.get('/flares', spaceWeatherController.getFlares);

module.exports = router;
