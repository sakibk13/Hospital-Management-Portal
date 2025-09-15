const WardBook = require('../models/wardBook');
const HealthCard = require('../models/HealthCard');

const getAvailableWards = async (req, res) => {
  try {
    const wards = await WardBook.find({ isBooked: false });
    res.json(wards);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const bookWard = async (req, res) => {
  const {
    wardType,
    floor,
    wardNo,
    patientName,
    email,
    phone,
    totalDays,
    bookedDate
  } = req.body;

  try {
    const existingBooking = await WardBook.findOne({
      wardType,
      floor,
      wardNo,
      isBooked: true
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Selected ward is not available.' });
    }

    const totalBill = totalDays * 1500;

    const newBooking = new WardBook({
      wardType,
      floor,
      wardNo,
      patientName,
      email,
      phone,
      totalDays,
      bookedDate,
      totalBill,
      isBooked: true
    });

    await newBooking.save();

    res.json({ message: 'Ward bookeds successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const getWardBillsByPatientEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const wardBills = await WardBook.find({ email });
    res.json(wardBills);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const payWardBill = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body; // Assuming email is passed in the body for health card lookup

  try {
    const wardBill = await WardBook.findById(id);
    if (!wardBill) {
      return res.status(404).json({ message: 'Ward bill not found' });
    }

    if (wardBill.paid) {
      return res.status(400).json({ message: 'Bill already paid' });
    }

    const healthCard = await HealthCard.findOne({ email });
    if (!healthCard) {
      return res.status(404).json({ message: 'Health card not found' });
    }

    if (healthCard.topUpAmount < wardBill.totalBill) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    healthCard.topUpAmount -= wardBill.totalBill;
    await healthCard.save();
    wardBill.paid = true;
    await wardBill.save();

    res.json({ message: 'Payment successful', card: healthCard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAvailableWards,
  bookWard,
  getWardBillsByPatientEmail,
  payWardBill,
};