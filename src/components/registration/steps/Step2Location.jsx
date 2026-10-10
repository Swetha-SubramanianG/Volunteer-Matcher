import React, { useState } from 'react';

const Step2Location = ({ data, onSubmit }) => {
  const [formData, setFormData] = useState({
    location: data.location || '',
    preferredArea: data.preferredArea || '',
    availability: data.availability || [],
    timeSlots: data.timeSlots || []
  });

  const [errors, setErrors] = useState({});

  const availabilityOptions = ['Weekdays', 'Weekends', 'Anytime'];
  const timeSlotOptions = ['Morning', 'Afternoon', 'Evening'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.availability.length === 0) {
      newErrors.availability = 'Please select at least one availability option';
    }
    
    if (formData.timeSlots.length === 0) {
      newErrors.timeSlots = 'Please select at least one time slot';
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
      <h2>Step 2 – Location & Availability</h2>
      <p className="step-description">Let us know where and when you'd like to volunteer.</p>

      <div className="form-group">
        <label htmlFor="location">Current Location *</label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          className={errors.location ? 'error' : ''}
          placeholder="Enter your current location"
        />
        {errors.location && <span className="error-message">{errors.location}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="preferredArea">Preferred Volunteering Area (Optional)</label>
        <input
          type="text"
          id="preferredArea"
          value={formData.preferredArea}
          onChange={(e) => setFormData(prev => ({ ...prev, preferredArea: e.target.value }))}
          placeholder="e.g., Coimbatore, Erode"
        />
      </div>

      <div className="form-group">
        <label>Availability *</label>
        <div className="checkbox-group">
          {availabilityOptions.map(option => (
            <label key={option} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.availability.includes(option)}
                onChange={() => handleCheckboxChange('availability', option)}
              />
              {option}
            </label>
          ))}
        </div>
        {errors.availability && <span className="error-message">{errors.availability}</span>}
      </div>

      <div className="form-group">
        <label>Time Slots *</label>
        <div className="checkbox-group">
          {timeSlotOptions.map(slot => (
            <label key={slot} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.timeSlots.includes(slot)}
                onChange={() => handleCheckboxChange('timeSlots', slot)}
              />
              {slot}
            </label>
          ))}
        </div>
        {errors.timeSlots && <span className="error-message">{errors.timeSlots}</span>}
      </div>

      <button type="submit" className="btn btn-primary">
        Next Step
      </button>
    </form>
  );
};

export default Step2Location;