import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import TileJSON from 'ol/source/TileJSON';
import TileWMS from 'ol/source/TileWMS';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style, Text } from 'ol/style';
import Overlay from 'ol/Overlay';
import Legend from './Legend'; // Import the Legend component
import '../css/Popup.css';

const MapComponent = forwardRef(({ layersVisibility, toggleLayerVisibility }, ref) => {
  const mapElementRef = useRef();
  const mapInstanceRef = useRef();
  const popupRef = useRef();
  const popupOverlayRef = useRef();
  const [layerIcons, setLayerIcons] = useState({});
  const [popupContent, setPopupContent] = useState('');

  useImperativeHandle(ref, () => ({
    toggleLayerVisibility: (layerName, visibility) => {
      const layers = mapInstanceRef.current.getLayers().getArray();
      layers.forEach(layer => {
        if (layer.get('name') === layerName) {
          layer.setVisible(visibility);
        }
      });
    },
  }));

  const getLegendIconUrl = (layerName) => {
    const geoServerDomain = 'http://10.10.1.13:8085';
    return `${geoServerDomain}/geoserver/pews/wms?service=WMS&version=1.1.0&request=GetLegendGraphic&layer=${layerName}&format=image/png`;
  };

  const handleMapClick = (event) => {
    const map = mapInstanceRef.current;
    const pixel = map.getEventPixel(event.originalEvent);
    const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);
    if (feature) {
      const attributes = feature.getProperties();
      const selectedColumns = ['SOVEREIGNT', 'ECONOMY']; // Replace with your actual column names
      const info = selectedColumns.map(column => {
        if (column === 'SOVEREIGNT') {
          return `${attributes[column]}`;
        } else {
          return `<strong>${column}</strong>: ${attributes[column]}`;
        }
      }).join('<br>');

      const customMessage = `<p>This is a custom message.</p>`;
      const analysisLink = `<a href="/analysis?feature=${attributes.id}" target="_blank">Go to Analysis</a>`;
      
      const content = `${info}<br>${customMessage}<br>${analysisLink}`;

      setPopupContent(content);
      const coordinates = event.coordinate;
      popupOverlayRef.current.setPosition(coordinates);
    } else {
      handleClosePopup();
    }
  };

  const handleClosePopup = () => {
    popupOverlayRef.current.setPosition(undefined);
    setPopupContent('');
  };

  useEffect(() => {
    const mapTilerKey = 'HAaLzzHJ6wpAGt1lzWi4'; 

    // MapTiler layer
    const mapTilerLayer = new TileLayer({
      source: new TileJSON({
        url: `https://api.maptiler.com/maps/basic/tiles.json?key=${mapTilerKey}`,
        crossOrigin: 'anonymous',
      }),
      visible: layersVisibility['mapTiler'], // Adjust based on your visibility logic
      name: 'mapTiler', // Name for identification
    });

    // GeoServer WMS layers
    const bandDlCustomLayer = new TileLayer({
      source: new TileWMS({
        url: 'http://10.10.1.13:8085/geoserver/pews/wms',
        params: { 'LAYERS': 'pews:band_dl_custom', 'TILED': true },
        serverType: 'geoserver',
        transition: 0,
      }),
      visible: layersVisibility['pews:band_dl_custom'],
      name: 'pews:band_dl_custom',
    });

    const newswamsLayer = new TileLayer({
      source: new TileWMS({
        url: 'http://10.10.1.13:8085/geoserver/pews/wms',
        params: { 'LAYERS': 'pews:newswams', 'TILED': true },
        serverType: 'geoserver',
        transition: 0,
      }),
      visible: layersVisibility['pews:newswams'],
      name: 'pews:newswams',
    });

    const newhoppersLayer = new TileLayer({
      source: new TileWMS({
        url: 'http://10.10.1.13:8085/geoserver/pews/wms',
        params: { 'LAYERS': 'pews:newhoppers', 'TILED': true },
        serverType: 'geoserver',
        transition: 0,
      }),
      visible: layersVisibility['pews:newhoppers'],
      name: 'pews:newhoppers',
    });

    // Add new WMS layer for SPI data
    const spiLayer = new TileLayer({
      source: new TileWMS({
        url: 'http://10.10.1.13:8085/geoserver/pews/wms',
        params: { 'LAYERS': 'pews:spi_layer', 'TILED': true },
        serverType: 'geoserver',
        transition: 0,
      }),
      visible: layersVisibility['pews:spi_layer'],
      name: 'pews:spi_layer',
    });
	
	// Add new WMS layer for TEMPERATURE data
    const TempLayer = new TileLayer({
      source: new TileWMS({
        url: 'http://10.10.1.13:8085/geoserver/pews/wms',
        params: { 'LAYERS': 'pews:temp_layer', 'TILED': true },
        serverType: 'geoserver',
        transition: 0,
      }),
      visible: layersVisibility['pews:temp_layer'],
      name: 'pews:temp_layer',
    });
	
	
// Add new WMS layer for Rainfall data
    const RainLayer = new TileLayer({
      source: new TileWMS({
        url: 'http://10.10.1.13:8085/geoserver/pews/wms',
        params: { 'LAYERS': 'pews:chirps-v2.0.2024.05', 'TILED': true },
        serverType: 'geoserver',
        transition: 0,
      }),
      visible: layersVisibility['pews:chirps-v2.0.2024.05'],
      name: 'pews:chirps-v2.0.2024.05',
    });


    const map = new Map({
      target: mapElementRef.current,
      layers: [mapTilerLayer, spiLayer, TempLayer], // Add the SPI layer here
      view: new View({
        center: fromLonLat([30.4444, 9.1450]),
        zoom: 5,
        minZoom: 4, // Set the minimum zoom level
        maxZoom: 18, // Set the maximum zoom level (default is 18)
      }),
    });

    // Create an overlay for the popup
    const popupOverlay = new Overlay({
      element: popupRef.current,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });
    popupOverlayRef.current = popupOverlay;
    map.addOverlay(popupOverlay);

    map.on('click', handleMapClick);

    // Close popup when clicking outside of it
    const handleMapSingleClick = (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      if (!feature) {
        handleClosePopup();
      }
    };

    map.on('singleclick', handleMapSingleClick);

    // Load and display the IGAD GeoJSON file
    fetch('/new_map_igad_Region.geojson')
      .then(response => response.json())
      .then(data => {
        const igadSource = new VectorSource({
          features: new GeoJSON().readFeatures(data, {
            featureProjection: 'EPSG:3857',
          }),
        });

        const igadStyle = new Style({
          stroke: new Stroke({
            color: 'black',
            width: 2,
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0)', // White fill color for IGAD countries
          }),
          text: new Text({
            font: '12px Calibri,sans-serif',
            overflow: true,
            fill: new Fill({
              color: '#000',
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 3,
            }),
          }),
        });

        const igadLayer = new VectorLayer({
          source: igadSource,
          style: feature => {
            igadStyle.getText().setText(feature.get('ADMIN')); // Assuming 'ADMIN' property has country names
            return igadStyle;
          },
          name: 'igadLayer',
        });

        // Add the IGAD vector layer to the map first
        map.addLayer(igadLayer);
        map.addLayer(bandDlCustomLayer);
        map.addLayer(newswamsLayer);
        map.addLayer(newhoppersLayer);
		map.addLayer(RainLayer);
		
		

		
      });

    // Load and display the mask GeoJSON file for non-IGAD land regions
    fetch('/non_igad_land_mask.geojson')
      .then(response => response.json())
      .then(data => {
        const maskSource = new VectorSource({
          features: new GeoJSON().readFeatures(data, {
            featureProjection: 'EPSG:3857',
          }),
        });

        const maskLayer = new VectorLayer({
          source: maskSource,
          style: new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0)', // White fill color to mask non-IGAD land regions
            }),
          }),
          name: 'maskLayer',
        });

        // Add the masking vector layer to the map
        map.addLayer(maskLayer);
      });

    // Generate icon URLs
    const icons = {
      'pews:band_dl_custom': getLegendIconUrl('pews:band_dl_custom'),
      'pews:newswams': getLegendIconUrl('pews:newswams'),
      'pews:newhoppers': getLegendIconUrl('pews:newhoppers'),
      'pews:spi_layer': getLegendIconUrl('pews:spi_layer'), // Add SPI layer legend URL spi_layer temp_layer
	  'pews:temp_layer': getLegendIconUrl('pews:temp_layer'), // Add SPI layer legend URL
	  'pews:chirps-v2.0.2024.05': getLegendIconUrl('pews:chirps-v2.0.2024.05'), // Add SPI layer legend URL
    };
	
	
	

    setLayerIcons(icons);

    mapInstanceRef.current = map;
    return () => map.setTarget(null);
  }, [layersVisibility]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '900px' }}>
      <div ref={mapElementRef} style={{ width: '100%', height: '100%' }} />
      <Legend
        activeLayers={Object.keys(layersVisibility).filter(layer => layersVisibility[layer])}
        layerIcons={layerIcons}
        toggleLayerVisibility={toggleLayerVisibility}
        style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}
      />
      <div ref={popupRef} id="popup" className="ol-popup">
        <div className="ol-popup-closer" onClick={handleClosePopup}></div>
        <div id="popup-content" dangerouslySetInnerHTML={{ __html: popupContent }} />
      </div>
    </div>
  );
});

export default MapComponent;
