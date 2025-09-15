const express = require('express');
const router = express.Router();
const { submitSupportRequest, getAllSupportRequests, respondToSupportRequest } = require('../controllers/supportController');

router.post('/submit', submitSupportRequest);
router.get('/requests', getAllSupportRequests);
router.post('/respond/:id', respondToSupportRequest);

module.exports = router;