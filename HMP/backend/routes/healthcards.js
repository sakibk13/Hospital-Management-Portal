const express = require('express');
const router = express.Router();
const { registerHealthCard, getHealthCardByEmail, topUpHealthCard } = require('../controllers/healthCardController');

router.post('/register', registerHealthCard);
router.get('/:email', getHealthCardByEmail);
router.put('/topup', topUpHealthCard);

module.exports = router;