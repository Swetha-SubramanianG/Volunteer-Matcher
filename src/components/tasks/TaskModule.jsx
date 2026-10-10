import React from "react";
import "./TaskModule.css";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const TaskModule = () => {
  const tasks = [
    {
      title: "Tutoring Session",
      organization: "Community Food Share",
      location: "Downtown",
      date: "March 18, 2025",
      time: "4:00 PM - 6:00 PM",
      spots: "6/10 spots",
      priority: "Medium Priority",
      description:
        "Provide homework help and academic support to middle school students.",
    },
    {
      title: "Park Cleanup",
      organization: "Community Food Share",
      location: "Riverside Park",
      date: "March 16, 2025",
      time: "8:00 AM - 11:00 AM",
      spots: "12/15 spots",
      priority: "Medium Priority",
      description:
        "Join us for a community park cleanup event at Riverside Park.",
    },
    {
      title: "Dog Walking",
      organization: "Happy Paws Rescue",
      location: "West Side",
      date: "March 17, 2025",
      time: "2:00 PM - 4:00 PM",
      spots: "3/6 spots",
      priority: "Low Priority",
      description:
        "Take rescue dogs for walks and assist with socialization training.",
    },
    {
      title: "Sort Donations",
      organization: "Community Food Share",
      location: "Downtown Center",
      date: "March 15, 2025",
      time: "9:00 AM - 12:00 PM",
      spots: "5/8 spots",
      priority: "High Priority",
      description:
        "Help organize and sort incoming food donations for weekend distribution.",
    },
  ];

  return (
    <div className="task-page-container">
      <h2 className="task-header-title">Upcoming Volunteer Tasks</h2>
      <p className="task-header-subtitle">
        Sign up for specific tasks and events happening soon in your community.
      </p>

      <div className="task-card-grid">
        {tasks.map((task, index) => (
          <div key={index} className="task-card">
            <div className={`priority-tag ${task.priority.split(" ")[0].toLowerCase()}`}>
              {task.priority}
            </div>
            <h3>{task.title}</h3>
            <p className="organization">{task.organization}</p>
            <p className="description">{task.description}</p>

            <div className="task-details">
              <p><MapPin size={16} /> {task.location}</p>
              <p><Calendar size={16} /> {task.date}</p>
              <p><Clock size={16} /> {task.time}</p>
              <p><Users size={16} /> {task.spots}</p>
            </div>

            <button className="apply-task-btn">View Task</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskModule;
