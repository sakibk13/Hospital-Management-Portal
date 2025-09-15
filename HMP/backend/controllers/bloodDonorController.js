const BloodDonor = require('../models/BloodDonor');
const BloodAvailability = require('../models/BloodAvailability');

const daysBetween = (date1, date2) => {
  const diff = Math.abs(new Date(date1) - new Date(date2));
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const registerBloodDonor = async (req, res) => {
  try {
    const { firstName, lastName, gender, email, phoneNumber, bloodGroup, donatedBefore, lastDonationDate } = req.body;
    
    if (donatedBefore === 'yes') {
      const lastDonation = new Date(lastDonationDate);
      const currentDate = new Date();
      const daysSinceLastDonation = daysBetween(lastDonation, currentDate);
      
      if (daysSinceLastDonation < 90) {
        return res.status(400).json({ message: 'You must wait at least 90 days between donations.' });
      }
    }

    const newDonor = new BloodDonor({
      firstName,
      lastName,
      gender,
      email,
      phoneNumber,
      bloodGroup,
      donatedBefore,
      lastDonationDate: donatedBefore === 'yes' ? lastDonationDate : null
    });

    await newDonor.save();
    
    await BloodAvailability.findOneAndUpdate(
      { bloodGroup },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again.' });
  }
};

const getAllBloodDonors = async (req, res) => {
  try {
    const donors = await BloodDonor.find({}, 'firstName lastName phoneNumber gender email bloodGroup').lean();
    res.status(200).json(donors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again.' });
  }
};

module.exports = {
  registerBloodDonor,
  getAllBloodDonors,
};