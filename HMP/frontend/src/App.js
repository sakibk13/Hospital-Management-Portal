import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bulma/css/bulma.min.css';

import NavbarComponent from './components/Navbar';
import Home from './pages/Home';
import DoctorSignUp from './pages/DoctorSignUp';
import PatientSignUp from './pages/PatientSignUp';
import DoctorLogin from './pages/DoctorLogin';
import PatientLogin from './pages/PatientLogin';
import DoctorAccount from './pages/DoctorAccount';
import PatientAccount from './pages/PatientAccount';
import DoctorProfile from './pages/DoctorProfile';
import PatientProfile from './pages/PatientProfile';
import DoctorDetails from './pages/DoctorDetails';
import PatientDetails from './pages/PatientDetails';
import PrescriptionForm from './pages/PrescriptionForm';
import About from './pages/About';
import ViewPrescription from './pages/ViewPrescription';
import PatientPrescription from './pages/PatientPrescription';
import BookWard from './pages/BookWard';
import BookCabin from './pages/BookCabin';
import HealthCard from './pages/HealthCard';
import AdmissionBill from './pages/AdmissionBill';
import TestBill from './pages/TestBill';
import MedicineBill from './pages/MedicineBill';
import Items from './pages/Items';
import TestService from './pages/TestService';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageUsers from './pages/AdminManageUsers';
import AddMedicine from './pages/AddMedicine';
import MedicineDetails from './pages/MedicineDetails';
import Pharmacy from './pages/Pharmacy';
import BuyMedicine from './pages/BuyMedicine';
import Chatbot from './pages/Chatbot';
import BloodBank from './pages/BloodBank';
import BloodDonor from './pages/BloodDonor';
import BloodAvailability from './pages/BloodAvailability';
import BloodGroupDetails from './pages/BloodGroupDetails';
import BloodRecipient from './pages/BloodRecipient';
import AppointmentForm from './pages/AppointmentForm';
import AppointmentDetails from './pages/AppointmentDetails';
import ViewAppointment from './pages/ViewAppointment';
import NewsTicker from './components/NewsTicker';
import SupportForm from './pages/SupportForm';
import AdminSupport from './pages/AdminSupport';

function App() {
  return (
    <Router>
      <div className="App">
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor-signup" element={<DoctorSignUp />} />
          <Route path="/patient-signup" element={<PatientSignUp />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/doctor-account" element={<DoctorAccount />} />
          <Route path="/patient-account" element={<PatientAccount />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="/patient-profile" element={<PatientProfile />} />
          <Route path="/doctor-details" element={<DoctorDetails />} />
          <Route path="/patient-details" element={<PatientDetails />} />
          <Route path="/add-prescription" element={<PrescriptionForm/>} />
          <Route path="/view-prescription" element={<ViewPrescription/>} />
          <Route path="/patient-prescription" element={<PatientPrescription/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/book-ward" element={<BookWard/>} />
          <Route path="/book-cabin" element={<BookCabin/>} />
          <Route path="/health-card" element={<HealthCard/>} />
         <Route path="/admission-bill" element={<AdmissionBill/>} />
         <Route path="/test-bill" element={<TestBill/>} />
         <Route path="/items" element={<Items/>} />
         <Route path="/test-service" element={<TestService/>} />
         <Route path="/admin-login" element={<AdminLogin/>} />
         <Route path="/admin-dashboard" element={<AdminDashboard/>} />
         <Route path="/add-medicine" element={<AddMedicine/>} />
         <Route path="/medicine-details" element={<MedicineDetails/>} />
         <Route path="/pharmacy" element={<Pharmacy/>} />
         <Route path="/buy-medicine" element={<BuyMedicine/>} />
         <Route path="/medicine-bill" element={<MedicineBill/>} />
         <Route path="/chat-bot" element={<Chatbot/>} />
         <Route path="/blood-bank" element={<BloodBank/>} />
         <Route path="/blood-donor" element={<BloodDonor/>} />
         <Route path="/blood-availability" element={<BloodAvailability/>} />
         <Route path="/blood-group" element={<BloodGroupDetails/>} />
         <Route path="/blood-recipient" element={<BloodRecipient/>} />
         <Route path="/appointment-form" element={<AppointmentForm/>} />
         <Route path="/appointment-details" element={<AppointmentDetails/>} />
         <Route path="/view-appointment" element={<ViewAppointment/>} />
         <Route path="/admin-manage-users" element={<AdminManageUsers/>} />
         <Route path="/news-ticker" element={<NewsTicker/>} />
         <Route path="/support" element={<SupportForm/>} />
         <Route path="/admin-support" element={<AdminSupport/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;