
// components/Header.js

import React from 'react';
import { Navbar } from 'react-bootstrap';
import '../css/Header.css'; // Import CSS for Header


const Header = () => {
  return (
 <Navbar bg="light" expand="lg" className="header-navbar" >
      <Navbar.Brand href="#home">
         <img
          src="../icpaclogo_en.svg"
          width="70"
          height="30"
          className="d-inline-block align-top"
          alt="ICPAC logo"
        />{' '}
       <span className="text-white">ICPAC Pests Watch </span>
      </Navbar.Brand>
    </Navbar>
  );
};

export default Header;



