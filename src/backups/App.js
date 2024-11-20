import React, { useState, useRef } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Header from './components/Header';
import Navigation from './components/Navbar';
import HomeComponent from './components/HomeComponent';
import MapComponent from './components/MapDisplay';
import AnalysisComponent from './components/AnalysisComponent';
import ControlPanel from './components/ControlPanel';
import Legend from './components/Legend';

const App = () => {
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState('map');
  const [layersVisibility, setLayersVisibility] = useState({
    'pews:band_dl_custom': true,
    'pews:newswams': true,
    'pews:newhoppers': true,
  });

  const mapRef = useRef(null);

  const toggleToc = () => {
    setIsTocCollapsed(!isTocCollapsed);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'home':
        return <HomeComponent />;
      case 'map':
        return <MapComponent layersVisibility={layersVisibility} ref={mapRef} />;
      case 'analytics':
        return <AnalysisComponent />;
      default:
        return <div>Home Content</div>;
    }
  };

  const toggleLayerVisibility = (layer, visibility) => {
    setLayersVisibility({ ...layersVisibility, [layer]: visibility });
    if (mapRef.current) {
      mapRef.current.toggleLayerVisibility(layer, visibility);
    }
  };

  return (
    <Container fluid className="app-container">
      <header>
        <Header />
        <Navigation setActiveComponent={setActiveComponent} />
      </header>
      <div className="content-wrapper">
        <div className={`toc ${isTocCollapsed ? 'collapsed' : 'expanded'}`}>
          <button className="btn toggle-btn" onClick={toggleToc}>
            <span className="double-chevron">
              <i className={`fas fa-chevron-${isTocCollapsed ? 'right' : 'left'}`}></i>
              <i className={`fas fa-chevron-${isTocCollapsed ? 'right' : 'left'}`}></i>
            </span>
          </button>
          {!isTocCollapsed && <ControlPanel toggleLayerVisibility={toggleLayerVisibility} />}
        </div>
        <div className="main-content">
          {renderComponent()}
        </div>
      </div>
    </Container>
  );
};

export default App;