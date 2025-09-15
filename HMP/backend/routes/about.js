const express = require('express');
const router = express.Router();
const { ensureAboutData, getAboutData } = require('../controllers/aboutController');

router.get('/', ensureAboutData, getAboutData);

module.exports = router;