import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../plugins/Control.FullScreen.css';
import '../plugins/Control.FullScreen.js';
import '../plugins/leaflet.browser.print.min.js';
import '../plugins/Leaflet.Control.Layers.Tree-master/L.Control.Layers.Tree.css';
import '../plugins/Leaflet.Control.Layers.Tree-master/L.Control.Layers.Tree.js';
import '../css/MapDisplay.css';
//import * as turf from '@turf/turf';
//import Legend from '../components/Legend';

const MapComponent = forwardRef(({ layersVisibility, filteredLayers, onToggleLayer, onMapInitialized, selectedCountry }, ref) => {
  const mapRef = useRef(null);
  const overlayLayersRef = useRef({});
  const treeControlRef = useRef(null);
  const isUpdatingRef = useRef(false);
  //const [setLegendInfo] = useState(null);
  const [isLegendOpen] = useState(false);
  const [countryBoundaries, setCountryBoundaries] = useState({});  

  const colorRamps = useMemo(() => ({
    'Soil Moisture': {
      colors: ['#FFDB58', '#A2A9D5', '#3D348B'],
      label: 'Soil Moisture',
      min: 'Low',
      max: 'High',
      unit: 'm³/m³'
    },
    'Temperature': {
      colors: ['#FFFF00', '#FFA500', '#FF0000'],
      label: 'Temperature',
      min: 'Low',
      max: 'High',
      unit: '°C'
    },
    'Precipitation': {
      colors: ['#ADD8E6', '#6495ED', '#00008B'],
      label: 'Precipitation',
      min: 'Low',
      max: 'High',
      unit: 'mm'
    },
    'Wind Speed': {
      colors: ['#A52A2A', '#FFA500', '#008080'],
      label: 'Wind Speed',
      min: 'Low',
      max: 'High',
      unit: 'm/s'
    },
    'Soil Temperature': {
      colors: ['#00FF00', '#FFFF00', '#800080'],
      label: 'Soil Temperature',
      min: 'Low',
      max: 'High',
      unit: '°C'
    },
    'Desert Locust Risk': {
      colors: ['#FFFFFF', '#ffef70', '#fca341'],
      label: 'Outbreak Probability',
      min: 'Low',
      max: 'High',
      unit: ''
    },
  }), []);

  const baseLayers = useMemo(() => ({
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }),
    "Esri World Imagery": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    }),
    "Esri World Terrain": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
    }),
    "ICPAC Drought Watch": L.tileLayer('https://eahazardswatch.icpac.net/tileserver-gl/styles/droughtwatch/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://eahazardswatch.icpac.net/">ICPAC Drought Watch</a>',
      tileSize: 512,
      zoomOffset: -1,
    }),
  }), []);

  const overlayLayers = useMemo(() => ({
    "Soil Temperature": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
      layers: 'igad:stl_clipped',
      format: 'image/png',
      transparent: true,
      styles: 'stl_clipped',
      opacity: 1,
    }),
    "Wind Speed": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
      layers: 'igad:uvlevel_view',
      format: 'image/png',
      transparent: true,
      styles: 'wind_grid',
      opacity: 1,
    }),
    "Soil Moisture": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
      layers: 'igad:swv_clipped',
      format: 'image/png',
      transparent: true,
      styles: 'swv_clipped',
      opacity: 1,
    }),
    "Temperature": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
      layers: 'igad:t2m_clipped',
      format: 'image/png',
      transparent: true,
      styles: 't2m_clipped',
      opacity: 1,
    }),
   /* "Precipitation": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
      layers: 'igad:spi_clipped',
      format: 'image/png',
      transparent: true,
      styles: 'spi_grid',
      opacity: 1,
    }),
	*/
	"Precipitation": L.tileLayer.wms('https://droughtwatch.icpac.net/mapcache/', {
      layers: 'spi_chirps_tileset',
      format: 'image/png',
      transparent: true,
	  version: '1.1.1',
      styles: '	spi_style_NEW',
      opacity: 1,
	  crs: L.CRS.EPSG900913,
    }),
	
	
    "Desert Locust Risk": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
      layers: 'igad:rkslevel_view',
	  //layers: 'igad:rkslevel_view_new',
	  layers: 'igad:maxentoutputlayer',
      format: 'image/png',
      transparent: true,
		styles: 'maxentoutputstyle',
      //styles: 'risk_style',
      opacity: 1, 
    }),
	
	
	
    "Boundary": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
      layers: 'igad:boundary',
      format: 'image/png',
      transparent: true,
      styles: 'boundary_style',
      opacity: 1,
    }),
    "Band Master": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
      layers: 'igad:band1',
      format: 'image/png',
      transparent: true,
      styles: 'bands_style',
      opacity: 1,
      //cql_filter: `finishdate BETWEEN '${mostRecentYear}-01-01' AND '${mostRecentYear}-12-31'`
    }),
    "Hoppers": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
      layers: 'igad:hopperview',
      format: 'image/png',
      transparent: true,
      //styles: 'hopper_style',
	  styles: 'newhoppersstyle',
	  
      opacity: 1,
    }),
    "Swarms": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
      layers: 'igad:swarmview',
      format: 'image/png',
      transparent: true,
      styles: 'swarm_style',
      opacity: 1,
    }),
    "Breeding Sites": L.tileLayer.wms('http://localhost:8080/geoserver/igad/wms', {
      layers: 'igad:band1',
      format: 'image/png',
      transparent: true,
      styles: 'breeding_style',
      opacity: 1,
      //cql_filter: `finishdate BETWEEN '${mostRecentYear}-01-01' AND '${mostRecentYear}-12-31'`
    }),
  }), []);

  const RISK_LAYER_NAME = "Desert Locust Risk"; // Define the name of the risk layer
  const handleMapClick = useCallback(async (e) => {
    const latlng = e.latlng;
    const visibleLayers = Object.entries(layersVisibility)
      .filter(([_, isVisible]) => isVisible)
      .map(([layerName]) => layerName);

    if (visibleLayers.length === 0) {
      console.log('No visible layers');
      return;
    }

    const riskLayer = overlayLayersRef.current[RISK_LAYER_NAME]; // Use the defined risk layer name

    if (!riskLayer) {
      console.log('Risk layer not found');
      return;
    }

    const getFeatureInfoUrl = (layer, latlng) => {
      const point = mapRef.current.latLngToContainerPoint(latlng);
      const size = mapRef.current.getSize();
      const bounds = mapRef.current.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      const params = {
        request: 'GetFeatureInfo',
        service: 'WMS',
        srs: 'EPSG:4326',
        styles: layer.wmsParams.styles,
        transparent: layer.wmsParams.transparent,
        version: layer.wmsParams.version,
        format: layer.wmsParams.format,
        bbox: [sw.lng, sw.lat, ne.lng, ne.lat].join(','),
        height: size.y,
        width: size.x,
        layers: layer.wmsParams.layers,
        query_layers: layer.wmsParams.layers,
        info_format: 'application/json',
        x: Math.round(point.x),
        y: Math.round(point.y)
      };

      return layer._url + L.Util.getParamString(params, layer._url, true);
    };

    // First, get the country name from the boundary layer
    const boundaryLayer = overlayLayersRef.current["Boundary"];
    const boundaryUrl = getFeatureInfoUrl(boundaryLayer, latlng);

    try {
      const boundaryResponse = await fetch(boundaryUrl);
      const boundaryData = await boundaryResponse.json();

      let countryName = 'Unknown Country';
      if (boundaryData.features && boundaryData.features.length > 0) {
        countryName = boundaryData.features[0].properties.name || 'Unknown Country'; // Adjust based on your data structure
      }

      // Now, get the risk information from the risk layer
      const riskUrl = getFeatureInfoUrl(riskLayer, latlng);
      const riskResponse = await fetch(riskUrl);
      const riskData = await riskResponse.json();

      let riskLevel = 'Unknown Risk Level';
      if (riskData.features && riskData.features.length > 0) {
        riskLevel = riskData.features[0].properties.risk || 'Unknown Risk Level'; // Use 'risk' column
      }

      // Create a popup with the country name and risk information
      const popupContent = `
        <div>
          <strong>Country:</strong> ${countryName}<br>
          <strong>Risk Level:</strong> ${riskLevel}<br>
          <button class="analytics-button" onclick="window.location.href='/analytics'">ANALYZE</button>
        </div>
      `;

      L.popup()
        .setLatLng(latlng)
        .setContent(popupContent)
        .openOn(mapRef.current);
    } catch (error) {
      console.error('Error fetching WMS GetFeatureInfo:', error);
    }
  }, [layersVisibility]);



  const handleOverlayAdd = useCallback((e) => {
    if (isUpdatingRef.current) return;
    const layerName = Object.keys(overlayLayersRef.current).find(key => overlayLayersRef.current[key] === e.layer);
    if (layerName) onToggleLayer(layerName, true);
  }, [onToggleLayer]);

  const handleOverlayRemove = useCallback((e) => {
    if (isUpdatingRef.current) return;
    const layerName = Object.keys(overlayLayersRef.current).find(key => overlayLayersRef.current[key] === e.layer);
    if (layerName) onToggleLayer(layerName, false);
  }, [onToggleLayer]);

  const updateTreeControl = useCallback(() => {
    if (!mapRef.current) return;

    if (treeControlRef.current) {
      mapRef.current.removeControl(treeControlRef.current);
    }

    const baseTree = {
      label: 'Base Layers',
      children: Object.entries(baseLayers).map(([label, layer]) => ({ label, layer })),
      collapsed: true,
    };

    const createLegend = (colorRamp) => {
      const { colors, label, unit } = colorRamp;
      
      // Add specific value ranges based on the layer type
      const getValueRanges = (layerType) => {
        const ranges = {
          'Soil Moisture': { high: '0.4-0.5', moderate: '0.2-0.4', low: '0-0.2' },
          'Temperature': { high: '35-45', moderate: '25-35', low: '15-25' },
          'Precipitation': { high: '100+', moderate: '50-100', low: '0-50' },
          'Wind Speed': { high: '15+', moderate: '8-15', low: '0-8' },
          'Soil Temperature': { high: '35-45', moderate: '25-35', low: '15-25' },
          'Desert Locust Risk': { high: '>6', moderate: '>3 <6', low: '<3' }, // Updated with specific ranges
        };
        return ranges[layerType] || { high: '>6', moderate: '>3 <6', low: '<3>' };
      };
    
      const valueRanges = getValueRanges(label);
      
      return `
        <div class="legend-item">
          <div class="legend-title">${label}</div>
          <div class="legend-gradient-container">
            <div class="color-gradient" style="background: linear-gradient(to top, ${colors.join(', ')});"></div>
            <div class="legend-labels">
              <div class="legend-label">
                <span class="legend-color" style="background-color: ${colors[colors.length - 1]};"></span>
                <span class="legend-text">
                  <strong>${valueRanges.high}</strong>
                  <span class="legend-unit">${unit}</span>
                  <br/>
                  <small>High</small> <!-- Display 'High' -->
                </span>
              </div>
              <div class="legend-label">
                <span class="legend-color" style="background-color: ${colors[Math.floor(colors.length / 2)]};"></span>
                <span class="legend-text">
                  <strong>${valueRanges.moderate}</strong>
                  <span class="legend-unit">${unit}</span>
                  <br/>
                  <small>Moderate</small> <!-- Display 'Moderate' -->
                </span>
              </div>
              <div class="legend-label">
                <span class="legend-color" style="background-color: ${colors[0]};"></span>
                <span class="legend-text">
                  <strong>${valueRanges.low}</strong>
                  <span class="legend-unit">${unit}</span>
                  <br/>
                  <small>Low</small> <!-- Display 'Low' -->
                </span>
              </div>
            </div>
          </div>
        </div>
      `;
    };

    const riskTree = {
      label: 'Risk Layers',
      children: layersVisibility["Desert Locust Risk"]
        ? [
            {
              label: 'Outbreak Probability',
              layer: overlayLayersRef.current["Desert Locust Risk"],
              children: [{ 
                label: createLegend(colorRamps['Desert Locust Risk']),
                layer: null,
              }],
            },
          ]
        : [],
      collapsed: false,
    };

    const breedTree = {
      label: 'Breeding Layers',
      children: layersVisibility["Breeding Sites"]
        ? [
            {
              label: `Breeding Sites <div style="background-color: yellow; width: 15px; height: 15px; border-radius: 50%; display: inline-block;"></div>`,
              layer: overlayLayersRef.current["Breeding Sites"],
              children: [{               
                layer: null,
              }],
            },
          ]
        : [],
      collapsed: false,
    };

    const pestsTree = {
      label: 'Pest Layers',
      children: [
        layersVisibility["Band Master"] && {
          label: `Band Master <div style="background-color: brown; width: 15px; height: 15px; border-radius: 50%; display: inline-block;"></div>`,
          layer: overlayLayersRef.current["Band Master"],
        },
        layersVisibility["Swarms"] && {
          label: `Swarms <div style="background-color: blue; width: 15px; height: 15px; border-radius: 50%; display: inline-block;"></div>`,
          layer: overlayLayersRef.current["Swarms"],
        },
 
		  
		layersVisibility["Hoppers"] && {
          label: `Hoppers <img src="hopper.jpeg" style="width: 15px; height: 15px; display: inline-block; vertical-align: middle;">`,
          layer: overlayLayersRef.current["Hoppers"],
	  
        },
      ].filter(Boolean),
      collapsed: false,
    };

    const climateOrder = ['Soil Temperature', 'Wind Speed', 'Soil Moisture', 'Precipitation', 'Temperature'];

    const climateTree = {
      label: 'Climate Layers',
      children: climateOrder
        .filter(layerName => layersVisibility[layerName])
        .map(layerName => ({
          label: layerName,
          layer: overlayLayersRef.current[layerName],
          children: colorRamps[layerName] ? [{ 
            label: createLegend(colorRamps[layerName]),
            layer: null,
          }] : [],
        })),
      collapsed: false,
    };

    const boundaryTree = {
      label: 'Boundary Layer',
      children: layersVisibility["Boundary"]
        ? [
            {
              label: 'IGAD Boundary',
              layer: overlayLayersRef.current["Boundary"],
            },
          ]
        : [],
      collapsed: false,
    };

    treeControlRef.current = L.control.layers.tree(baseTree, [
      riskTree,
      { label: '<hr style="border: 1px solid #ccc; margin: 5px 0;">' },
      breedTree,
      { label: '<hr style="border: 1px solid #ccc; margin: 5px 0;">' },
      climateTree,
      { label: '<hr style="border: 1px solid #ccc; margin: 5px 0;">' },
      pestsTree,
      { label: '<hr style="border: 1px solid #ccc; margin: 5px 0;">' },
      boundaryTree
    ], {
      collapsed: false,
    }).addTo(mapRef.current);
  }, [layersVisibility, colorRamps, baseLayers]);

  const updateLayerVisibility = useCallback(() => {
    if (!mapRef.current || isUpdatingRef.current) return;
  
    isUpdatingRef.current = true;
    
    // Loop through all layers and add or remove them based on their visibility status
    Object.entries(overlayLayersRef.current).forEach(([layerName, layer]) => {
      if (layersVisibility[layerName]) {
        // Add layer if it is visible
        mapRef.current.addLayer(layer);
      } else {
        // Ensure the layer is added but hidden if it is not visible
        mapRef.current.removeLayer(layer);
      }
    });
  
    // Update the tree control or any other UI reflecting layer states
    updateTreeControl();
    
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);
  }, [layersVisibility, updateTreeControl]);


 const updateFilteredLayers = useCallback(() => {
    if (!mapRef.current) {
      console.warn('Map not initialized');
      return;
    }
  
    // Create a cache for storing layers to prevent flickering
    const layerCache = new Map();
    const pendingTransitions = new Map();
  
    // Helper function to create a new layer with filters
    const createFilteredLayer = (baseLayer, filters) => {
      const options = {
        ...baseLayer.options,
        cql_filter: filters,
        random: Math.random() // Force refresh
      };
  
      return L.tileLayer.wms(baseLayer._url, options);
    };
  
    // Helper function to smoothly transition between layers
    const transitionLayers = (oldLayer, newLayer, layerName) => {
      if (pendingTransitions.has(layerName)) {
        clearTimeout(pendingTransitions.get(layerName));
      }
  
      // Start with new layer at opacity 0
      newLayer.setOpacity(0);
      mapRef.current.addLayer(newLayer);
  
      // Animate the transition
      let progress = 0;
      const duration = 300; // milliseconds
      const interval = 16; // ~60fps
      const steps = duration / interval;
  
      const animate = () => {
        progress++;
        const ratio = progress / steps;
        
        oldLayer.setOpacity(1 - ratio);
        newLayer.setOpacity(ratio);
  
        if (progress < steps) {
          pendingTransitions.set(layerName, 
            setTimeout(animate, interval)
          );
        } else {
          mapRef.current.removeLayer(oldLayer);
          pendingTransitions.delete(layerName);
        }
      };
  
      animate();
    };
  
    // Process layer-specific filters
    Object.entries(filteredLayers).forEach(([layerName, filterData]) => {
      const currentLayer = overlayLayersRef.current[layerName];
      if (!currentLayer) return;
  
      let newFilters = filterData?.cqlFilter || null;
  
      // Combine with country filter if present
      if (selectedCountry) {
        const countryFilter = `name='${selectedCountry}'`;
        newFilters = newFilters ? 
          `(${newFilters}) AND (${countryFilter})` : 
          countryFilter;
      }
  
      // Create cache key
      const cacheKey = `${layerName}-${newFilters || 'none'}`;
  
      // Check cache first
      let newLayer = layerCache.get(cacheKey);
      if (!newLayer) {
        newLayer = createFilteredLayer(currentLayer, newFilters);
        layerCache.set(cacheKey, newLayer);
      }
  
      // Only update if filters have changed
      if (currentLayer.wmsParams.cql_filter !== newFilters) {
        transitionLayers(currentLayer, newLayer, layerName);
        overlayLayersRef.current[layerName] = newLayer;
  
        // Ensure visibility
        if (!layersVisibility[layerName]) {
          onToggleLayer(layerName, true);
        }
      }
    });
  
    // Process country filter for remaining layers
    if (selectedCountry) {
      Object.entries(overlayLayersRef.current).forEach(([layerName, currentLayer]) => {
        if (!currentLayer || filteredLayers[layerName]) return;
  
        const countryFilter = `name='${selectedCountry}'`;
        const cacheKey = `${layerName}-country-${selectedCountry}`;
  
        let newLayer = layerCache.get(cacheKey);
        if (!newLayer) {
          newLayer = createFilteredLayer(currentLayer, countryFilter);
          layerCache.set(cacheKey, newLayer);
        }
  
        if (currentLayer.wmsParams.cql_filter !== countryFilter) {
          transitionLayers(currentLayer, newLayer, layerName);
          overlayLayersRef.current[layerName] = newLayer;
        }
      });
    }
  
    // Clean up cache periodically
    setTimeout(() => {
      layerCache.clear();
    }, 5000);
  
    updateTreeControl();
  }, [filteredLayers, layersVisibility, onToggleLayer, updateTreeControl, selectedCountry]);


  const zoomToCountry = useCallback((country) => {
    if (!country) return;
    
    if (countryBoundaries[country]) {
      const bounds = L.geoJSON(countryBoundaries[country]).getBounds();
      mapRef.current.fitBounds(bounds);
    } else {
      const boundaryUrl = `http://localhost:8080/geoserver/igad/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=igad:boundary&outputFormat=application/json&CQL_FILTER=name='${encodeURIComponent(country)}'`;
      
      fetch(boundaryUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.type === 'FeatureCollection') {
            setCountryBoundaries(prev => ({ ...prev, [country]: data }));
            const bounds = L.geoJSON(data).getBounds();
            mapRef.current.fitBounds(bounds);
          }
        })
        .catch(error => {
          console.error('Error fetching country boundaries:', error);
          mapRef.current.setView([9.127, 42.338], 4);
        });
    }
  }, [countryBoundaries]);

  const initializeMap = useCallback(() => {
    const map = L.map('map', {
      center: [9.127, 42.338],
      zoom: 4.4,
      minZoom: 3,
      layers: [
        baseLayers["ICPAC Drought Watch"],
        overlayLayers["Band Master"],
        overlayLayers["Hoppers"],
        overlayLayers["Swarms"],
      ],
      fullscreenControl: true,
    });

    mapRef.current = map;

    Object.entries(overlayLayers).forEach(([name, layer]) => {
      overlayLayersRef.current[name] = layer;
      if (layersVisibility[name]) {
        layer.addTo(map);
      }
    });

    updateTreeControl();

    const homeButton = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function () {
        const button = L.DomUtil.create('button', 'home-button');
        button.title = 'Go to Home';
        button.innerHTML = '<i class="fas fa-home"></i>';
        button.style.cssText = 'background-color: white; padding: 10px; cursor: pointer;';

        L.DomEvent.disableClickPropagation(button);
        L.DomEvent.on(button, 'click', function () {
          map.setView([9.127, 42.338], 4.4);
        });

        return button;
      },
    });
    map.addControl(new homeButton());

    L.control.scale({ position: 'bottomleft' }).addTo(map);
    L.control.browserPrint({ position: 'bottomleft' }).addTo(map);

    map.on('click', handleMapClick);
    map.on('overlayadd', handleOverlayAdd);
    map.on('overlayremove', handleOverlayRemove);

    onMapInitialized();
  }, [
    onMapInitialized, 
    layersVisibility, 
    baseLayers, 
    overlayLayers, 
    updateTreeControl, 
    handleMapClick, 
    handleOverlayAdd, 
    handleOverlayRemove
  ]);

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
    },
    updateTreeControl: (layerName, isVisible) => {
      if (mapRef.current) {
        const layer = overlayLayersRef.current[layerName];
        if (layer) {
          if (isVisible) {
            mapRef.current.addLayer(layer);
          } else {
            mapRef.current.removeLayer(layer);
          }
          updateTreeControl();
        }
      }
    },
    removeLayer: (layer) => {
      if (mapRef.current) {
        mapRef.current.removeLayer(layer);
      }
    },
  }));

  useEffect(() => {
    initializeMap();
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [initializeMap]);

  useEffect(() => {
    updateLayerVisibility();
  }, [layersVisibility, updateLayerVisibility]);
  // Update the useEffect dependencies for filtered layers
  useEffect(() => {
    updateFilteredLayers();
  }, [selectedCountry, layersVisibility, updateFilteredLayers]);

    useEffect(() => {
    if (selectedCountry && mapRef.current) {
      zoomToCountry(selectedCountry);
    }
  }, [selectedCountry, zoomToCountry, updateLayerVisibility]);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div 
        id="map" 
        style={{ 
          width: isLegendOpen ? 'calc(100% - 300px)' : '100%', 
          height: '100%',
          transition: 'width 0.3s ease-in-out'
        }}
      ></div>

    </div>
  );
});

export default MapComponent;