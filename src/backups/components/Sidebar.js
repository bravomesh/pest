import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="toc-content">
        {isOpen && (
          <>
            <h3>Table of Contents</h3>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </>
        )}
      </div>
      <button className="btn btn-primary toggle-btn" onClick={toggleSidebar}>
        {isOpen ? 'Hide' : 'Show'} TOC
      </button>
    </div>
  );
};

export default Sidebar;
