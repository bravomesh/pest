// import React, { useState } from 'react';
// import { Navbar, Nav } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../css/Header.css';

// const Header = ({ setActiveComponent }) => {
//   const [activeTab, setActiveTab] = useState('map'); 

//   const handleSetActiveComponent = (tabName) => {
//     setActiveTab(tabName);
//     setActiveComponent(tabName);
//   };

//   return (
//     <Navbar bg="light" expand="lg" className="header-navbar">
//       <Navbar.Brand href="#home" className="header-brand">
//         <img
//           src="../icpaclogo_en.svg"
//           width="70"
//           height="50"
//           className="d-inline-block align-top"
//           alt="ICPAC logo"
//         />
//         <span className="header-title">ICPAC Pests Watch</span>
//       </Navbar.Brand>
//       <Navbar.Toggle aria-controls="basic-navbar-nav" />
//       <Navbar.Collapse id="basic-navbar-nav">
//         <Nav className="ml-auto nav-right">
//           <Nav.Link
//             onClick={() => handleSetActiveComponent('home')}
//             className={activeTab === 'home' ? 'active' : ''}
//           >
//             Home
//           </Nav.Link>
//           <Nav.Link
//             onClick={() => handleSetActiveComponent('map')}
//             className={activeTab === 'map' ? 'active' : ''}
//           >
//             Map
//           </Nav.Link>
//           <Nav.Link
//           onClick={() => handleSetActiveComponent('analytics')}
//           className={activeTab === 'analytics' ? 'active' : ''}
//         >
//           Analytics
//         </Nav.Link>
//             <Nav.Link
//             onClick={() => handleSetActiveComponent('about')}
//             className={activeTab === 'about' ? 'active' : ''}
//           >
//             About
//             </Nav.Link>
//             <Nav.Link
//             onClick={() => handleSetActiveComponent('patners')}
//             className={activeTab === 'patners' ? 'active' : ''}
//           >
//             Patners
//           </Nav.Link> 
//           <Nav.Link
//           onClick={() => handleSetActiveComponent('contact')}
//           className={activeTab === 'contact' ? 'active' : ''}
//         >
//           Contact
//         </Nav.Link>   
//         </Nav>
//       </Navbar.Collapse>
//     </Navbar>
//   );
// };

// export default Header;

import React, { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import igad from '../images/igad_white.png';

const Header = ({ setActiveComponent }) => {
  const [activeTab, setActiveTab] = useState('map');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSetActiveComponent = (tabName) => {
    setActiveTab(tabName);
    setActiveComponent(tabName);
    setIsMenuOpen(false); // Close the menu on mobile after selecting
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'HOME', key: 'home' },
    { name: 'MAP', key: 'map' },
    { name: 'ANALYTICS', key: 'analytics' },
    { name: ' PARTNERS', key: 'patners' },
    { name: 'ABOUT ', key: 'about' },
    { name: 'CONTACT', key: 'contact' },
  ];

  return (
    <div
    className={`fixed top-0 z-1000 w-full ${
      activeTab === 'map' ? 'bg-green-800 opacity-80' : isScrolled ? 'bg-green-800 opacity-80' : 'bg-transparent'
    } transition duration-500`}
  >
  
    
      <div className="flex items-center justify-between px-4 md:px-10">
        {/* Logo Section */}
        <div className="flex justify-center item ml-3 md:ml-10">
        <div className="relative inline-block text-center text-white m-2 font-bold">
          <div className="bracket left-0 top-0"></div>
          <div className="bracket right-0 top-0"></div>
          <div className="bracket left-0 bottom-0"></div>
          <div className="bracket right-0 bottom-0"></div>
          <span className="md:px-3 px-2 flex  flex-col text-sm">EAST AFRICA <span className="text-md text-yellow-500">PEST </span><span className='text-yellow-500'>DASHBOARD</span></span>
        </div>
      </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-5">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => handleSetActiveComponent(link.key)}
              className={`font-bold transition ${
                activeTab === link.key
                  ? 'text-yellow-500'
                  : 'text-white hover:text-yellow-500'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Logo */}
        <img src={igad} alt="igadLogo" className="h-12 w-12 md:h-16 md:w-16 mr-3 md:mr-16" />

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-yellow-500">
            {isMenuOpen ? (
              <CloseIcon fontSize="large" />
            ) : (
              <MenuIcon fontSize="large" className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-teal-600 flex flex-col items-center py-4 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => handleSetActiveComponent(link.key)}
              className={`font-bold transition ${
                activeTab === link.key
                  ? 'text-yellow-500'
                  : 'text-white hover:text-yellow-500'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;