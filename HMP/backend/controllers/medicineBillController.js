const Medicine = require('../models/Medicine');
const MedicineBill = require('../models/MedicineBill');
const HealthCard = require('../models/HealthCard');

const purchaseMedicines = async (req, res) => {
  const { name, email, phoneNumber, address, selectedMedicines } = req.body;

  try {
    let totalBill = 0;
    const billDetails = [];

    for (const item of selectedMedicines) {
      const { medicineId, quantity } = item;
      const medicine = await Medicine.findById(medicineId);

      if (!medicine || medicine.strip < quantity) {
        return res.status(400).json({ message: `Medicine ${medicineId} is out of stock or quantity exceeds available stock` });
      }

      medicine.strip -= quantity;
      await medicine.save();

      const totalPrice = medicine.price * quantity;
      totalBill += totalPrice;

      billDetails.push({
        medicineId,
        quantity,
        totalPrice,
      });
    }

    const newBill = new MedicineBill({
      name,
      email,
      phoneNumber,
      address,
      medicines: billDetails,
      totalBill,
      paid: false
    });
    await newBill.save();

    res.status(201).json({ message: 'Bill submitted', totalBill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBillsByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const bills = await MedicineBill.find({ email }).populate('medicines.medicineId', 'name price');
    if (!bills.length) {
      return res.status(404).json({ message: 'No bills found for this email.' });
    }
    res.status(200).json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const payMedicineBill = async (req, res) => {
  const { billId } = req.params;
  const { email } = req.body;

  try {
    const bill = await MedicineBill.findById(billId);
    const healthCard = await HealthCard.findOne({ email });

    if (!bill || !healthCard) {
      return res.status(404).json({ message: 'Bill or Health Card not found' });
    }

    if (bill.paid) {
      return res.status(400).json({ message: 'Bill already paid' });
    }

    if (bill.totalBill > healthCard.topUpAmount) {
      return res.status(400).json({ message: 'Insufficient points in health card' });
    }

    healthCard.topUpAmount -= bill.totalBill;
    await healthCard.save();

    bill.paid = true;
    await bill.save();

    res.status(200).json({ message: 'Bill paid successfully', bill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  purchaseMedicines,
  getBillsByEmail,
  payMedicineBill,
};