import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import { tasksAPI } from '../services/api';
import '../styles/my-applications.css';

export default function MyApplications() {
  const { user, isAuthenticated } = useAuth();
  const [acceptedTasks, setAcceptedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isVolunteer = user?.role === 'volunteer';

  useEffect(() => {
    if (isAuthenticated && isVolunteer) {
      fetchAcceptedTasks();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isVolunteer]);

  const fetchAcceptedTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tasksAPI.getAcceptedTasks();
      setAcceptedTasks(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to load accepted tasks.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="my-apps-container">
          <p>Please log in to view your tasks.</p>
        </div>
      </>
    );
  }

  if (!isVolunteer) {
    return (
      <>
        <Navbar />
        <div className="my-apps-container">
          <p>Accepted tasks are only available for volunteer accounts.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="my-apps-container">
        <div className="my-apps-header">
          <div>
            <h1>My Accepted Tasks</h1>
            <p>Every task you’ve committed to stays here for quick reference.</p>
          </div>
          <button className="refresh-btn" onClick={fetchAcceptedTasks} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && <p className="my-apps-error">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : acceptedTasks.length === 0 ? (
          <p className="my-apps-empty">You haven’t accepted any tasks yet.</p>
        ) : (
          <div className="applications-table">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Organization</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Accepted On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {acceptedTasks.map((record) => {
                  const taskInfo = record.taskId || {};
                  const displayTitle = taskInfo.title || record.taskTitle || 'Task';
                  const displayOrg = taskInfo.organizationName || record.organizationName || 'Organization';
                  const displayLocation = taskInfo.location || '—';
                  const displayDate = taskInfo.date ? new Date(taskInfo.date).toLocaleDateString() : 'Flexible';
                  const acceptedOn = record.acceptedAt ? new Date(record.acceptedAt).toLocaleString() : '—';
                  return (
                    <tr key={record._id}>
                      <td>{displayTitle}</td>
                      <td>{displayOrg}</td>
                      <td>{displayLocation}</td>
                      <td>{displayDate}</td>
                      <td>{acceptedOn}</td>
                      <td>
                        <span className={`status ${record.status}`}>
                          {record.status?.charAt(0).toUpperCase() + record.status?.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}