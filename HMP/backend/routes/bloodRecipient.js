const express = require('express');
const router = express.Router();
const { registerBloodRecipient, getAllBloodRequests } = require('../controllers/bloodRecipientController');

router.post('/', registerBloodRecipient);
router.get('/', getAllBloodRequests);
module.exports = router;