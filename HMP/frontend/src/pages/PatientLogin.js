import React, { useState } from 'react';
import axios from 'axios';
import '../components/styles/PatientLogin.css';
import ECGAnimation from '../components/ECGAnimation';
import { FaSignInAlt } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const PatientLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/patients/plogin', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('patientEmail', email);
      showSuccessToast('Login successful!');
      window.location.href = '/patient-account';
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="patient-login-container">
      <Helmet>
        <title>Patient Portal Page</title>
      </Helmet>
      <h2>Patient Portal</h2>
      <p className="patient-login-quote">
        "Health is the crown on the well person's head that only the ill person can see." - Robin Sharma
      </p>
      <form className="patient-login-form" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
        <button type="submit" className="patient-login-button">
          {loading ? <span>Loading...</span> : <FaSignInAlt />}
        </button>
      </form>
      {loading && <ECGAnimation />}
      <p className="patient-login-signup-prompt">
        Don't have an account? <a href="/patient-signup" className="patient-login-signup-link">Create one here</a>
      </p>
    </div>
  );
};

export default PatientLogin;