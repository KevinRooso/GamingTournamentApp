import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/AuthenticatedLayout.css';

const AuthenticatedLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container-fluid">
      {/* Hamburger button */}
      <button className={`hamburger ${isSidebarOpen ? 'text-primary' : 'text-white'}`} onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
      </button>

      {/* Sidebar and Content */}
      <div className="row">
        <div className={`col-2 sidebar-container ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
          <Sidebar />
        </div>
        <div className={`col content-container ${isSidebarOpen ? 'content-expanded' : ''}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
