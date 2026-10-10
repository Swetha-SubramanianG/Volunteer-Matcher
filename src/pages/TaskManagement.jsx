import React from 'react';
import Navbar from '../components/common/Navbar';
import TaskModule from '../components/tasks/TaskModule';

export default function TaskManagement() {
  return (
    <div>
      <Navbar />
      <TaskModule />
    </div>
  );
}
