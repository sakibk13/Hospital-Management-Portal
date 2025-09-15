const express = require('express');
const router = express.Router();
const {
  getAvailableCabins,
  bookCabin,
  getCabinBillsByPatientEmail,
  payCabinBill,
} = require('../controllers/cabinBookingController');

router.get('/cavailable', getAvailableCabins);
router.post('/cbook', bookCabin);
router.get('/cabin-bills/:email', getCabinBillsByPatientEmail);
router.put('/pay-cabin-bill/:id', payCabinBill);

module.exports = router;