const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
    department: { type: String, required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    doctorName: { type: String, required: true },
    doctorEmail: { type: String, required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientPhone: { type: String, required: true },
    status: { type: String, default: 'pending' }, 
    paymentRequest: { type: String, default: 'request payment' }, 
    paidStatus: { type: String, default: 'unpaid' }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
