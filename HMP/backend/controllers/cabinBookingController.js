const CabinBooking = require('../models/cabinBook');
const HealthCard = require('../models/HealthCard');

const getAvailableCabins = async (req, res) => {
  try {
    const cabins = await CabinBooking.find({ isBooked: false });
    res.json(cabins);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const bookCabin = async (req, res) => {
  const {
    cabinType,
    floor,
    cabinNo,
    patientName,
    email,
    phone,
    totalDays,
    bookedDate
  } = req.body;

  try {
    const existingBooking = await CabinBooking.findOne({
      cabinType,
      floor,
      cabinNo,
      isBooked: true
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Selected cabin is not available.' });
    }

    const totalBill = totalDays * (cabinType === 'single' ? 2000 : 2500);

    const newBooking = new CabinBooking({
      cabinType,
      floor,
      cabinNo,
      patientName,
      email,
      phone,
      totalDays,
      bookedDate,
      totalBill,
      isBooked: true
    });

    await newBooking.save();

    res.json({ message: 'Cabin booked successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const getCabinBillsByPatientEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const cabinBills = await CabinBooking.find({ email });
    res.json(cabinBills);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const payCabinBill = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body; // Assuming email is passed in the body for health card lookup

  try {
    const cabinBill = await CabinBooking.findById(id);
    if (!cabinBill) {
      return res.status(404).json({ message: 'Cabin bill not found' });
    }

    if (cabinBill.paid) {
      return res.status(400).json({ message: 'Bill already paid' });
    }

    const healthCard = await HealthCard.findOne({ email });
    if (!healthCard) {
      return res.status(404).json({ message: 'Health card not found' });
    }

    if (healthCard.topUpAmount < cabinBill.totalBill) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    healthCard.topUpAmount -= cabinBill.totalBill;
    await healthCard.save();
    cabinBill.paid = true;
    await cabinBill.save();

    res.json({ message: 'Payment successful', card: healthCard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAvailableCabins,
  bookCabin,
  getCabinBillsByPatientEmail,
  payCabinBill,
};