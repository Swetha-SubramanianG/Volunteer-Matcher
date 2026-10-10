import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI } from '../services/api';
import './VolunteerOpportunityDetails.css';

const VolunteerOpportunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data - in real app, fetch from API based on id
  const opportunity = {
    id: id,
    title: "Food Bank Assistant",
    organization: "Community Food Share",
    description: "Help sort and distribute food to families in need. This is a rewarding opportunity to make a direct impact on food security in our community.",
    location: "Downtown Center",
    address: "123 Main Street, Downtown",
    schedule: "Weekends, 9 AM - 1 PM",
    duration: "4 hours per shift",
    requirements: [
      "Ability to lift up to 20 pounds",
      "Friendly and compassionate attitude",
      "Comfortable working in a fast-paced environment"
    ],
    benefits: [
      "Make a direct impact on food security",
      "Work with a supportive team",
      "Flexible scheduling"
    ],
    contact: "volunteer@communityfoodshare.org",
    phone: "(555) 123-4567"
  };

  const handleApply = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setModalType('info');
      setModalTitle('Authentication Required');
      setModalMessage('You need to sign up or login to apply for opportunities. Would you like to sign up now?');
      setShowModal(true);
      return;
    }

    setLoading(true);
    try {
      await applicationsAPI.apply(id);
      setModalType('success');
      setModalTitle('Application Submitted!');
      setModalMessage('Your application has been submitted successfully. The organization will review your application and contact you soon.');
      setShowModal(true);
    } catch (error) {
      setModalType('error');
      setModalTitle('Application Failed');
      setModalMessage(error.message || 'Failed to submit application. Please try again.');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalType === 'info') {
      navigate('/signup');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="opportunity-details-container">
        <button className="back-btn" onClick={() => navigate('/volunteer')}>
          ← Back to Opportunities
        </button>
        
        <div className="opportunity-header">
          <h1>{opportunity.title}</h1>
          <p className="organization-name">{opportunity.organization}</p>
        </div>

        <div className="opportunity-content">
          <div className="opportunity-main">
            <div className="section">
              <h2>About This Opportunity</h2>
              <p>{opportunity.description}</p>
            </div>

            <div className="section">
              <h2>Requirements</h2>
              <ul className="requirements-list">
                {opportunity.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="section">
              <h2>Benefits</h2>
              <ul className="benefits-list">
                {opportunity.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="opportunity-sidebar">
            <div className="info-card">
              <h3>Details</h3>
              <div className="info-item">
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <strong>Location:</strong>
                  <p>{opportunity.location}</p>
                  <p className="address">{opportunity.address}</p>
                </div>
              </div>
              
              <div className="info-item">
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <strong>Schedule:</strong>
                  <p>{opportunity.schedule}</p>
                  <p>{opportunity.duration}</p>
                </div>
              </div>

              <div className="info-item">
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <strong>Contact:</strong>
                  <p>{opportunity.contact}</p>
                  <p>{opportunity.phone}</p>
                </div>
              </div>
            </div>

            <button 
              className={`apply-btn ${loading ? 'disabled' : ''}`}
              onClick={handleApply}
              disabled={loading}
            >
              {loading ? 'Applying...' : isAuthenticated ? 'Apply Now' : 'Sign Up to Apply'}
            </button>
          </div>
        </div>
      </div>
      
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={modalTitle || 'Application Submitted!'}
        message={modalMessage || 'Your application has been submitted successfully. The organization will review your application and contact you soon.'}
        type={modalType}
      />
    </div>
  );
};

export default VolunteerOpportunityDetails;

