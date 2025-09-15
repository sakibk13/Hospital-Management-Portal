const express = require('express');
const router = express.Router();
const {
  authenticateDoctor,
  authenticatePatient,
  createPrescription,
  getPrescriptionsForDoctor,
  getPrescriptionsForPatient,
  countDistinctPatientsByDoctorEmail,
} = require('../controllers/prescriptionController');

router.post('/create', createPrescription);
router.get('/dsearch', authenticateDoctor, getPrescriptionsForDoctor);
router.get('/psearch', authenticatePatient, getPrescriptionsForPatient);
router.get('/count-patients', countDistinctPatientsByDoctorEmail);

module.exports = router;