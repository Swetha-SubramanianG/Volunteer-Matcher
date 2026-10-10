import React, { useState } from 'react';

const Step4Summary = ({ data, onSubmit }) => {
  const [formData, setFormData] = useState({
    bio: data.bio || '',
    motivation: data.motivation || ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.bio.trim()) {
      newErrors.bio = 'Please tell us about yourself';
    }
    
    if (!formData.motivation.trim()) {
      newErrors.motivation = 'Please share your motivation for volunteering';
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
      <h2>Step 4 – Profile Summary</h2>
      <p className="step-description">Tell us more about yourself and your motivations.</p>

      <div className="form-group">
        <label htmlFor="bio">About You *</label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          className={errors.bio ? 'error' : ''}
          placeholder="Share a bit about yourself..."
          rows={4}
        />
        {errors.bio && <span className="error-message">{errors.bio}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="motivation">Why do you want to volunteer? *</label>
        <textarea
          id="motivation"
          value={formData.motivation}
          onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
          className={errors.motivation ? 'error' : ''}
          placeholder="What motivates you to volunteer?"
          rows={4}
        />
        {errors.motivation && <span className="error-message">{errors.motivation}</span>}
      </div>

      <button type="submit" className="btn btn-primary">
        Next Step
      </button>
    </form>
  );
};

export default Step4Summary;