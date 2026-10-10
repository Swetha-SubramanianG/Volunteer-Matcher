import React, { useState } from 'react';

const Step3Skills = ({ data, onSubmit }) => {
  const [formData, setFormData] = useState({
    skills: data.skills || [],
    interests: data.interests || [],
    experienceLevel: data.experienceLevel || ''
  });

  const [errors, setErrors] = useState({});

  const skillOptions = ['Teaching', 'Cooking', 'First Aid', 'Cleaning', 'Driving', 'Photography', 'Web Development'];
  const interestAreas = ['Health', 'Education', 'Environment', 'Disaster Relief', 'Animal Welfare', 'Elder Care'];
  const experienceLevels = ['Beginner', 'Intermediate', 'Expert'];

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }
    
    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest area';
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

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="registration-step">
      <h2>Step 3 – Skills & Interests</h2>
      <p className="step-description">Tell us about your skills and what interests you.</p>

      <div className="form-group">
        <label>Skills *</label>
        <div className="checkbox-group">
          {skillOptions.map(skill => (
            <label key={skill} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.skills.includes(skill)}
                onChange={() => handleCheckboxChange('skills', skill)}
              />
              {skill}
            </label>
          ))}
        </div>
        {errors.skills && <span className="error-message">{errors.skills}</span>}
      </div>

      <div className="form-group">
        <label>Interest Areas *</label>
        <div className="checkbox-group">
          {interestAreas.map(area => (
            <label key={area} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.interests.includes(area)}
                onChange={() => handleCheckboxChange('interests', area)}
              />
              {area}
            </label>
          ))}
        </div>
        {errors.interests && <span className="error-message">{errors.interests}</span>}
      </div>

      <div className="form-group">
        <label>Experience Level</label>
        <div className="radio-group">
          {experienceLevels.map(level => (
            <label key={level} className="radio-label">
              <input
                type="radio"
                name="experienceLevel"
                value={level}
                checked={formData.experienceLevel === level}
                onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Next Step
      </button>
    </form>
  );
};

export default Step3Skills;