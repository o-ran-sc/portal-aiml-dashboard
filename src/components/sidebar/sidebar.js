import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './sidebar.css';

export const Sidebar = () => {
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <a href="/TrainingJob/TrainingJobsStatus" className={`sidebar-link ${isActive('/TrainingJob/TrainingJobsStatus')}`}>
        <i className="bi bi-gear-fill"></i> Training Jobs
      </a>
      <a href="/TrainingJob/Pipeline" className={`sidebar-link ${isActive('/TrainingJob/Pipeline')}`}>
        <i className="bi bi-bar-chart-fill"></i> Training Function
      </a>
      <a href="/TrainingJob/ListFeatureGroups" className={`sidebar-link ${isActive('/TrainingJob/ListFeatureGroups')}`}>
        <i className="bi bi-folder-fill"></i> Feature Group
      </a>
    </div>
  );
};
