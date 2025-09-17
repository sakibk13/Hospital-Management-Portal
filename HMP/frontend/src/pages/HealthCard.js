import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/styles/HealthCard.css';
import healingWave from '../assets/healingwave.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const HealthCard = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phoneNumber: '',
    bloodGroup: ''
  });
  const [topUpAmount, setTopUpAmount] = useState('');
  const [cardData, setCardData] = useState(null);

  const { patientName, email, phoneNumber, bloodGroup } = formData;

  useEffect(() => {
    const savedEmail = localStorage.getItem('patientEmail');
    if (savedEmail) {
      fetchCardData(savedEmail);
    }
  }, []);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/healthCards/register', formData);
      setCardData(res.data);
      showSuccessToast('Registration successful');
      localStorage.setItem('patientEmail', email);
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleTopUp = async e => {
    e.preventDefault();
    if (!topUpAmount) {
      showErrorToast('Top-up amount is required');
      return;
    }
    try {
      const email = localStorage.getItem('patientEmail');
      if (!email) {
        showErrorToast('User email not found');
        return;
      }
      const res = await axios.put('/api/healthCards/topup', { topUpAmount }, {
        headers: {
          'Authorization': email
        }
      });
      setCardData(res.data.card);
      showSuccessToast('Top-up successful');
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Top-up failed');
    }
  };

  const fetchCardData = async (email) => {
    try {
      const res = await axios.get(`/api/healthCards/${email}`);
      setCardData(res.data);
    } catch (error) {
      console.error(error);
      showErrorToast('Health card not found');
    }
  };

  return (
    <div className="health-card-container">
       <Helmet>
        <title>Health Card Page</title>
      </Helmet>
      <div className="form-container">
        <div className="registration-form">
          <h2>Register Health Card</h2>
          <form onSubmit={onSubmit}>
            <input type="text" name="patientName" placeholder="Patient Name" value={patientName} onChange={onChange} required />
            <input type="email" name="email" placeholder="Email" value={email} onChange={onChange} required />
            <input type="text" name="phoneNumber" placeholder="Phone Number" value={phoneNumber} onChange={onChange} required />
            <input type="text" name="bloodGroup" placeholder="Blood Group" value={bloodGroup} onChange={onChange} required />
            <button type="submit">Register</button>
          </form>
          <form className="top-up-form" onSubmit={handleTopUp}>
            <input type="number" value={topUpAmount} onChange={e => setTopUpAmount(e.target.value)} placeholder="Enter Amount" required />
            <button type="submit">Top Up</button>
          </form>
        </div>
        {cardData && (
          <div className="health-card">
            <div className="health-card-left">
              <img src={healingWave} alt="Healing Wave" className="health-card-image" />
            </div>
            <div className="health-card-right">
              <p className="health-card-name">{cardData.patientName.toUpperCase()}</p>
              <p className="health-card-title">GENERAL PATIENT</p>
              <p><FontAwesomeIcon icon={faPhone} /> {cardData.phoneNumber}</p>
              <p><FontAwesomeIcon icon={faEnvelope} /> {cardData.email}</p>
              <p className="health-card-points">Points: {cardData.topUpAmount}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCard;