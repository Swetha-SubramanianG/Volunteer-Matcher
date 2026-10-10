import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";

import { applicationsAPI } from "../../services/api";

import "../../styles/global.css";
import "./OrganizationOpportunities.css";



const OrganizationOpportunities = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [modalType, setModalType] = useState('success');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data - in real app, fetch from API based on organization id
  const organization = {
    id: id,
    name: "Community Food Share",
    category: "Food & Hunger",
    location: "Downtown",
    volunteers: 45,
    description: "Fighting hunger and providing nutritious food to families in need across the city."
  };

  const opportunities = [
    {
      id: 1,
      title: "Food Bank Assistant",
      description: "Help sort and distribute food to families in need.",
      schedule: "Weekends, 9 AM - 1 PM",
      location: "Downtown Center",
      spots: { filled: 8, total: 12 }
    },
    {
      id: 2,
      title: "Food Distribution Driver",
      description: "Deliver food packages to families in need.",
      schedule: "Weekdays, 10 AM - 2 PM",
      location: "Various Locations",
      spots: { filled: 3, total: 6 }
    },
    {
      id: 3,
      title: "Warehouse Organizer",
      description: "Organize and manage food inventory in our warehouse.",
      schedule: "Flexible Schedule",
      location: "Main Warehouse",
      spots: { filled: 5, total: 8 }
    }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Food & Hunger":
        return "🍽️";
      case "Youth & Education":
        return "🎓";
      case "Animal Welfare":
        return "🐾";
      case "Environment":
        return "🌱";
      case "Elder Care":
        return "👴";
      case "Arts & Culture":
        return "🎨";
      default:
        return "🏢";
    }
  };

  return (
    <div>
      <Navbar />
      <div className="org-opportunities-container">
        <button className="back-btn" onClick={() => navigate('/organization')}>
          ← Back to Organizations
        </button>

        <div className="org-header">
          <div className="org-info">
            <span className="org-category">{getCategoryIcon(organization.category)} {organization.category}</span>
            <h1>{organization.name}</h1>
            <p className="org-description">{organization.description}</p>
            <div className="org-stats">
              <div className="stat-item">
                <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{organization.location}</span>
              </div>
              <div className="stat-item">
                <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{organization.volunteers} volunteers</span>
              </div>
            </div>
          </div>
        </div>

        <div className="opportunities-section">
          <h2>Available Opportunities</h2>
          <div className="opportunities-grid">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="opportunity-card">
                <h3>{opportunity.title}</h3>
                <p className="opportunity-description">{opportunity.description}</p>
                
                <div className="opportunity-details">
                  <div className="detail-item">
                    <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{opportunity.location}</span>
                  </div>
                  
                  <div className="detail-item">
                    <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{opportunity.schedule}</span>
                  </div>
                  
                  <div className="detail-item">
                    <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{opportunity.spots.filled}/{opportunity.spots.total} spots filled</span>
                  </div>
                </div>
                
                <button 
                  className={`apply-opportunity-btn ${loading ? 'disabled' : ''}`}
                  onClick={async () => {
                    setSelectedOpportunity(opportunity);
                    
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
                      await applicationsAPI.apply(opportunity.id);
                      setModalType('success');
                      setModalTitle('Application Submitted!');
                      setModalMessage(`Your application for "${opportunity.title}" has been submitted successfully. The organization will review your application and contact you soon.`);
                      setShowModal(true);
                    } catch (error) {
                      setModalType('error');
                      setModalTitle('Application Failed');
                      setModalMessage(error.message || 'Failed to submit application. Please try again.');
                      setShowModal(true);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? 'Applying...' : isAuthenticated ? 'Apply Now' : 'Sign Up to Apply'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          if (modalType === 'info') {
            navigate('/signup');
          }
        }}
        title={modalTitle || 'Application Submitted!'}
        message={modalMessage || (selectedOpportunity 
          ? `Your application for "${selectedOpportunity.title}" has been submitted successfully. The organization will review your application and contact you soon.`
          : "Your application has been submitted successfully.")
        }
        type={modalType}
      />
    </div>
  );
};

export default OrganizationOpportunities;

