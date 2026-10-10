import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tasksAPI } from "../../services/api";
import "./TaskList.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await tasksAPI.getAll();
        setTasks(response);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="org-container">
      <h2 className="org-heading">Available Tasks</h2>
      <p className="org-subheading">
        Explore volunteer tasks and make a difference today.
      </p>

      <div className="org-grid">
        {tasks.map((task) => (
          <div className="org-card" key={task._id}>
            <div className="org-header">
              <span className="org-category">{task.category}</span>
            </div>
            <h3 className="org-title">{task.title}</h3>
            <p className="org-location">
              📍 {task.location || "Multiple locations"}
            </p>
            <p className="org-volunteers">
              👥 {task.volunteers?.length || 0} volunteers
            </p>
            <p className="org-description">
              {task.description?.substring(0, 100)}...
            </p>
            <button
              className="org-button"
              onClick={() => navigate(`/tasks/${task._id}`)}
            >
              View Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
