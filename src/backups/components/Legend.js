import React from 'react';
import '../css/Legend.css';

const Legend = ({ activeLayers, layerIcons, toggleLayerVisibility }) => {
  return (
    <div className="legend-container">
      <h4>Active Layers</h4>
      <ul>
        {activeLayers.map((layer) => (
          <li key={layer}>
            <div className="legend-item">
              <img src={layerIcons[layer]} alt={`${layer} icon`} className="legend-icon" />
              <span>{layer}</span>
             
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;
