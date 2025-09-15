const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const path = require('path');

const doctorRegister = async (req, res) => {
    const { firstName, lastName, email, sex, dateOfBirth, mobileNumber, password } = req.body;

    try {
        const existingDoctor = await Doctor.findOne({ $or: [{ email }, { mobileNumber }] });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Email or mobile number already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newDoctor = new Doctor({
            firstName,
            lastName,
            email,
            sex,
            dateOfBirth,
            mobileNumber,
            password: hashedPassword
        });

        await newDoctor.save();
        res.status(201).json({ message: 'Doctor registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const doctorLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const payload = {
            doctor: {
                id: doctor.id
            }
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getDoctorDetailsByEmail = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ email: req.params.email });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateDoctorProfile = async (req, res) => {
    const { email, firstName, lastName, bloodGroup, age, degrees, institute, specialty, department, availability } = req.body;

    try {
        const doctor = await Doctor.findOneAndUpdate(
            { email },
            { firstName, lastName, bloodGroup, age, degrees, institute, specialty, department, availability },
            { new: true }
        );

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json({ message: 'Profile updated successfully', doctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const department = req.query.department;
        const query = department ? { department } : {};
        const doctors = await Doctor.find(query).sort({ department: 1 });
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const uploadProfilePicture = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        doctor.profilePicture = `/uploads/doctors/${req.file.filename}`;
        await doctor.save();

        res.json({ profilePicture: doctor.profilePicture });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ message: 'Failed to upload profile picture.' });
    }
};

const getProfilePicture = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor || !doctor.profilePicture) {
            return res.status(404).json({ message: 'Profile picture not found' });
        }

        const profilePicPath = path.join(__dirname, '..' , '..' , doctor.profilePicture);
        res.sendFile(profilePicPath);
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        res.status(500).json({ message: 'Failed to fetch profile picture.' });
    }
};

module.exports = {
  doctorRegister,
  doctorLogin,
  getDoctorDetailsByEmail,
  updateDoctorProfile,
  getAllDoctors,
  uploadProfilePicture,
  getProfilePicture,
};