// LayerTree.js
import React, { useState } from 'react';
import './LayerTree.css'; // Import the CSS for the layer tree

const LayerTree = ({ layers, baseLayers, onToggleLayer, onToggleBaseLayer }) => {
  const [expanded, setExpanded] = useState({});

  const handleToggleExpand = (layerName) => {
    setExpanded((prev) => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const handleToggleLayer = (layerName, styleName, isVisible) => {
    onToggleLayer(layerName, styleName, isVisible);
  };

  const handleToggleBaseLayer = (layerName, isVisible) => {
    onToggleBaseLayer(layerName, isVisible);
  };

  const renderLayer = (layer) => (
    <div key={layer.name} className="layer-item">
      <div className="layer-header" onClick={() => handleToggleExpand(layer.name)}>
        <span>{expanded[layer.name] ? '-' : '+'}</span> {layer.name}
      </div>
      {expanded[layer.name] && (
        <div className="layer-children">
          {layer.styles.map((style) => (
            <div key={style.name} className="layer-child">
              <input
                type="checkbox"
                checked={style.visible}
                onChange={(e) => handleToggleLayer(layer.name, style.name, e.target.checked)}
              /> {style.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBaseLayer = (layer) => (
    <div key={layer.name} className="layer-item">
      <div className="layer-header">
        <input
          type="radio"
          name="base-layer"
          checked={layer.visible}
          onChange={(e) => handleToggleBaseLayer(layer.name, e.target.checked)}
        /> {layer.name}
      </div>
    </div>
  );

  return (
    <div className="layer-tree">
      <div className="layer-group">
        <div className="layer-group-header">Base Maps</div>
        {baseLayers.map((layer) => renderBaseLayer(layer))}
      </div>
      <hr />
      {layers.map((layer) => (
        <React.Fragment key={layer.name}>
          {renderLayer(layer)}
          <hr />
        </React.Fragment>
      ))}
    </div>
  );
};

export default LayerTree;
