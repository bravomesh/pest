import React, { useState } from 'react';

const ControlPanel = ({ toggleLayerVisibility }) => {
  const [layersVisibility, setLayersVisibility] = useState({
    'pews:band_dl_custom': true,
    'pews:newswams': true,
    'pews:newhoppers': true,
	'pews:spi_layer': true,
	'pews:temp_layer': true,
	'pews:chirps-v2.0.2024.05': true,
  });

  const handleToggle = (layer) => {
    const updatedVisibility = { ...layersVisibility, [layer]: !layersVisibility[layer] };
    setLayersVisibility(updatedVisibility);
    toggleLayerVisibility(layer, updatedVisibility[layer]);
  };

  return (
    <div>
      <div className="layer-toggle">
        <span>Bands</span>
        <div className={`toggle-switch ${layersVisibility['pews:band_dl_custom'] ? 'on' : 'off'}`} onClick={() => handleToggle('pews:band_dl_custom')}>
          <div className="toggle-knob"></div>
        </div>
      </div>
      <div className="layer-toggle">
        <span>Swams</span>
        <div className={`toggle-switch ${layersVisibility['pews:newswams'] ? 'on' : 'off'}`} onClick={() => handleToggle('pews:newswams')}>
          <div className="toggle-knob"></div>
        </div>
      </div>
      <div className="layer-toggle">
        <span>Hoppers</span>
        <div className={`toggle-switch ${layersVisibility['pews:newhoppers'] ? 'on' : 'off'}`} onClick={() => handleToggle('pews:newhoppers')}>
          <div className="toggle-knob"></div>
        </div>
      </div>
	  <div className="layer-toggle">
        <span>SPI</span>
        <div className={`toggle-switch ${layersVisibility['pews:spi_layer'] ? 'on' : 'off'}`} onClick={() => handleToggle('pews:spi_layer')}>
          <div className="toggle-knob"></div>
        </div>
      </div>
	  <div className="layer-toggle">
        <span>Temperature</span>
        <div className={`toggle-switch ${layersVisibility['pews:temp_layer'] ? 'on' : 'off'}`} onClick={() => handleToggle('pews:temp_layer')}>
          <div className="toggle-knob"></div>
        </div>
      </div>
	   <div className="layer-toggle">
        <span>Rainfall</span>
        <div className={`toggle-switch ${layersVisibility['pews:chirps-v2.0.2024.05'] ? 'on' : 'off'}`} onClick={() => handleToggle('pews:chirps-v2.0.2024.05')}>
          <div className="toggle-knob"></div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
