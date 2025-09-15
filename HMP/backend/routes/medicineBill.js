const express = require('express');
const router = express.Router();
const { purchaseMedicines, getBillsByEmail, payMedicineBill } = require('../controllers/medicineBillController');

router.post('/buy', purchaseMedicines);
router.get('/bills/:email', getBillsByEmail);
router.put('/pay/:billId', payMedicineBill);

module.exports = router;