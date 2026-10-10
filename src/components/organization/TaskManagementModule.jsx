import React, { useEffect, useMemo, useState } from "react";
import { tasksAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./TaskManagementModule.css";

const initialFormState = {
  title: "",
  description: "",
  category: "",
  location: "",
  address: "",
  date: "",
  time: "",
  duration: "",
  volunteersNeeded: 1,
  requirements: "",
  whatToBring: "",
  contact: "",
  phone: "",
};

const TaskManagementModule = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormState);
  const [tasks, setTasks] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [listLoading, setListLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [volunteerLoading, setVolunteerLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isOrganization = useMemo(() => user?.role === "organization", [user]);

  useEffect(() => {
    if (isOrganization && user?.id) {
      loadTasks();
    }
  }, [isOrganization, user?.id]);

  const loadTasks = async () => {
    try {
      setListLoading(true);
      const data = await tasksAPI.getForOrganization(user.id);
      setTasks(data);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Unable to load tasks",
      });
    } finally {
      setListLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "volunteersNeeded" ? Number(value) : value,
    }));
  };

  const sanitizeList = (value = "") =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitLoading(true);
    setFeedback(null);

    try {
      const payload = {
        ...formData,
        volunteersNeeded: Number(formData.volunteersNeeded) || 1,
        requirements: sanitizeList(formData.requirements),
        whatToBring: sanitizeList(formData.whatToBring),
      };

      await tasksAPI.create(payload);
      setFeedback({ type: "success", message: "Task published successfully" });
      setFormData(initialFormState);
      await loadTasks();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Unable to publish task",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleViewVolunteers = async (taskId) => {
    setSelectedTaskId(taskId);
    setVolunteerLoading(true);
    try {
      const data = await tasksAPI.getTaskVolunteers(taskId);
      setVolunteers(data);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Unable to load volunteers",
      });
    } finally {
      setVolunteerLoading(false);
    }
  };

  if (!isOrganization) {
    return (
      <div className="task-manager-card">
        <h2>Organization access required</h2>
        <p>Sign in as an organization to create and track volunteer tasks.</p>
      </div>
    );
  }

  return (
    <div className="task-manager-wrapper">
      <section className="task-manager-card">
        <div className="task-manager-header">
          <div>
            <h2>Create a new volunteer task</h2>
            <p>Share clear details so volunteers know how to help.</p>
          </div>
        </div>

        {feedback && (
          <div className={`task-alert ${feedback.type}`}>
            {feedback.message}
          </div>
        )}

        <form className="task-manager-form" onSubmit={handleSubmit}>
          <div className="task-form-grid">
            <label>
              Title*
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Community cleanup lead"
                required
              />
            </label>

            <label>
              Category
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Environment"
              />
            </label>
          </div>

          <label>
            Description*
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what volunteers will do"
              required
              rows={3}
            />
          </label>

          <div className="task-form-grid">
            <label>
              Location
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Downtown community center"
              />
            </label>

            <label>
              Address
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
              />
            </label>
          </div>

          <div className="task-form-grid">
            <label>
              Date
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </label>

            <label>
              Time
              <input
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="10:00 AM - 1:00 PM"
              />
            </label>

            <label>
              Duration
              <input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="3 hours"
              />
            </label>
          </div>

          <div className="task-form-grid">
            <label>
              Volunteers Needed
              <input
                type="number"
                min="1"
                name="volunteersNeeded"
                value={formData.volunteersNeeded}
                onChange={handleChange}
              />
            </label>

            <label>
              Contact Email
              <input
                type="email"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="volunteer@org.org"
              />
            </label>

            <label>
              Phone
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
            </label>
          </div>

          <div className="task-form-grid">
            <label>
              Requirements (one per line)
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={3}
                placeholder={"Able to lift 20 lbs\nWork well with teams"}
              />
            </label>

            <label>
              What to bring (one per line)
              <textarea
                name="whatToBring"
                value={formData.whatToBring}
                onChange={handleChange}
                rows={3}
                placeholder={"Water bottle\nClosed-toe shoes"}
              />
            </label>
          </div>

          <button className="task-submit-btn" type="submit" disabled={submitLoading}>
            {submitLoading ? "Publishing task..." : "Publish task"}
          </button>
        </form>
      </section>

      <section className="task-manager-card">
        <div className="task-manager-header">
          <div>
            <h2>Your published tasks</h2>
            <p>Volunteers see these tasks immediately.</p>
          </div>
          <button type="button" className="secondary-btn" onClick={loadTasks} disabled={listLoading}>
            {listLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {tasks.length === 0 && !listLoading && (
          <p className="task-empty-state">Create your first task to reach volunteers.</p>
        )}

        {listLoading && tasks.length === 0 && (
          <p className="task-loading">Loading tasks...</p>
        )}

        <div className="task-list">
          {tasks.map((task) => (
            <article key={task._id} className="task-row">
              <div>
                <h3>{task.title}</h3>
                <p className="task-meta">
                  {task.date ? new Date(task.date).toLocaleDateString() : "Flexible date"} ·{" "}
                  {task.location || "Location TBA"}
                </p>
                <p className="task-meta">
                  {task.volunteersNeeded || 0} volunteers needed
                </p>
              </div>
              <div className="task-row-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => handleViewVolunteers(task._id)}
                >
                  View volunteers
                </button>
              </div>
            </article>
          ))}
        </div>

        {selectedTaskId && (
          <div className="volunteer-panel">
            <div className="volunteer-panel-header">
              <h4>Accepted volunteers</h4>
              <button type="button" className="link-btn" onClick={() => setSelectedTaskId(null)}>
                Close
              </button>
            </div>

            {volunteerLoading ? (
              <p className="task-loading">Loading volunteers...</p>
            ) : volunteers.length === 0 ? (
              <p className="task-empty-state">No volunteers have accepted this task yet.</p>
            ) : (
              <ul className="volunteer-list">
                {volunteers.map((person) => (
                  <li key={`${person.volunteerEmail}-${person.acceptedAt}`}>
                    <span className="volunteer-name">{person.volunteerName}</span>
                    <span className="volunteer-email">{person.volunteerEmail}</span>
                    <span className="volunteer-time">
                      {new Date(person.acceptedAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default TaskManagementModule;
