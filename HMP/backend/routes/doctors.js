const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const {
  doctorRegister,
  doctorLogin,
  getDoctorDetailsByEmail,
  updateDoctorProfile,
  getAllDoctors,
  uploadProfilePicture,
  getProfilePicture,
} = require('../controllers/doctorController');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/doctors'); 
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

router.post('/dregister', doctorRegister);
router.post('/dlogin', doctorLogin);
router.get('/ddetails/email/:email', getDoctorDetailsByEmail);
router.put('/dupdate', updateDoctorProfile);
router.get('/all', getAllDoctors);
router.post('/upload-profile-pic/:id', upload.single('profilePicture'), uploadProfilePicture);
router.get('/profilepic/:id', getProfilePicture);

module.exports = router;