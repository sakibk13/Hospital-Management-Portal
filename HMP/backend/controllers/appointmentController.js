const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const HealthCard = require('../models/HealthCard');

const getDistinctDepartments = async (req, res) => {
    try {
        const departments = await Doctor.distinct('department');
        res.json(departments);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getDoctorsByDepartment = async (req, res) => {
    try {
        const doctors = await Doctor.find({ department: req.params.department });
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createAppointment = async (req, res) => {
    const { department, doctor, date, timeSlot, patientName, patientEmail, patientPhone } = req.body;

    try {
        const doctorDetails = await Doctor.findById(doctor);
        if (!doctorDetails) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const existingDoctorAppointment = await Appointment.findOne({ doctor, date, timeSlot });
        if (existingDoctorAppointment) {
            return res.status(400).json({ error: 'This time slot is already booked with this doctor.' });
        }

        const existingPatientAppointment = await Appointment.findOne({ patientEmail, date, timeSlot });
        if (existingPatientAppointment) {
            return res.status(400).json({ error: 'You already have an appointment at this time and date.' });
        }

        const newAppointment = new Appointment({
            department,
            doctor,
            doctorName: `${doctorDetails.firstName} ${doctorDetails.lastName}`,
            doctorEmail: doctorDetails.email,
            date,
            timeSlot,
            patientName,
            patientEmail,
            patientPhone,
        });

        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAppointmentsByDoctorEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const appointments = await Appointment.find({ doctorEmail: email });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAppointmentsByPatientEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const appointments = await Appointment.find({ patientEmail: email });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAppointmentCountByDoctorEmail = async (req, res) => {
  try {
    const { doctorEmail } = req.params;
    const count = await Appointment.countDocuments({ doctorEmail });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTodayAppointments = async (req, res) => {
    try {
      const doctorEmail = req.query.doctorEmail;
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
      const appointments = await Appointment.find({
        doctorEmail,
        date: { $gte: startOfDay, $lte: endOfDay }
      }).sort({ time: 1 }); 
  
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const requestPayment = async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        if (appointment.paymentRequest === 'requested') {
            return res.status(400).json({ error: 'Payment already requested' });
        }

        appointment.paymentRequest = 'requested';
        await appointment.save();

        res.json({ message: 'Payment request has been sent' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const payWithHealthCard = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    try {
        const appointment = await Appointment.findById(id);
        const healthCard = await HealthCard.findOne({ email });

        if (!appointment || !healthCard) {
            return res.status(404).json({ error: 'Appointment or Health Card not found' });
        }

        if (appointment.paidStatus === 'paid') {
            return res.status(400).json({ error: 'Appointment already paid' });
        }

        if (healthCard.topUpAmount < 1000) {
            return res.status(400).json({ error: 'Insufficient points in health card' });
        }

        healthCard.topUpAmount -= 1000;
        appointment.paidStatus = 'paid';
        appointment.status = 'completed';
        appointment.paymentRequest = 'requested';

        await healthCard.save();
        await appointment.save();

        res.json({ message: 'Payment successful', appointment });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
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
};