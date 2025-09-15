const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getAllDoctors,
  getAllPatients,
  addDoctor,
  addPatient,
  updateDoctor,
  updatePatient,
  deleteDoctor,
  deletePatient,
} = require('../controllers/adminController');

router.post('/login', adminLogin);
router.get('/doctors', getAllDoctors);
router.get('/patients', getAllPatients);
router.post('/doctors', addDoctor);
router.post('/patients', addPatient);
router.put('/doctors/:id', updateDoctor);
router.put('/patients/:id', updatePatient);
router.delete('/doctors/:id', deleteDoctor);
router.delete('/patients/:id', deletePatient);

module.exports = router;