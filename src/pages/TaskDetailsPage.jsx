import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { tasksAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./TaskDetailsPage.css";

const TaskDetailsPage = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const isVolunteer = user?.role === "volunteer" && Boolean(token);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [acceptance, setAcceptance] = useState({ accepted: false });
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await tasksAPI.getById(id);
        setTask(data);
      } catch (err) {
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const fetchAcceptanceStatus = useCallback(async () => {
    try {
      setStatusLoading(true);
      const response = await tasksAPI.getAcceptanceStatus(id);
      setAcceptance(response);
    } catch (error) {
      console.error("Error loading acceptance status:", error);
    } finally {
      setStatusLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isVolunteer) {
      fetchAcceptanceStatus();
    } else {
      setAcceptance({ accepted: false });
    }
  }, [fetchAcceptanceStatus, isVolunteer]);

  const showToast = (message, type = "success") => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleAcceptTask = async () => {
    if (!isVolunteer) {
      showToast("Sign in as a volunteer to accept this task.", "error");
      return;
    }
    try {
      setActionLoading(true);
      const response = await tasksAPI.acceptTask(id);
      setAcceptance({ accepted: true, acceptance: response.acceptance });
      showToast("Task accepted successfully!");
    } catch (error) {
      showToast(error.message || "Unable to accept task", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelTask = async () => {
    try {
      setActionLoading(true);
      await tasksAPI.cancelAcceptedTask(id);
      setAcceptance({ accepted: false });
      showToast("Task cancelled.", "success");
    } catch (error) {
      showToast(error.message || "Unable to cancel task", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="task-loading">Loading task...</div>;
  if (!task) return <div className="task-error">Task not found</div>;

  return (
    <>
      <Navbar />

      <div className="task-details-container">
        <Link to="/tasks" className="back-btn">
          ← Back to Tasks
        </Link>

        <div className="task-details-header">
          <h1>{task.title}</h1>
          <h3>{task.organizationName}</h3>
        </div>

        <div className="task-details-content">
          <div className="task-left">
            <section className="task-section">
              <h2>About This Task</h2>
              <p>{task.description}</p>
            </section>

            {task.requirements?.length > 0 && (
              <section className="task-section">
                <h2>Requirements</h2>
                <ul>
                  {task.requirements.map((req, i) => (
                    <li key={i}>✔ {req}</li>
                  ))}
                </ul>
              </section>
            )}

            {task.whatToBring?.length > 0 && (
              <section className="task-section">
                <h2>What to Bring</h2>
                <ul>
                  {task.whatToBring.map((item, i) => (
                    <li key={i}>⭐ {item}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="task-right">
            <div className="task-info-card">
              <p><strong>Location:</strong> {task.location || "To be announced"}</p>
              <p><strong>Address:</strong> {task.address || "—"}</p>
              <p><strong>Date:</strong> {task.date ? new Date(task.date).toDateString() : "Flexible"}</p>
              <p><strong>Time:</strong> {task.time || "—"}</p>
              <p><strong>Duration:</strong> {task.duration || "—"}</p>
              <p><strong>Contact:</strong> {task.contact || "—"}</p>
              <p><strong>Phone:</strong> {task.phone || "—"}</p>
              <p><strong>Category:</strong> {task.category || "General"}</p>
            </div>

            <div className="task-actions">
              <button
                className="accept-task-btn"
                onClick={handleAcceptTask}
                disabled={actionLoading || acceptance.accepted || statusLoading}
              >
                {actionLoading && !acceptance.accepted
                  ? "Submitting..."
                  : acceptance.accepted
                    ? "Task Accepted"
                    : "Accept Task"}
              </button>

              {acceptance.accepted && (
                <button
                  className="cancel-task-btn"
                  onClick={handleCancelTask}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Cancelling..." : "Cancel acceptance"}
                </button>
              )}

              {!isVolunteer && (
                <p className="task-login-hint">
                  Sign in as a volunteer to accept this task.
                </p>
              )}
            </div>
          </div>
        </div>

        {showPopup && (
          <div className={`task-popup ${popupType}`}>
            <p>{popupMessage}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TaskDetailsPage;
