import React from 'react';
import '../css/Legend.css';

const Legend = ({ info, onClose }) => {
  if (!info) return null;

  const { layerName, featureInfo } = info;

  return (
    <div className="legend">
      <div className="legend-header">
        <h3 className="legend-title">{layerName}</h3>
        <button className="legend-close" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="legend-content">
        {Object.entries(featureInfo).map(([key, value]) => (
          <div key={key} className="legend-item">
            <span className="legend-key">{key}:</span>
            <span className="legend-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;