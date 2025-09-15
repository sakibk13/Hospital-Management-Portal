const SupportRequest = require('../models/Support');
const nodemailer = require('nodemailer');
require('dotenv').config();

const EMAIL_USER = process.env.EMAIL;
const EMAIL_PASS = process.env.PASS;

const submitSupportRequest = async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    const supportRequest = new SupportRequest({ name, email, phone, message });
    await supportRequest.save();
    res.status(201).send('Support request submitted successfully.');
  } catch (error) {
    res.status(500).send('Server error. Please try again later.');
  }
};

const getAllSupportRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).send('Server error. Please try again later.');
  }
};

const respondToSupportRequest = async (req, res) => {
  const { solution } = req.body;
  const { id } = req.params;

  try {
    const request = await SupportRequest.findById(id);
    if (!request) {
      return res.status(404).send('Support request not found.');
    }

    request.solution = solution;
    request.status = 'Resolved';
    await request.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: request.email,
      subject: 'Resolution of Your Support Request - HealingWave Health Service',
      text: `Dear ${request.name},\n\nWe hope this message finds you well. We are pleased to inform you that your recent support request has been successfully resolved. Below, you will find the solution provided:\n\n${solution}\n\nIf you have any further questions or concerns, please do not hesitate to reach out to us.\n\nBest regards,\nHealingWave Health Service Team`
    };
    
    await transporter.sendMail(mailOptions);

    res.status(200).send('Response sent to user successfully.');
  } catch (error) {
    res.status(500).send('Server error. Please try again later.');
  }
};

module.exports = {
  submitSupportRequest,
  getAllSupportRequests,
  respondToSupportRequest,
};