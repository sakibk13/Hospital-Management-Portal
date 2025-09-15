const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addMedicine, getAllMedicines, updateMedicineStock } = require('../controllers/medicineController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/medicines/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/add', upload.single('image'), addMedicine);
router.get('/', getAllMedicines);
router.put('/:id', updateMedicineStock);

module.exports = router;