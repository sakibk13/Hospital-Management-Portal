const Prescription = require('../models/Prescription');

// Middleware to authenticate doctor
const authenticateDoctor = (req, res, next) => {
  const doctorEmail = req.headers['doctor-email'];
  if (!doctorEmail) {
    return res.status(400).send({ message: 'Doctor email is required' });
  }
  req.doctorEmail = doctorEmail;
  next();
};

// Middleware to authenticate patient
const authenticatePatient = (req, res, next) => {
  const patientEmail = req.headers['patient-email'];
  if (!patientEmail) {
    return res.status(400).send({ message: 'Patient email is required' });
  }
  req.patientEmail = patientEmail;
  next();
};

const createPrescription = async (req, res) => {
  const { doctorName, doctorEmail, date, patientEmail, patientName, age, sex, phoneNumber, prescriptionText } = req.body;

  try {
    const newPrescription = new Prescription({
      doctorName,
      doctorEmail,
      date,
      patientEmail,
      patientName,
      age,
      sex,
      phoneNumber,
      prescriptionText
    });

    await newPrescription.save();
    res.status(201).json({ message: 'Prescription sent to patient successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPrescriptionsForDoctor = async (req, res) => {
  const { query } = req.query;
  const doctorEmail = req.doctorEmail;

  try {
    const prescriptions = await Prescription.find({
      $and: [
        { doctorEmail: doctorEmail },
        {
          $or: [
            { patientEmail: { $regex: query, $options: 'i' } },
            { patientName: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    });
    res.json(prescriptions);
  } catch (err) {
    console.error('Error fetching prescriptions:', err);
    res.status(500).send({ message: 'Error fetching prescriptions' });
  }
};

const getPrescriptionsForPatient = async (req, res) => {
  const { query } = req.query;
  const patientEmail = req.patientEmail;

  try {
    const prescriptions = await Prescription.find({
      patientEmail: patientEmail,
      $or: [
        { doctorEmail: { $regex: query, $options: 'i' } },
        { doctorName: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(prescriptions);
  } catch (err) {
    console.error('Error fetching prescriptions:', err);
    res.status(500).send({ message: 'Error fetching prescriptions' });
  }
};

const countDistinctPatientsByDoctorEmail = async (req, res) => {
  try {
    const { doctorEmail } = req.query;

    const patientCount = await Prescription.aggregate([
      { $match: { doctorEmail } },
      { $group: { _id: "$patientEmail" } },
      { $count: "count" }
    ]);

    res.status(200).json({ count: patientCount[0]?.count || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  authenticateDoctor,
  authenticatePatient,
  createPrescription,
  getPrescriptionsForDoctor,
  getPrescriptionsForPatient,
  countDistinctPatientsByDoctorEmail,
};