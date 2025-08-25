import React from 'react';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './sidebar.css';

export const Sidebar = () => {
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <Row className="sidebar-row">
      <Col xs={12} style={{ padding: '0px 30px' }}>
        <a href="/TrainingJob/TrainingJobsStatus" className={`sidebar-link ${isActive('/TrainingJob/TrainingJobsStatus')}`}>
          <i className="bi bi-gear-fill"></i> Training Jobs
        </a>
        <a href="/TrainingJob/Pipeline" className={`sidebar-link ${isActive('/TrainingJob/Pipeline')}`}>
          <i className="bi bi-bar-chart-fill"></i> Training Function
        </a>
        <a href="/TrainingJob/ListFeatureGroups" className={`sidebar-link ${isActive('/TrainingJob/ListFeatureGroups')}`}>
          <i className="bi bi-folder-fill"></i> Feature Group
        </a>
        <a href="/ModelManagement/ListModels" className={`sidebar-link ${isActive('/ModelManagement/ListModels')}`}>
          <i className="bi bi-box-seam"></i> Model Management
        </a>
      </Col>
    </Row>
  );
};