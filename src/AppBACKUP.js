import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import HomeComponent from './components/HomeComponent';
import MapComponent from './components/MapDisplay';
import AnalysisComponent from './components/AnalysisComponent';
import ControlPanel from './components/ControlPanel';
import Legend from './components/Legend';
import Popup from './components/Popup';

const App = () => {
  const layerNameMapping = {
    'Band Master': 'Bands',
    'Swarms': 'Swarms',
    'Hoppers': 'Hoppers',
    'Soil Moisture': 'Monthly Soil Moisture Anomaly',
    'Temperature': 'Monthly Temperature Anomaly',
    'Precipitation': 'Monthly Precipitation (CHIRPS)',
    'Soil Temperature': 'Monthly Soil Temperature Anomaly',
    'Wind Speed': 'Wind Speed',
    'Boundary': 'IGAD Boundary',
    'Desert Locust Risk': 'Outbreak Probability',
    'Breeding Sites': 'Breeding Sites'
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTocCollapsed, setIsTocCollapsed] = useState(isMobile);
  const [activeComponent, setActiveComponent] = useState('map');
  const [layersVisibility, setLayersVisibility] = useState({
    'Band Master': true,
    'Swarms': true,
    'Hoppers': true,
    'Breeding Sites': false,
    'Desert Locust Risk': true,
    'Soil Moisture': false,
    'Temperature': false,
    'Precipitation': false,
    'Soil Temperature': false,
    'Wind Speed': false,
    'Boundary': true,
  });
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [infoPopupLayer, setInfoPopupLayer] = useState(null);
  const [filteredLayers, setFilteredLayers] = useState({});
  const [logMessages, setLogMessages] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      if (newIsMobile !== isMobile) {
        setIsTocCollapsed(newIsMobile);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const toggleToc = useCallback(() => {
    setIsTocCollapsed(prev => !prev);
  }, []);

  useEffect(() => {
    if (isMapInitialized && mapRef.current && mapRef.current.invalidateSize) {
      const timer = setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isTocCollapsed, isMapInitialized]);

  useEffect(() => {
    window.goToAnalytics = () => {
      setActiveComponent('analytics');
    };

    return () => {
      delete window.goToAnalytics;
    };
  }, []);
  
  const addLogMessage = useCallback((message, type = 'info') => {
    setLogMessages([{ text: message, type, id: Date.now() }]);
  }, []);
  
  const handleCountryFilter = useCallback((country) => {
    setSelectedCountry(country);
    addLogMessage(`Filtered by country: ${country || 'None'}`, 'info');
  }, [addLogMessage]); 

  const clearLogMessages = useCallback(() => {
    setLogMessages([]);
  }, []);

  const handleLayerToggleFromMap = useCallback((layerName, isVisible) => {
    setLayersVisibility(prevState => ({
      ...prevState,
      [layerName]: isVisible
    }));
  }, []);

  const toggleLayerVisibility = useCallback(layer => {
    setLayersVisibility(prevState => {
      const newState = {
        ...prevState,
        [layer]: !prevState[layer],
      };
      if (mapRef.current && mapRef.current.updateTreeControl) {
        mapRef.current.updateTreeControl(layer, newState[layer]);
      }
      return newState;
    });
  }, []);  

  const onApplyFilter = useCallback(async (layer, cqlFilter, url) => {
    if (!isMapInitialized || !mapRef.current || !mapRef.current.getLayerByName) {
        addLogMessage('Map not initialized or getLayerByName method not available', 'error');
        return;
    }

    addLogMessage(`Applied filter for ${layer}: ${cqlFilter}`, 'info');

    try {
        const response = await fetch(`${url}&CQL_FILTER=${encodeURIComponent(cqlFilter)}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch features');
        }

        const data = await response.json();

        if (data && data.features) {
            addLogMessage(`Received ${data.features.length} features for ${layer}`, 'info');
            setFilteredLayers(prevState => ({
                ...prevState,
                [layer]: {
                    features: data.features,
                    cqlFilter: cqlFilter,
                },
            }));

            setLayersVisibility(prevState => ({
                ...prevState,
                [layer]: true,
            }));

            if (mapRef.current && mapRef.current.updateTreeControl) {
                mapRef.current.updateTreeControl(layer, true);
            }
        } else {
            addLogMessage(`No features received for ${layer}`, 'warning');
        }
    } catch (error) {
        addLogMessage(`Error fetching features for ${layer}: ${error.message}`, 'error');
    }
  }, [isMapInitialized, addLogMessage]);

  const handleClearFilter = useCallback(layerName => {
    if (!isMapInitialized || !mapRef.current || !mapRef.current.getLayerByName) {
      addLogMessage('Map not initialized or getLayerByName method not available', 'error');
      return;
    }

    setFilteredLayers(prevState => {
      const newState = { ...prevState };
      delete newState[layerName];
      return newState;
    });

    setLayersVisibility(prevState => ({
      ...prevState,
      [layerName]: prevState[layerName],
    }));

    addLogMessage(`Cleared filter for ${layerName}`, 'info');
  }, [isMapInitialized, addLogMessage]);

  const handleInfoIconClick = layerName => {
    setInfoPopupLayer(prev => (prev === layerName ? null : layerName));
  };

  return (
    <Container fluid className="app-container">
      <header>
        <Header setActiveComponent={setActiveComponent} />
      </header>
      <div className="content-wrapper">
        {activeComponent === 'map' && (
          <div className={`toc ${isTocCollapsed ? 'collapsed' : 'expanded'}`}>
            <button className="btn toggle-btn" onClick={toggleToc}>
              <span className="double-chevron">
                <i className={`fas fa-chevron-${isTocCollapsed ? 'right' : 'left'}`}></i>
                <i className={`fas fa-chevron-${isTocCollapsed ? 'right' : 'left'}`}></i>
              </span>
            </button>
            {!isTocCollapsed && (
              <ControlPanel
                layersVisibility={layersVisibility}
                toggleLayerVisibility={toggleLayerVisibility}
                onApplyFilter={onApplyFilter}
                onClearFilter={handleClearFilter}
                layerNameMapping={layerNameMapping}
                onInfoIconClick={handleInfoIconClick}
                onCountryFilter={handleCountryFilter}
                isMobile={isMobile}
              />
            )}
          </div>
        )}
        <div
          className={`main-content ${
            activeComponent === 'map' ? (isTocCollapsed ? 'map-collapsed' : 'map-expanded') : 'full-width'
          }`}
        >
          {activeComponent === 'map' && (
            <MapComponent
              layersVisibility={layersVisibility}
              filteredLayers={filteredLayers}
              ref={mapRef}
              onToggleLayer={handleLayerToggleFromMap}
              onMapInitialized={() => setIsMapInitialized(true)}
              isMobile={isMobile}
              selectedCountry={selectedCountry}
            />
          )}
          {activeComponent === 'home' && <HomeComponent />}
          {activeComponent === 'analytics' && <AnalysisComponent />}
          {infoPopupLayer && (
            <Popup
              layerName={layerNameMapping[infoPopupLayer]}
              onClose={() => setInfoPopupLayer(null)}
            />
          )}
        </div>
      </div>
      <Legend />
      {logMessages.length > 0 && (
        <div className="log-messages">
          <div className="log-header">
            <button className="close-log" onClick={clearLogMessages}>×</button>
          </div>
          {logMessages.map((message) => (
            <div key={message.id} className={`log-message ${message.type}`}>
              {message.text}
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default App;