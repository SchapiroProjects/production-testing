import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import './styles.css'

interface DayData {
  day: number;
  date: Date;
  dateStr: string;
  isMarked: boolean;
  isToday: boolean;
}

interface Project {
  id: number;
  name: string;
  duration: number;
  startDate: Date;
  endDate: Date;
}

export const Route = createFileRoute('/front-page')({
  component: RouteComponent,
})

function RouteComponent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [markedDays, setMarkedDays] = useState<Set<string>>(new Set());
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDuration, setNewProjectDuration] = useState(1);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Initialize calendar with today's date
  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const updateCalendar = (): (DayData | null)[] => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const totalDays = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days: (DayData | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      
      days.push({
        day,
        date,
        dateStr,
        isMarked: markedDays.has(dateStr),
        isToday: date.toDateString() === new Date().toDateString()
      });
    }

    return days;
  };

  const handleDayClick = (dateStr: string) => {
    const newMarkedDays = new Set(markedDays);
    if (markedDays.has(dateStr)) {
      newMarkedDays.delete(dateStr);
    } else {
      newMarkedDays.add(dateStr);
    }
    setMarkedDays(newMarkedDays);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddProject = () => {
    if (newProjectName.trim() && newProjectDuration > 0) {
      const newProject: Project = {
        id: Date.now(),
        name: newProjectName.trim(),
        duration: newProjectDuration,
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + (newProjectDuration * 24 * 60 * 60 * 1000))
      };
      
      setProjects(prevProjects => [...prevProjects, newProject]);
      setShowAddProjectModal(false);
      setNewProjectName('');
      setNewProjectDuration(1);
    }
  };

  const handleModalClose = () => {
    setShowAddProjectModal(false);
    setNewProjectName('');
    setNewProjectDuration(1);
  };

  return (
    <div className="app-container">
      <div className="projects-sidebar">
        <div className="projects-header">
          <h2>Projects</h2>
          <button onClick={() => setShowAddProjectModal(true)}>+</button>
        </div>
        <div className="projects-list">
          {projects.map(project => (
            <div key={project.id} className="project-item">
              <div className="project-name">{project.name}</div>
              <div className="project-duration">{project.duration} days</div>
            </div>
          ))}
        </div>
      </div>
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={handlePrevMonth}>&lt;</button>
          <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {updateCalendar().map((day, index) => (
            <div
              key={index}
              className={day ? `day ${day.isMarked ? 'marked' : ''} ${day.isToday ? 'today' : ''}` : 'empty-day'}
              onClick={day ? () => handleDayClick(day.dateStr) : undefined}
            >
              {day && day.day}
            </div>
          ))}
        </div>
      </div>

      {showAddProjectModal && (
        <div className="new-project-modal">
          <div className="new-project-form">
            <h2>Add New Project</h2>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project Name"
              required
            />
            <input
              type="number"
              value={newProjectDuration}
              onChange={(e) => setNewProjectDuration(parseInt(e.target.value) || 1)}
              placeholder="Duration (days)"
              required
              min="1"
            />
            <div className="form-buttons">
              <button onClick={handleModalClose} className="cancel-button">Cancel</button>
              <button onClick={handleAddProject} className="create-button">Create Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
