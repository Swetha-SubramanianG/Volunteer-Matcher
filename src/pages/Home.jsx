import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="home-content">
          <h1>Join hands, help your community — volunteer today</h1>
          <p>
            Find meaningful volunteer opportunities near you, connect with local
            organizations, and make a lasting impact. Sign up and start
            contributing in minutes.
          </p>
          <div className="home-buttons">
            <button
              className="btn-primary"
              onClick={() => navigate("/volunteer")}
            >
              Find Opportunities
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/organization/login")}
            >
              I'm an Organization
            </button>
          </div>

          {/* ---------- SVG VISUAL ---------- */}
          <div className="hero-visual" aria-hidden>
            <svg
              width="420"
              height="320"
              viewBox="0 0 420 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0" y="0" width="420" height="320" rx="20" fill="url(#g)" />
              <g transform="translate(40,30)">
                <circle cx="90" cy="80" r="34" fill="#fff" opacity="0.9" />
                <rect
                  x="150"
                  y="40"
                  width="120"
                  height="24"
                  rx="8"
                  fill="#fff"
                  opacity="0.9"
                />
                <rect
                  x="150"
                  y="80"
                  width="90"
                  height="18"
                  rx="8"
                  fill="#fff"
                  opacity="0.85"
                />
                <rect
                  x="0"
                  y="140"
                  width="320"
                  height="14"
                  rx="7"
                  fill="#fff"
                  opacity="0.9"
                />
                <rect
                  x="0"
                  y="170"
                  width="260"
                  height="14"
                  rx="7"
                  fill="#fff"
                  opacity="0.85"
                />
              </g>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFF8E8" />
                  <stop offset="100%" stopColor="#EEF2FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* ---------- FOOTER ---------- */}
      <footer className="footer">
        <small>
          © {new Date().getFullYear()} Volunteer Matcher — Connecting volunteers
          and organizations
        </small>
      </footer>
    </>
  );
}
