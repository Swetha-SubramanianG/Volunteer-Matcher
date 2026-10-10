import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrganizationModule.css';

const OrganizationModule = () => {
  const navigate = useNavigate();
  
  const organizations = [
    {
      id: 1,
      name: "Community Food Share",
      category: "Food & Hunger",
      location: "Downtown",
      volunteers: 45,
      description: "Fighting hunger and providing nutritious food to families in need across the city."
    },
    {
      id: 2,
      name: "Big Brothers Big Sisters",
      category: "Youth & Education",
      location: "Citywide",
      volunteers: 120,
      description: "Mentoring young people to help them reach their full potential through one-on-one relationships."
    },
    {
      id: 3,
      name: "Happy Paws Rescue",
      category: "Animal Welfare",
      location: "West Side",
      volunteers: 32,
      description: "Rescuing and rehoming abandoned animals while promoting responsible pet ownership."
    },
    {
      id: 4,
      name: "Green City Initiative",
      category: "Environment",
      location: "Multiple Sites",
      volunteers: 67,
      description: "Environmental conservation through park cleanups, tree planting, and sustainability education."
    },
    {
      id: 5,
      name: "Senior Care Network",
      category: "Elder Care",
      location: "North District",
      volunteers: 28,
      description: "Providing companionship and support services to elderly community members."
    },
    {
      id: 6,
      name: "Youth Arts Center",
      category: "Arts & Culture",
      location: "Arts District",
      volunteers: 41,
      description: "Empowering young artists through creative programs and accessible art education."
    }
  ];

  const getCategoryIcon = (category) => {
    // Simple icon representation - you can replace with actual icons
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
    <div className="organization-module">
      <div className="organization-module-header">
        <h1 className="organization-module-title">Partner Organizations</h1>
        <p className="organization-module-subtitle">
          Discover amazing organizations making a difference in our community.
        </p>
      </div>

      <div className="organization-grid">
        {organizations.map((org) => (
          <div key={org.id} className="organization-card">
            <div className="organization-category">
              <span className="category-icon">{getCategoryIcon(org.category)}</span>
              <span className="category-text">{org.category}</span>
            </div>
            
            <h3 className="organization-name">{org.name}</h3>
            
            <div className="organization-info">
              <div className="info-item">
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{org.location}</span>
              </div>
              
              <div className="info-item">
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{org.volunteers} volunteers</span>
              </div>
            </div>
            
            <p className="organization-description">{org.description}</p>
            
            <button 
              className="organization-btn"
              onClick={() => navigate(`/organization/${org.id}/opportunities`)}
            >
              View Opportunities
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationModule;

