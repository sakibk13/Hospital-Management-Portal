const express = require('express');
const router = express.Router();
const { createTestAndServicesBill, getTestAndServicesBillsByPatientEmail, payTestAndServicesBill } = require('../controllers/testAndServicesBillController');

router.post('/add', createTestAndServicesBill);
router.get('/bills/:email', getTestAndServicesBillsByPatientEmail);
router.put('/pay/:id', payTestAndServicesBill);

module.exports = router;