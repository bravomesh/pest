import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../plugins/Control.FullScreen.css';
import '../plugins/Control.FullScreen.js';
import '../plugins/leaflet.browser.print.min.js';
import '../plugins/Leaflet.Control.Layers.Tree-master/L.Control.Layers.Tree.css';
import '../plugins/Leaflet.Control.Layers.Tree-master/L.Control.Layers.Tree.js';
import '../css/MapDisplay.css';

const MapComponent = forwardRef(({ layersVisibility, filteredLayers, onToggleLayer, onMapInitialized }, ref) => {
  const mapRef = useRef(null);
  const overlayLayersRef = useRef({});
  const treeControlRef = useRef(null);

  const colorRamps = {
    'pews:soil_layer': [
      { range: '-5 to -3', color: '#8c510a', label: 'Dark Brown' },
      { range: '-3 to -1', color: '#d8b365', label: 'Medium Brown' },
      { range: '-1 to 1', color: '#f6e8c3', label: 'Light Brown' },
      { range: '1 to 3', color: '#c7eae5', label: 'Light Beige' },
      { range: '3 to 5', color: '#5ab4ac', label: 'Medium Beige' },
      { range: '5+', color: '#01665e', label: 'Dark Beige' },
    ],
    'pews:temp_layer': [
      { range: '0 to 2', color: '#fff5f0', label: 'Lightest Red' },
      { range: '2 to 4', color: '#fee0d2', label: 'Very Light Red' },
      { range: '4 to 6', color: '#fcbba1', label: 'Light Red' },
      { range: '6 to 8', color: '#fc9272', label: 'Medium Light Red' },
      { range: '8 to 10', color: '#fb6a4a', label: 'Medium Red' },
      { range: '10+', color: '#ef3b2c', label: 'Medium Dark Red' },
    ],
    'pews:spi_layer': [
      { range: '0 to 40', color: '#f7fbff', label: 'Lightest Blue' },
      { range: '41 to 80', color: '#deebf7', label: 'Very Light Blue' },
      { range: '81 to 120', color: '#c6dbef', label: 'Light Blue' },
      { range: '121 to 160', color: '#9ecae1', label: 'Medium Light Blue' },
      { range: '161 to 180', color: '#6baed6', label: 'Medium Blue' },
      { range: '181 to 200', color: '#4292c6', label: 'Medium Dark Blue' },
      { range: '200+', color: '#084594', label: 'Darkest Blue' },
    ],
  };

  useImperativeHandle(ref, () => ({
    invalidateSize: () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    },
    getLayerByName: (name) => {
      return overlayLayersRef.current[name];
    },
    getBounds: () => {
      if (mapRef.current) {
        return mapRef.current.getBounds();
      }
    },
    getSize: () => {
      if (mapRef.current) {
        return mapRef.current.getSize();
      }
    }
  }));

  useEffect(() => {
    initializeMap();
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    updateLayerVisibility();
  }, [layersVisibility]);

  useEffect(() => {
    updateFilteredLayers();
  }, [filteredLayers]);

  const initializeMap = () => {
    const baseLayers = {
      "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
      "Esri World Imagery": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      }),
      "Esri World Terrain": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
      }),
    };

    const overlayLayers = {
      "pews:soil_layer": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
        layers: 'igad:vw_temp_soil_with_geom',
        format: 'image/png',
        transparent: true,
        styles: 'soil_style',
        opacity: 1,
      }),
      "pews:temp_layer": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
        layers: 'igad:vw_temp_temperature_with_geom',
        format: 'image/png',
        transparent: true,
        styles: 'temperature_style',
        opacity: 1,
      }),
      "pews:spi_layer": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
        layers: 'igad:vw_temp_spi_with_geom',
        format: 'image/png',
        transparent: true,
        styles: 'spi_style',
        opacity: 1,
      }),
      "pews:boundary_layer": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
        layers: 'igad:boundary',
        format: 'image/png',
        transparent: true,
        styles: 'boundary_style',
        opacity: 1,
      }),
    };

    const map = L.map('map', {
      center: [9.145, 30.4444],
      zoom: 4.4,
      layers: [baseLayers["OpenStreetMap"]],
      fullscreenControl: true,
    });

    mapRef.current = map;

    Object.entries(overlayLayers).forEach(([name, layer]) => {
      overlayLayersRef.current[name] = layer;
      if (layersVisibility[name]) {
        layer.addTo(map);
      }
    });

    const baseTree = {
      label: 'Base Layers',
      children: Object.entries(baseLayers).map(([label, layer]) => ({ label, layer })),
      collapsed: true,
    };

    const overlayTree = {
      label: 'Overlays',
      children: Object.entries(overlayLayers).map(([label, layer]) => ({
        label,
        layer,
        children: colorRamps[label] ? colorRamps[label].map((ramp) => ({
          label: `<div class="color-ramp" style="background-color: ${ramp.color}; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></div> ${ramp.label} (${ramp.range})`,
          layer: null,
        })) : null,
      })),
    };

    treeControlRef.current = L.control.layers.tree(baseTree, overlayTree, {
      collapsed: false,
    }).addTo(map);

    // Add the home button
    const homeButton = L.Control.extend({
      options: {
        position: 'topleft',
      },
      onAdd: function (map) {
        const button = L.DomUtil.create('button', 'home-button');
        button.title = 'Go to Home';
        button.innerHTML = '<i class="fas fa-home"></i>';
        button.style.backgroundColor = 'white';
        button.style.padding = '10px';
        button.style.cursor = 'pointer';

        L.DomEvent.on(button, 'click', () => {
          map.setView([9.145, 30.4444], 4.4);
        });

        return button;
      },
    });
    map.addControl(new homeButton());

    // Add scale control
    L.control.scale({ position: 'bottomleft' }).addTo(map);

    map.on('click', handleMapClick);
    map.on('overlayadd', handleOverlayAdd);
    map.on('overlayremove', handleOverlayRemove);

    onMapInitialized();
  };

  const updateLayerVisibility = () => {
    const map = mapRef.current;
    if (map) {
      Object.entries(overlayLayersRef.current).forEach(([layerName, layer]) => {
        if (layersVisibility[layerName]) {
          map.addLayer(layer);
        } else {
          map.removeLayer(layer);
        }
      });
    }
  };

  const updateFilteredLayers = () => {
    const map = mapRef.current;
    if (map && filteredLayers) {
      Object.entries(filteredLayers).forEach(([layerName, features]) => {
        if (overlayLayersRef.current[layerName]) {
          map.removeLayer(overlayLayersRef.current[layerName]);
        }
  
        if (features && features.length > 0) {
          const filteredLayer = L.geoJSON(features, {
            style: (feature) => {
              return { color: '#ff7800', weight: 5, opacity: 0.65 };
            },
            onEachFeature: (feature, layer) => {
              const popupContent = Object.entries(feature.properties)
                .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
                .join('<br>');
              layer.bindPopup(popupContent);
            }
          });
  
          filteredLayer.addTo(map);
          overlayLayersRef.current[layerName] = filteredLayer;
        } else {
          // If no features, add the original WMS layer back
          const originalLayer = L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
            layers: `igad:${layerName.split(':')[1]}`,
            format: 'image/png',
            transparent: true,
            styles: `${layerName.split(':')[1].replace('_layer', '')}_style`,
            opacity: 1,
          });
          originalLayer.addTo(map);
          overlayLayersRef.current[layerName] = originalLayer;
        }
      });
    }
  };

  const handleMapClick = async (e) => {
    const latlng = e.latlng;
    const layers = Object.keys(overlayLayersRef.current);
    let tabHeaders = '';
    let tabContents = '';

    for (const [index, layerName] of layers.entries()) {
      const layer = overlayLayersRef.current[layerName];
      if (layerName.startsWith('pews:soil_layer') || layerName.startsWith('pews:temp_layer') || layerName.startsWith('pews:spi_layer')) {
        const url = getFeatureInfoUrl(layer, latlng);

        try {
          const response = await fetch(url);
          const data = await response.json();
          const isActive = index === 0 ? 'active' : '';
          tabHeaders += `<div class="tab ${isActive}" data-tab="${index + 1}">${layerName.replace('pews:', '').replace('_layer', '').toUpperCase()}</div>`;

          let content = '<table class="popup-table">';
          if (data.features && data.features.length > 0) {
            const properties = data.features[0].properties;
            for (const [key, value] of Object.entries(properties)) {
              content += `<tr><td class="key">${key}</td><td class="value">${value}</td></tr>`;
            }
          } else {
            content += '<tr><td colspan="2">No data available for this location.</td></tr>';
          }
          content += '</table>';

          tabContents += `<div class="tab-content ${isActive}" id="tab-${index + 1}">${content}</div>`;
        } catch (error) {
          console.error('Error fetching WMS GetFeatureInfo:', error);
        }
      }
    }

    const popupContent = `
      <div class="popup-content">
        <div class="tabs">
          ${tabHeaders}
        </div>
        <div class="popup-tabs">
          ${tabContents}
        </div>
      </div>
    `;

    L.popup()
      .setLatLng(latlng)
      .setContent(popupContent)
      .openOn(mapRef.current);

    setupTabEventListeners();
  };

  const getFeatureInfoUrl = (layer, latlng) => {
    const map = mapRef.current;
    const point = map.latLngToContainerPoint(latlng);
    const size = map.getSize();

    return `${layer._url}?service=WMS&version=1.1.0&request=GetFeatureInfo&layers=${layer.options.layers}&query_layers=${layer.options.layers}&info_format=application/json&x=${Math.round(point.x)}&y=${Math.round(point.y)}&width=${size.x}&height=${size.y}&srs=EPSG:4326&bbox=${map.getBounds().toBBoxString()}`;
  };

  const setupTabEventListeners = () => {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', function() {
        const tabNumber = this.getAttribute('data-tab');

        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`tab-${tabNumber}`).classList.add('active');
      });
    });
  };

  const handleOverlayAdd = (e) => {
    const layerName = Object.keys(overlayLayersRef.current).find(key => overlayLayersRef.current[key] === e.layer);
    if (layerName) onToggleLayer(layerName, true);
  };

  const handleOverlayRemove = (e) => {
    const layerName = Object.keys(overlayLayersRef.current).find(key => overlayLayersRef.current[key] === e.layer);
    if (layerName) onToggleLayer(layerName, false);
  };

  return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
});

export default MapComponent;
