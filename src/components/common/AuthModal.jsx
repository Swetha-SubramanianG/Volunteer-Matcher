import React from "react";
import "../../styles/modal.css";

export default function AuthModal({ open, onClose, onSignup }) {
  if (!open) return null;

  return (
    <div className="vm-modal-overlay" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="vm-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="vm-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="vm-modal-icon" aria-hidden="true">i</div>
        <h2 className="vm-modal-title">Authentication Required</h2>
        <p className="vm-modal-message">
          You need to sign up or login to apply for opportunities. Would you like to sign up now?
        </p>

        <div className="vm-modal-actions">
          <button className="vm-btn vm-btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="vm-btn vm-btn-primary"
            onClick={() => onSignup && onSignup()}
            autoFocus
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}