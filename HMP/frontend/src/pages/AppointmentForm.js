import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/styles/AppointmentForm.css';
import { Helmet } from 'react-helmet';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const AppointmentForm = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [doctorEmail, setDoctorEmail] = useState('');
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [patientPhone, setPatientPhone] = useState('');

    useEffect(() => {
        axios.get('/api/appointments/departments')
            .then(response => setDepartments(response.data))
            .catch(error => showErrorToast('Error fetching departments.'));
    }, []);
    
    useEffect(() => {
        if (selectedDepartment) {
            axios.get(`/api/appointments/doctors/${selectedDepartment}`)
                .then(response => setDoctors(response.data))
                .catch(error => showErrorToast('Error fetching doctors.'));
        } else {
            setDoctors([]);
        }
    }, [selectedDepartment]);

    useEffect(() => {
        if (selectedDoctor) {
            axios.get(`/api/appointments/doctor/${selectedDoctor}`)
                .then(response => setDoctorEmail(response.data.email))
                .catch(error => showErrorToast('Error fetching doctor email.'));
        } else {
            setDoctorEmail('');
        }
    }, [selectedDoctor]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newAppointment = {
            department: selectedDepartment,
            doctor: selectedDoctor,
            date,
            timeSlot,
            patientName,
            patientEmail,
            patientPhone,
        };

        axios.post('/api/appointments', newAppointment)
            .then(response => {
                showSuccessToast('You have booked the appointment successfully!');
                setSelectedDepartment('');
                setSelectedDoctor('');
                setDate('');
                setTimeSlot('');
                setPatientName('');
                setPatientEmail('');
                setPatientPhone('');
            })
            .catch(error => {
                showErrorToast(error.response?.data?.error || 'Error creating appointment');
            });
    };
    
    return (
        <div className="appointment-form-container">
            <Helmet>
                   <title>Appoinment Page</title>
                </Helmet>
            <form className="appointment-form" onSubmit={handleSubmit}>
                <h2 className="appointment-form-title">Book an Appointment</h2>

                <div className="appointment-row">
                    <div className="appointment-field">
                        <label className="appointment-label">Department</label>
                        <select
                            className="appointment-select"
                            value={selectedDepartment}
                            onChange={e => setSelectedDepartment(e.target.value)}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="appointment-field">
                        <label className="appointment-label">Doctor</label>
                        <select
                            className="appointment-select"
                            value={selectedDoctor}
                            onChange={e => setSelectedDoctor(e.target.value)}
                            required
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map(doctor => (
                                <option key={doctor._id} value={doctor._id}>{doctor.firstName} {doctor.lastName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {doctorEmail && (
                    <div className="appointment-field">
                        <label className="appointment-label">Doctor's Email</label>
                        <input
                            className="appointment-input"
                            type="email"
                            value={doctorEmail}
                            readOnly
                        />
                    </div>
                )}

                <div className="appointment-row">
                    <div className="appointment-field">
                        <label className="appointment-label">Date</label>
                        <input
                            className="appointment-input"
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="appointment-field">
                        <label className="appointment-label">Time Slot</label>
                        <select
                            className="appointment-select"
                            value={timeSlot}
                            onChange={e => setTimeSlot(e.target.value)}
                            required
                        >
                            <option value="">Select Time Slot</option>
                            <option value="9:00-9:20">9:00-9:20</option>
                            <option value="9:30-9:50">9:30-9:50</option>
                            <option value="10:00-10:20">10:00-10:20</option>
                            <option value="10:30-10:50">10:30-10:50</option>
                            <option value="11:00-11:20">11:00-11:20</option>
                            <option value="11:30-11:50">11:30-11:50</option>
                        </select>
                    </div>
                </div>

                <div className="appointment-row">
                    <div className="appointment-field">
                        <label className="appointment-label">Patient Name</label>
                        <input
                            className="appointment-input"
                            type="text"
                            value={patientName}
                            onChange={e => setPatientName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="appointment-field">
                        <label className="appointment-label">Patient Email</label>
                        <input
                            className="appointment-input"
                            type="email"
                            value={patientEmail}
                            onChange={e => setPatientEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="appointment-field">
                    <label className="appointment-label">Patient Phone</label>
                    <input
                        className="appointment-input"
                        type="tel"
                        value={patientPhone}
                        onChange={e => setPatientPhone(e.target.value)}
                        required
                    />
                </div>

                <div className="appointment-field">
                    <button type="submit" className="appointment-button">
                        Book Appointment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppointmentForm;