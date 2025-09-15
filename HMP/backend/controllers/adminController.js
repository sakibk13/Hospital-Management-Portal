const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
require('dotenv').config();

const adminCredentials = { username: 'admin', password: 'admin' };
const JWT_SECRET = process.env.JWT_SECRET;

const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (username === adminCredentials.username && password === adminCredentials.password) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addDoctor = async (req, res) => {
  const { firstName, lastName, email, sex, dateOfBirth, mobileNumber, password } = req.body;
  try {
    const newDoctor = new Doctor({
      firstName, lastName, email, sex, dateOfBirth, mobileNumber, password
    });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addPatient = async (req, res) => {
  const { firstName, lastName, email, sex, dateOfBirth, mobileNumber, password } = req.body;
  try {
    const newPatient = new Patient({
      firstName, lastName, email, sex, dateOfBirth, mobileNumber, password
    });
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const doctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePatient = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const patient = await Patient.findByIdAndUpdate(id, updateData, { new: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  adminLogin,
  getAllDoctors,
  getAllPatients,
  addDoctor,
  addPatient,
  updateDoctor,
  updatePatient,
  deleteDoctor,
  deletePatient,
};