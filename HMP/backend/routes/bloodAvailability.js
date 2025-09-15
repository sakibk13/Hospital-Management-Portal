const express = require('express');
const router = express.Router();
const { getBloodAvailability } = require('../controllers/bloodAvailabilityController');

router.get('/', getBloodAvailability);

module.exports = router;