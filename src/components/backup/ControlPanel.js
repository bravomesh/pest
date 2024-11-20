import React, { useState, useEffect } from 'react';
import '../css/ControlPanel.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ControlPanel = ({ layersVisibility, toggleLayerVisibility, onApplyFilter }) => {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (selectedLayer && !layersVisibility[selectedLayer]) {
      setSelectedLayer(null);
    }
  }, [layersVisibility, selectedLayer]);

  const handleLayerToggle = (layerName) => {
    toggleLayerVisibility(layerName);
  };

  const handleLayerSelect = (layerName) => {
    if (layersVisibility[layerName]) {
      setSelectedLayer(layerName);
    }
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleApplyFilter = () => {
    if (selectedLayer && startDate && endDate) {
      onApplyFilter(selectedLayer, startDate, endDate);
    }
  };

  return (
    <div className="control-panel">
      <h3>Layer Controls</h3>
      <div className="layer-toggles">
        {Object.entries(layersVisibility).map(([layerName, isVisible]) => {
          const layerDisplayName = layerName.split(':')[1]
            ? layerName.split(':')[1].replace('_layer', '').toUpperCase()
            : layerName;

          return (
            <div key={layerName} className="layer-toggle">
              <span>{layerDisplayName}</span>
              <div
                className={`toggle-switch ${isVisible ? 'on' : 'off'}`}
                onClick={() => handleLayerToggle(layerName)}
              >
                <div className="toggle-knob"></div>
              </div>
              <button
                className={`filter-button ${isVisible ? '' : 'disabled'}`}
                onClick={() => handleLayerSelect(layerName)}
                disabled={!isVisible}
              >
                <i className="fas fa-filter"></i>
              </button>
            </div>
          );
        })}
      </div>

      {selectedLayer && (
        <div className="filter-options">
          <h4>Filter {selectedLayer}</h4>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="date-input"
          />
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="date-input"
          />
          <button onClick={handleApplyFilter} className="apply-filter-button">
            Apply Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
