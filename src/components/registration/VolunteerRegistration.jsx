import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1Personal from './steps/Step1Personal';
import Step2Location from './steps/Step2Location';
import Step3Skills from './steps/Step3Skills';
import Step4Summary from './steps/Step4Summary';
import Step5Preferences from './steps/Step5Preferences';
import ProgressBar from './ProgressBar';

const VolunteerRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Personal
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    profilePicture: null,
    // Step 2 - Location
    location: '',
    preferredArea: '',
    availability: [],
    timeSlots: [],
    // Step 3 - Skills
    skills: [],
    interests: [],
    experienceLevel: '',
    // Step 4 - Summary
    bio: '',
    motivation: '',
    // Step 5 - Preferences
    taskType: '',
    notifications: true,
    termsAccepted: false
  });

  const handleStepSubmit = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));

    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final submission
      console.log('Final form data:', { ...formData, ...stepData });
      // TODO: Submit to backend
      navigate('/volunteer/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const steps = [
    <Step1Personal key="1" data={formData} onSubmit={handleStepSubmit} />,
    <Step2Location key="2" data={formData} onSubmit={handleStepSubmit} />,
    <Step3Skills key="3" data={formData} onSubmit={handleStepSubmit} />,
    <Step4Summary key="4" data={formData} onSubmit={handleStepSubmit} />,
    <Step5Preferences key="5" data={formData} onSubmit={handleStepSubmit} />
  ];

  return (
    <div className="registration-container">
      <ProgressBar currentStep={currentStep} totalSteps={5} />

      <div className="registration-form registration-step">
        <h1>Volunteer Registration</h1>

        {steps[currentStep - 1]}

        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" onClick={handleBack} className="btn btn-ghost">
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerRegistration;