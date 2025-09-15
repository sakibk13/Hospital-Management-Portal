const TestOrService = require('../models/TestOrService');

const createTestOrService = async (req, res) => {
  try {
    const { name, price, type } = req.body;
    if (!['Test', 'Service'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Must be "Test" or "Service".' });
    }
    const newItem = new TestOrService({ name, price, type });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllTestOrServices = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const items = await TestOrService.find(filter);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTestOrService,
  getAllTestOrServices,
};