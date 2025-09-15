const express = require('express');
const router = express.Router();
const {
  getDistinctDepartments,
  getDoctorsByDepartment,
  getDoctorById,
  createAppointment,
  getAppointmentsByDoctorEmail,
  getAppointmentsByPatientEmail,
  getAppointmentCountByDoctorEmail,
  getTodayAppointments,
  requestPayment,
  payWithHealthCard,
} = require('../controllers/appointmentController');

router.get('/departments', getDistinctDepartments);
router.get('/doctors/:department', getDoctorsByDepartment);
router.get('/doctor/:id', getDoctorById);
router.post('/', createAppointment);
router.get('/doctor/email/:email', getAppointmentsByDoctorEmail);
router.get('/patient/email/:email', getAppointmentsByPatientEmail);
router.get('/count/:doctorEmail', getAppointmentCountByDoctorEmail);
router.get('/today-appointments', getTodayAppointments);
router.put('/request-payment/:id', requestPayment);
router.put('/pay/:id', payWithHealthCard);

module.exports = router;