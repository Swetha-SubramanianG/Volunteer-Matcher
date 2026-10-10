import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/tasks.css";
import AuthModal from "../components/common/AuthModal";

const API_BASE = "http://localhost:5000";

export default function TaskDetail(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // derived boolean: require all three to consider user really authenticated
  const authReady = Boolean(isAuthenticated && token && user && Object.keys(user).length > 0);

  // debug: show auth values on every render / change
  useEffect(() => {
    console.log("RENDER TaskDetail auth state:", { isAuthenticated, tokenPresent: Boolean(token), user, authReady, showAuthModal });
  }, [isAuthenticated, token, user, authReady, showAuthModal]);
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    console.log("TaskDetail auth:", { isAuthenticated, token, user, authReady });
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/tasks/${id}`);
        if (!res.ok) throw new Error("Failed to load task");
        setTask(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isAuthenticated, token, user, authReady]);

  const handleAccept = async () => {
    // strict guard: if we don't have token + user data, show modal instead of calling API
    if (!authReady) {
      console.log("handleAccept blocked — not authenticated, showing modal", { isAuthenticated, token, user });
      setShowAuthModal(true);
      return;
    }

    setApplying(true);
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({})
      });

      if (res.status === 401) {
        setNotice({ type: "info", text: "Session expired. Please sign in again." });
        setTimeout(() => navigate("/login", { replace: true }), 800);
        return;
      }
      if (res.status === 409) {
        setNotice({ type: "warning", text: "You have already applied for this task." });
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setNotice({ type: "error", text: data.message || "Failed to accept task." });
        return;
      }

      setNotice({ type: "success", text: "Task accepted successfully!" });
    } catch (err) {
      console.error(err);
      setNotice({ type: "error", text: "Network error" });
    } finally {
      setApplying(false);
    }
  };

  // button click: if auth incomplete show modal reliably — ALWAYS route through this function
  const handleApplyClick = () => {
    console.log("handleApplyClick called", { isAuthenticated, token, user, authReady, showAuthModal });
    if (!authReady) {
      // show modal and do NOT call the API
      setShowAuthModal(true);
      return;
    }
    // authenticated -> perform accept
    handleAccept();
  };

  if (loading) return <div className="tasks-container">Loading...</div>;
  if (!task) return <div className="tasks-container">Task not found.</div>;

  return (
    <>
      <div className="tasks-container">
        <Link to="/tasks">← Back to Tasks</Link>
        <div className="task-page">
          <h1>{task.title}</h1>
          <h4>{task.organizationName}</h4>

          <div className="task-grid">
            <div className="task-main">
              <div className="card">
                <h3>About This Task</h3>
                <p>{task.description}</p>
              </div>
            </div>

            <div className="task-side">
              <div className="card">
                <p><strong>Location:</strong> {task.location}</p>
                <p><strong>Category:</strong> {task.category}</p>
                <p><strong>Volunteers Needed:</strong> {task.volunteersNeeded}</p>
              </div>

              {/* ALWAYS use handleApplyClick so we control whether API is called */}
              <button
                className="btn-apply"
                onClick={handleApplyClick}
                disabled={applying}
              >
                {applying ? "Applying..." : (authReady ? "Accept Task" : "Sign in to Accept Task")}
              </button>
            </div>
          </div>

          {notice && (
            <div style={{
              position: "fixed", right: 20, bottom: 20, padding: 12, borderRadius: 8,
              background: notice.type === "success" ? "#d1fae5" : notice.type === "warning" ? "#fef3c7" : "#e6f0ff",
              color: "#111"
            }}>
              {notice.text}
            </div>
          )}
        </div>
      </div>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignup={() => {
          setShowAuthModal(false);
          navigate("/auth"); // adjust to your auth route if different
        }}
      />
    </>
  );
}