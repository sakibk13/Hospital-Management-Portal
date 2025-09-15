const TestAndServicesBill = require('../models/TestAndServicesBill');
const HealthCard = require('../models/HealthCard');

const createTestAndServicesBill = async (req, res) => {
  try {
    const {
      doctorName,
      doctorEmail,
      patientName,
      patientEmail,
      phoneNumber,
      selectedItems
    } = req.body;

    if (!doctorName || !doctorEmail || !patientName || !patientEmail || !phoneNumber || !selectedItems) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newBill = new TestAndServicesBill({
      doctorName,
      doctorEmail,
      patientName,
      patientEmail,
      phone: phoneNumber,
      selectedItems,
      totalBill: selectedItems.reduce((total, item) => total + item.price, 0)
    });

    await newBill.save();
    res.status(201).json({ message: 'Bill sent to the patient succesfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to add bill' });
  }
};

const getTestAndServicesBillsByPatientEmail = async (req, res) => {
  try {
    const bills = await TestAndServicesBill.find({ patientEmail: req.params.email });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
};

const payTestAndServicesBill = async (req, res) => {
  try {
    const { email } = req.body; // Assuming email is passed in the body for health card lookup

    const bill = await TestAndServicesBill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    const healthCard = await HealthCard.findOne({ email });
    if (!healthCard) {
      return res.status(404).json({ error: 'Health card not found' });
    }

    if (bill.totalBill > healthCard.topUpAmount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    bill.paid = true;
    await bill.save();

    healthCard.topUpAmount -= bill.totalBill;
    await healthCard.save();

    res.json({ message: 'Payment successful', bill });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process payment' });
  }
};

module.exports = {
  createTestAndServicesBill,
  getTestAndServicesBillsByPatientEmail,
  payTestAndServicesBill,
};