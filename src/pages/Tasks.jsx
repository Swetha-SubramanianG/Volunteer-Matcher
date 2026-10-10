import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import '../styles/tasks.css';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:5000";

export default function Tasks() {
  const { isAuthenticated, user, token } = useAuth(); // token must be provided by AuthContext
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTask = (task) => {
    // allow viewing details even if not signed in, but Apply will be gated
    setSelectedTask(task);
  };

  const handleApplyNow = async () => {
    if (!selectedTask) return;
    if (!isAuthenticated || !token) {
      // explicit UX: ask to sign in and navigate
      setModalMessage('Please sign in to apply for tasks.');
      setModalType('info');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/login', { replace: true });
      }, 900);
      return;
    }

    setApplying(true);
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${selectedTask._id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({}) // backend uses req.user via middleware
      });

      if (res.status === 401) {
        // token invalid or expired
        setModalMessage('Session expired. Please sign in again.');
        setModalType('info');
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate('/login', { replace: true });
        }, 900);
        return;
      }

      const data = await res.json();

      if (res.status === 409) {
        setModalMessage('You have already applied for this task.');
        setModalType('warning');
      } else if (res.ok) {
        setModalMessage('Task accepted successfully!');
        setModalType('success');
      } else {
        setModalMessage(data?.message || 'Failed to apply for task.');
        setModalType('error');
      }
    } catch (err) {
      console.error(err);
      setModalMessage('Error applying for task');
      setModalType('error');
    } finally {
      setApplying(false);
      setShowModal(true);
      setSelectedTask(null);
    }
  };

  if (loading) return <div className="tasks-container">Loading...</div>;

  return (
    <div className="tasks-container">
      <h1>Available Volunteer Tasks</h1>
      <p>Discover meaningful volunteer opportunities that make a difference in our community.</p>

      {tasks.length === 0 ? (
        <p>No tasks available right now.</p>
      ) : (
        <div className="tasks-grid">
          {tasks.map(task => (
            <div key={task._id} className="task-card">
              <h3>{task.title}</h3>
              <p className="task-location">📍 {task.location}</p>
              <p className="task-org">By {task.organizationName}</p>
              <button
                className="btn-view-task"
                onClick={() => handleViewTask(task)}
              >
                View Task
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedTask && (
        <div className="task-modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTask(null)}>✕</button>
            <h2>{selectedTask.title}</h2>
            <p><strong>Category:</strong> {selectedTask.category}</p>
            <p><strong>Location:</strong> {selectedTask.location}</p>
            <p><strong>Organization:</strong> {selectedTask.organizationName}</p>
            <p><strong>Description:</strong> {selectedTask.description}</p>
            <p><strong>Volunteers Needed:</strong> {selectedTask.volunteersNeeded}</p>

            {isAuthenticated ? (
              <button className="btn-apply" onClick={handleApplyNow} disabled={applying}>
                {applying ? 'Applying...' : 'Apply Now'}
              </button>
            ) : (
              <button
                className="btn-apply"
                onClick={() => {
                  setModalMessage('Please sign in to apply for tasks.');
                  setModalType('info');
                  setShowModal(true);
                  setTimeout(() => {
                    setShowModal(false);
                    navigate('/login', { replace: true });
                  }, 700);
                }}
              >
                Sign in to Apply
              </button>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === 'success' ? '✓ Success' : modalType === 'warning' ? '⚠ Notice' : 'ℹ️'}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
}