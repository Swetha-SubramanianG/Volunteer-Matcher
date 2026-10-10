import React, { useState } from 'react';

const Step5Preferences = ({ data, onSubmit }) => {
  const [formData, setFormData] = useState({
    taskType: data.taskType || '',
    notifications: data.notifications ?? true,
    termsAccepted: data.termsAccepted || false
  });

  const [errors, setErrors] = useState({});

  const taskTypes = ['Individual', 'Group', 'Remote'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.taskType) {
      newErrors.taskType = 'Please select a preferred task type';
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
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

  return (
    <form onSubmit={handleSubmit} className="registration-step">
      <h2>Step 5 – Preferences & Consent</h2>
      <p className="step-description">Final step! Set your preferences and review terms.</p>

      <div className="form-group">
        <label>Preferred Task Type *</label>
        <div className="radio-group">
          {taskTypes.map(type => (
            <label key={type} className="radio-label">
              <input
                type="radio"
                name="taskType"
                value={type}
                checked={formData.taskType === type}
                onChange={(e) => setFormData(prev => ({ ...prev, taskType: e.target.value }))}
              />
              {type}
            </label>
          ))}
        </div>
        {errors.taskType && <span className="error-message">{errors.taskType}</span>}
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.notifications}
            onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
          />
          Receive notifications about new opportunities
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
          />
          I accept the terms and conditions *
        </label>
        {errors.termsAccepted && <span className="error-message">{errors.termsAccepted}</span>}
      </div>

      <button type="submit" className="btn btn-primary">
        Complete Registration
      </button>
    </form>
  );
};

export default Step5Preferences;