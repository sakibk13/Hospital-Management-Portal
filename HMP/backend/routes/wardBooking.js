const express = require('express');
const router = express.Router();
const {
  getAvailableWards,
  bookWard,
  getWardBillsByPatientEmail,
  payWardBill,
} = require('../controllers/wardBookingController');

router.get('/wavailable', getAvailableWards);
router.post('/wbook', bookWard);
router.get('/ward-bills/:email', getWardBillsByPatientEmail);
router.put('/pay-ward-bill/:id', payWardBill);

module.exports = router;