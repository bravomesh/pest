import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Navbar.css'; // Import CSS for Header

const Navigation = ({ setActiveComponent }) => {
  const [activeTab, setActiveTab] = useState('map'); // Example state for active tab

  const handleSetActiveComponent = (tabName) => {
    setActiveTab(tabName);
    setActiveComponent(tabName);
  };

  return (
    <Navbar bg="light" expand="lg" className="menu-navbar">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto nav-right">
          <Nav.Link
            onClick={() => handleSetActiveComponent('home')}
            className={activeTab === 'home' ? 'active' : ''}
          >
            Home
          </Nav.Link>
          <Nav.Link
            onClick={() => handleSetActiveComponent('map')}
            className={activeTab === 'map' ? 'active' : ''}
          >
            Map
          </Nav.Link>
          <Nav.Link
            onClick={() => handleSetActiveComponent('analytics')}
            className={activeTab === 'analytics' ? 'active' : ''}
          >
            Analytics
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;