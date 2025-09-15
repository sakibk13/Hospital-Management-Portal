const express = require('express');
const router = express.Router();
const { createTestOrService, getAllTestOrServices } = require('../controllers/testOrServiceController');

router.post('/add', createTestOrService);
router.get('/', getAllTestOrServices);

module.exports = router;