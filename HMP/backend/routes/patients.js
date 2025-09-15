const express = require('express');
const router = express.Router();
const {
  patientRegister,
  patientLogin,
  getPatientDetailsByEmail,
  updatePatientProfile,
  searchPatients,
} = require('../controllers/patientController');

router.post('/pregister', patientRegister);
router.post('/plogin', patientLogin);
router.get('/pdetails/email/:email', getPatientDetailsByEmail);
router.put('/pupdate', updatePatientProfile);
router.get('/pdetails/search', searchPatients);

module.exports = router;