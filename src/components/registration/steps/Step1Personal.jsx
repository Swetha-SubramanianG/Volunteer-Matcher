import React, { useState } from 'react';

const Step1Personal = ({ data, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: data.fullName || '',
    email: data.email || '',
    password: data.password || '',
    phoneNumber: data.phoneNumber || '',
    profilePicture: data.profilePicture || null
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="registration-step">
      <h2>Step 1 – Personal Information</h2>
      <p className="step-description">Tell us about yourself to get started.</p>

      <div className="form-group">
        <label htmlFor="fullName">Full Name *</label>
        <input
          type="text"
          id="fullName"
          value={formData.fullName}
          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          className={errors.fullName ? 'error' : ''}
          placeholder="Enter your full name"
        />
        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className={errors.email ? 'error' : ''}
          placeholder="your.email@example.com"
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          className={errors.password ? 'error' : ''}
          placeholder="Create a secure password"
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number (Optional)</label>
        <input
          type="tel"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
          placeholder="Enter your phone number"
        />
      </div>

      <div className="form-group">
        <label htmlFor="profilePicture">Profile Picture (Optional)</label>
        <input
          type="file"
          id="profilePicture"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Next Step
      </button>
    </form>
  );
};

export default Step1Personal;