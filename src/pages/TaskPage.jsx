import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import "../styles/global.css";
import "./TasksPage.css";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);

  // ✅ Fetch tasks dynamically from your backend
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks") // update to your actual backend endpoint
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const getCategoryIcon = (category) => {
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
    <div>
      {/* ✅ Common Navbar */}
      <Navbar />

      {/* ✅ Page container */}
      <div className="task-page-container">
        <h1 className="task-page-title">Available Volunteer Tasks</h1>
        <p className="task-page-subtext">
          Discover meaningful volunteer opportunities that make a difference in our community.
        </p>

        {/* ✅ Task cards */}
        <div className="task-cards-grid">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task._id} className="task-card">
                <span className="task-category">
                  {getCategoryIcon(task.category)} {task.category}
                </span>
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>

                <div className="task-meta">
                  <div className="task-meta-item">
                    <svg
                      className="task-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{task.location}</span>
                  </div>

                  <div className="task-meta-item">
                    <svg
                      className="task-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>By {task.organizationName}</span>
                  </div>
                </div>

                <Link to={`/tasks/${task._id}`} className="view-task-btn">
                  View Task
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">
              No tasks available right now.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
