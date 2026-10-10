import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VolunteerModule.css';

const VolunteerModule = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(new Set());

  const opportunities = [
    {
      id: 1,
      title: "Food Bank Assistant",
      organization: "Community Food Share",
      description: "Help sort and distribute food to families in need.",
      location: "Downtown Center",
      schedule: "Weekends, 9 AM - 1 PM"
    },
    {
      id: 2,
      title: "Youth Mentor",
      organization: "Big Brothers Big Sisters",
      description: "Guide and support young people in achieving their goals.",
      location: "Various Locations",
      schedule: "Flexible Schedule"
    },
    {
      id: 3,
      title: "Animal Shelter Helper",
      organization: "Happy Paws Rescue",
      description: "Care for rescue animals and help with daily operations.",
      location: "West Side Shelter",
      schedule: "Afternoons, 2 PM - 6 PM"
    },
    {
      id: 4,
      title: "Environmental Cleanup",
      organization: "Green City Initiative",
      description: "Join park cleanup events and help beautify our community.",
      location: "City Parks",
      schedule: "First Saturday Monthly"
    }
  ];

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <div className="volunteer-module">
      <div className="volunteer-module-header">
        <h1 className="volunteer-module-title">Find Your Perfect Volunteer Opportunity</h1>
        <p className="volunteer-module-subtitle">
          Browse available opportunities and make a difference in your community today.
        </p>
      </div>

      <div className="volunteer-grid">
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="volunteer-card">
            <button
              className={`favorite-btn ${favorites.has(opportunity.id) ? 'favorited' : ''}`}
              onClick={() => toggleFavorite(opportunity.id)}
              aria-label="Add to favorites"
            >
              <svg
                className="heart-icon"
                fill={favorites.has(opportunity.id) ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            
            <h3 className="volunteer-title">{opportunity.title}</h3>
            <p className="volunteer-organization">{opportunity.organization}</p>
            <p className="volunteer-description">{opportunity.description}</p>
            
            <div className="volunteer-details">
              <div className="volunteer-detail-item">
                <svg className="volunteer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{opportunity.location}</span>
              </div>
              
              <div className="volunteer-detail-item">
                <svg className="volunteer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{opportunity.schedule}</span>
              </div>
            </div>
            
            <button 
              className="volunteer-apply-btn"
              onClick={() => navigate(`/volunteer/opportunity/${opportunity.id}`)}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerModule;

