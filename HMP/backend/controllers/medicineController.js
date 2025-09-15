const Medicine = require('../models/Medicine');
const path = require('path');

const addMedicine = async (req, res) => {
  try {
    const { name, genericName, dosageForm, strength, price, strip, manufacturer, description } = req.body;
    const image = req.file ? `/uploads/medicines/${req.file.filename}` : '';

    const newMedicine = new Medicine({
      name,
      genericName,
      dosageForm,
      strength,
      price,
      strip,
      manufacturer,
      description,
      image,
    });

    await newMedicine.save();
    res.status(201).json({ message: 'Medicine added to the list successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add medicine.', error: err.message });
  }
};

const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch medicines.', error: err.message });
  }
};

const updateMedicineStock = async (req, res) => {
  const { id } = req.params;
  const { operation, strip } = req.body; // 'operation' can be 'increase' or 'decrease'

  try {
    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (operation === 'increase') {
      medicine.strip += strip;
    } else if (operation === 'decrease') {
      medicine.strip -= strip;
      if (medicine.strip < 0) {
        medicine.strip = 0; // Ensure strip count doesn't go negative
      }
    } else {
      // If no operation specified, assume direct update of 'strip'
      medicine.strip = strip;
    }

    await medicine.save();
    res.status(200).json({ message: 'Medicine stock updated successfully', updatedMedicine: medicine });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update medicine stock', error: error.message });
  }
};

module.exports = {
  addMedicine,
  getAllMedicines,
  updateMedicineStock,
};