const express = require('express');
const router = express.Router();
const { registerBloodDonor, getAllBloodDonors } = require('../controllers/bloodDonorController');

router.post('/', registerBloodDonor);
router.get('/details', getAllBloodDonors);

module.exports = router;