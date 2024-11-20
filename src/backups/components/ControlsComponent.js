// src/components/ControlsComponent.js
import React from 'react';

const ControlsComponent = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="controls">
      <button onClick={onZoomIn}>Zoom In</button>
      <button onClick={onZoomOut}>Zoom Out</button>
    </div>
  );
};

export default ControlsComponent;
