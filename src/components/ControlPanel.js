import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios';
import 'react-tabs/style/react-tabs.css';
import '../css/ControlPanel.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ControlPanel = ({
  layersVisibility,
  toggleLayerVisibility,
  onApplyFilter,
  onClearFilter,
  layerNameMapping,
  onInfoIconClick,
  onCountryFilter,
  addLogMessage = (msg, type) => console.log(`${type}: ${msg}`),
}) => {
  const [layerFilters, setLayerFilters] = useState({});
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);
  const [groupVisibility, setGroupVisibility] = useState({
    DesertLocust: true,
    QueleaBirds: true,
    FallArmyworms: true
  });
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get('http://localhost:8080/geoserver/igad/wms', {
          params: {
            service: 'WFS',
            version: '2.0.0',
            request: 'GetFeature',
            typeName: 'swarm',
            propertyName: 'finishdate',
            outputFormat: 'application/json',
          },
        });
  
        // Extract and validate years from the finishdate
        const uniqueYears = [...new Set(
          response.data.features
            .map(feature => {
              // Ensure finishdate exists and parse it properly
              const dateStr = feature.properties?.finishdate;
              if (!dateStr) return null;
              
              // Parse the date string and extract the year
              const date = new Date(dateStr);
              const year = date.getFullYear();
              
              // Validate the year is a reasonable number
              return !isNaN(year) && year > 1900 && year <= new Date().getFullYear() 
                ? year 
                : null;
            })
            .filter(year => year !== null) // Remove any null values
        )].sort((a, b) => b - a); // Sort years in descending order
  
        setYears(uniqueYears);
      } catch (error) {
        console.error("Error fetching years from GeoServer:", error);
        // Set some default years range if the fetch fails
        const currentYear = new Date().getFullYear();
        const defaultYears = Array.from(
          { length: 10 }, 
          (_, i) => currentYear - i
        );
        setYears(defaultYears);
      }
    };
  
    fetchYears();
  }, []);

  // Define the mapping between groups and their layers
  const groupLayerMapping = useMemo(() => ({
    DesertLocust: ['Band Master', 'Swarms', 'Hoppers'],
    QueleaBirds: ['Quelea Birds'],
    FallArmyworms: ['Fall Armyworms']
  }), []);

  const createLayerId = (groupName, layerName, geoserverName) => {
    return `${groupName}-${layerName}-${geoserverName || layerName}`.replace(/\s+/g, '_');
  };

  // Modified layer groups structure to include unique identifiers
  const layerGroupsMonitoring = {
    DesertLocust: [
      { 
        name: 'Outbreak Probability', 
        geoserverName: 'Soil Moisture',
        id: createLayerId('DesertLocust', 'Outbreak Probability', 'Soil Moisture')
      },
      { 
        name: 'Habitat Suitability', 
        geoserverName: 'Wind Speed',
        id: createLayerId('DesertLocust', 'Habitat Suitability', 'Wind Speed')
      },
      { 
        name: 'Breeding Sites', 
        geoserverName: 'Soil Temperature',
        id: createLayerId('DesertLocust', 'Breeding Sites', 'Soil Temperature')
      },
      { 
        name: 'Current Infestation',
        id: createLayerId('DesertLocust', 'Current Infestation')
      }
    ],
    QueleaBirds: [
      { 
        name: 'Outbreak Probability', 
        geoserverName: 'Soil Moisture',
        id: createLayerId('QueleaBirds', 'Outbreak Probability', 'Soil Moisture')
      },
      { 
        name: 'Habitat Suitability', 
        geoserverName: 'Wind Speed',
        id: createLayerId('QueleaBirds', 'Habitat Suitability', 'Wind Speed')
      },
      { 
        name: 'Breeding Sites', 
        geoserverName: 'Soil Temperature',
        id: createLayerId('QueleaBirds', 'Breeding Sites', 'Soil Temperature')
      },
      { 
        name: 'Current Infestation',
        id: createLayerId('QueleaBirds', 'Current Infestation')
      }
    ],
    FallArmyworms: [
      { 
        name: 'Outbreak Probability', 
        geoserverName: 'Soil Moisture',
        id: createLayerId('FallArmyworms', 'Outbreak Probability', 'Soil Moisture')
      },
      { 
        name: 'Habitat Suitability', 
        geoserverName: 'Wind Speed',
        id: createLayerId('FallArmyworms', 'Habitat Suitability', 'Wind Speed')
      },
      { 
        name: 'Breeding Sites', 
        geoserverName: 'Soil Temperature',
        id: createLayerId('FallArmyworms', 'Breeding Sites', 'Soil Temperature')
      },
      { 
        name: 'Current Infestation',
        id: createLayerId('FallArmyworms', 'Current Infestation')
      }
    ],
    ClimatologyData: [
      { 
        name: 'Monthly Temperature Anomaly', 
        geoserverName: 'Temperature',
        id: createLayerId('ClimatologyData', 'Monthly Temperature Anomaly', 'Temperature')
      },
      { 
        name: 'Monthly Precipitation (CHIRPS)', 
        geoserverName: 'Precipitation',
        id: createLayerId('ClimatologyData', 'Monthly Precipitation', 'Precipitation')
      },
      { 
        name: 'Monthly Soil Moisture Anomaly', 
        geoserverName: 'Soil Moisture',
        id: createLayerId('ClimatologyData', 'Monthly Soil Moisture Anomaly', 'Soil Moisture')
      },
      { 
        name: 'Wind Speed', 
        geoserverName: 'Wind Speed',
        id: createLayerId('ClimatologyData', 'Wind Speed', 'Wind Speed')
      },
      { 
        name: 'Monthly Soil Temperature Anomaly', 
        geoserverName: 'Soil Temperature',
        id: createLayerId('ClimatologyData', 'Monthly Soil Temperature Anomaly', 'Soil Temperature')
      }
    ],
    Boundary: [
      { 
        name: 'IGAD Boundary',
        id: createLayerId('Boundary', 'IGAD Boundary')
      }
    ]
  };

  // Modified layer visibility handling
  const handleLayerToggle = (layerId) => {
    toggleLayerVisibility(layerId);
  };

  const layerUrls = useMemo(
    () => ({
      'Soil Moisture':
        'http://localhost:8080/geoserver/igad/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=igad%3Aswv_clipped&maxFeatures=50&outputFormat=application%2Fjson',
      'Temperature':
        'http://localhost:8080/geoserver/igad/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=igad:t2m_clipped&outputFormat=application%2Fjson',
      'Precipitation':
        'http://localhost:8080/geoserver/igad/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=igad:spi_clipped&outputFormat=application%2Fjson',
      'Soil Temperature':
        'http://localhost:8080/geoserver/igad/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=igad:stl_clipped&outputFormat=application%2Fjson',
      'Wind Speed':
        'http://localhost:8080/geoserver/igad/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=igad:uv10_view&outputFormat=application%2Fjson',
      'Band Master':
        'http://localhost:8080/geoserver/igad/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=igad:band&outputFormat=application%2Fjson',
      'Hoppers':
        'http://localhost:8080/geoserver/igad/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=igad:hopper1&outputFormat=application%2Fjson',
      'Swarms':
        'http://localhost:8080/geoserver/igad/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=igad:swarm&outputFormat=application%2Fjson',
      'Desert Locust Risk':
        'http://localhost:8080/geoserver/igad/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=igad:rkslevel_view&outputFormat=application%2Fjson',
      'IGAD Boundary': 
        'http://localhost:8080/geoserver/igad/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=igad:boundary&outputFormat=application%2Fjson',
    }),
    []
  );

  // Define the group visibility toggle function inside ControlPanel
  const toggleGroupVisibility = useCallback((groupName) => {
    setGroupVisibility(prev => {
      const newVisibility = !prev[groupName];
      const layers = groupLayerMapping[groupName];
      
      // Toggle visibility for all layers in the group
      layers.forEach(layerKey => {
        toggleLayerVisibility(layerKey, newVisibility);
      });
      
      return { ...prev, [groupName]: newVisibility };
    });
  }, [toggleLayerVisibility, groupLayerMapping]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    
    const categoryToLayer = {
      'Bands': 'Band Master',
      'Swarms': 'Swarms',
      'Hoppers': 'Hoppers'
    };
    
    if (category === '') {
      // Show all layers when "All Categories" is selected
      Object.values(categoryToLayer).forEach(layerKey => {
        if (!layersVisibility[layerKey]) {
          toggleLayerVisibility(layerKey, true);
        }
      });
    } else {
      // Show only the selected category and hide others
      Object.entries(categoryToLayer).forEach(([cat, layerKey]) => {
        const shouldBeVisible = category === cat;
        if (layersVisibility[layerKey] !== shouldBeVisible) {
          toggleLayerVisibility(layerKey, shouldBeVisible);
        }
      });
    }
  }, [layersVisibility, toggleLayerVisibility]);

  const handleFilterChange = useCallback((groupKey, filterType, value) => {
    setLayerFilters((prev) => ({
      ...prev,
      [groupKey]: {
        ...prev[groupKey],
        [filterType]: value,
      },
    }));
  }, []);

  const renderGroupFilter = (groupKey) => {
    const filter = layerFilters[groupKey] || {};

    switch (groupKey) {
      case 'DesertLocust':
        return (
          <div className="filter-options" key={`filter-${groupKey}`}>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="category-select"
            >
              <option value="">All Categories</option>
              <option value="Bands">Bands</option>
              <option value="Swarms">Swarms</option>
              <option value="Hoppers">Hoppers</option>
            </select>
            <select
              value={filter.year ? filter.year.toString() : ''}
              onChange={(e) => handleFilterChange(groupKey, 'year', e.target.value)}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
            <select
              value={filter.month || ''}
              onChange={(e) => handleFilterChange(groupKey, 'month', e.target.value)}
            >
              <option value="">Select Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {new Date(0, month - 1).toLocaleString('en', { month: 'long' })}
                </option>
              ))}
            </select>
            <button onClick={() => handleApplyGroupFilter(groupKey)} className="filter-icon-button">
              <i className="fas fa-check"></i>
            </button>
            <button onClick={() => handleClearGroupFilter(groupKey)} className="filter-icon-button">
              <i className="fas fa-times"></i>
            </button>
          </div>
        );

      case 'QueleaBirds':
      case 'FallArmyworms':
        return (
          <div className="filter-options" key={`filter-${groupKey}`}>
            <select
              value={filter.year ? filter.year.toString() : ''}
              onChange={(e) => handleFilterChange(groupKey, 'year', e.target.value)}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
            <select
              value={filter.month || ''}
              onChange={(e) => handleFilterChange(groupKey, 'month', e.target.value)}
            >
              <option value="">Select Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {new Date(0, month - 1).toLocaleString('en', { month: 'long' })}
                </option>
              ))}
            </select>
            <button onClick={() => handleApplyGroupFilter(groupKey)} className="filter-icon-button">
              <i className="fas fa-check"></i>
            </button>
            <button onClick={() => handleClearGroupFilter(groupKey)} className="filter-icon-button">
              <i className="fas fa-times"></i>
            </button>
          </div>
        );

      default:
        return renderFilterControls(groupKey);
    }
  };

  const handleApplyGroupFilter = useCallback((groupKey) => {
    const filter = layerFilters[groupKey];
    if (!filter?.year || !filter?.month) {
      addLogMessage(`Please select both year and month for ${groupKey}`, 'error');
      return;
    }

    const startDate = `${filter.year}-${String(filter.month).padStart(2, '0')}-01`;
    const endDate = new Date(filter.year, filter.month, 0).getDate();
    const cqlFilter = `finishdate >= '${startDate}' AND finishdate <= '${filter.year}-${String(filter.month).padStart(2, '0')}-${String(endDate).padStart(2, '0')}'`;

    switch (groupKey) {
      case 'DesertLocust':
        ['Band Master', 'Swarms', 'Hoppers'].forEach(layerKey => {
          onApplyFilter(layerKey, cqlFilter, layerUrls[layerKey]);
          if (!layersVisibility[layerKey]) {
            toggleLayerVisibility(layerKey);
          }
        });
        break;
      case 'QueleaBirds':
        onApplyFilter('Quelea Birds', cqlFilter, layerUrls['Quelea Birds']);
        if (!layersVisibility['Quelea Birds']) {
          toggleLayerVisibility('Quelea Birds');
        }
        break;
      case 'FallArmyworms':
        onApplyFilter('Fall Armyworms', cqlFilter, layerUrls['Fall Armyworms']);
        if (!layersVisibility['Fall Armyworms']) {
          toggleLayerVisibility('Fall Armyworms');
        }
        break;
      default:
        addLogMessage(`Unhandled group key: ${groupKey}`, 'warning');
        break;
    }
  }, [layerFilters, onApplyFilter, layerUrls, layersVisibility, toggleLayerVisibility, addLogMessage]);

  const handleClearGroupFilter = useCallback((groupKey) => {
    // Clear the filter state for the group
    setLayerFilters((prev) => {
      const newState = { ...prev };
      delete newState[groupKey];
      return newState;
    });
    
    // Reset category selection for Desert Locust
    if (groupKey === 'DesertLocust') {
      setSelectedCategory('');
    }
    
    // Get all layers associated with this group
    const layersToReset = (() => {
      switch (groupKey) {
        case 'DesertLocust':
          return ['Band Master', 'Swarms', 'Hoppers'];
        case 'QueleaBirds':
          return ['Quelea Birds'];
        case 'FallArmyworms':
          return ['Fall Armyworms'];
        default:
          return [];
      }
    })();

    // Clear filters for each layer and ensure visibility
    layersToReset.forEach(layerKey => {
      // Clear the filter
      onClearFilter(layerKey);
      
      // Make the layer visible
      if (!layersVisibility[layerKey]) {
        toggleLayerVisibility(layerKey, true);
      }
    });

    // Log success message
    addLogMessage(`Cleared filters for ${groupKey} group`, 'info');
  }, [onClearFilter, layersVisibility, toggleLayerVisibility, addLogMessage]);  
  
  // Keep your existing renderFilterControls function for other layers
  const renderFilterControls = (layerKey) => {
    const filter = layerFilters[layerKey] || {};
    const isClimatologyLayer = ['Soil Moisture', 'Temperature', 'Precipitation', 'Wind Speed', 'Soil Temperature'].includes(layerKey);
    const isForecastLayer = layerKey.startsWith('forecast_');
  
    if (isForecastLayer) {
      return (
        <div className="filter-options" key={`filter-${layerKey}`}>
          <select
            value={filter.period || ''}
            onChange={(e) => handleFilterChange(layerKey, 'period', e.target.value)}
            className="forecast-period-select"
          >
            <option value="">Select Forecast Period</option>
            <option value="10_days">Next 10 Days</option>
            <option value="30_days">Next 30 Days</option>
            <option value="90_days">Next 90 Days</option>
          </select>
          <button onClick={() => handleApplyFilter(layerKey)} className="filter-icon-button">
            <i className="fas fa-check"></i>
          </button>
          <button onClick={() => handleClearFilter(layerKey)} className="filter-icon-button">
            <i className="fas fa-times"></i>
          </button>
        </div>
      );
    }
  
    if (layerKey === 'Desert Locust Risk') {
      // Your existing Desert Locust Risk filter code
      return (
        <div className="filter-options" key={`filter-${layerKey}`}>
          <select
            value={filter.period || ''}
            onChange={(e) => handleFilterChange(layerKey, 'period', e.target.value)}
          >
            <option value="">Select Period</option>
            <option value="10_days">Last 10 Days</option>
            <option value="monthly">Monthly</option>
            <option value="3_months">Last 3 Months</option>
          </select>
          <button onClick={() => handleApplyFilter(layerKey)} className="filter-icon-button">
            <i className="fas fa-check"></i>
          </button>
          <button onClick={() => handleClearFilter(layerKey)} className="filter-icon-button">
            <i className="fas fa-times"></i>
          </button>
        </div>
      );
    } else if (isClimatologyLayer) {
      // Your existing Climatology layer filter code
      return (
        <div className="filter-options" key={`filter-${layerKey}`}>
        <select
          value={filter.year ? filter.year.toString() : ''}
          onChange={(e) => handleFilterChange(layerKey, 'year', e.target.value)}
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year.toString()}>{year}</option>
          ))}
        </select>
          <select
            value={filter.month || ''}
            onChange={(e) => handleFilterChange(layerKey, 'month', e.target.value)}
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>
                {new Date(0, month - 1).toLocaleString('en', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={filter.dekad || ''}
            onChange={(e) => handleFilterChange(layerKey, 'dekad', e.target.value)}
          >
            <option value="">Select Dekad</option>
            <option value="1">Dekad 1 (1-10)</option>
            <option value="2">Dekad 2 (11-20)</option>
            <option value="3">Dekad 3 (21-End)</option>
          </select>
          <button onClick={() => handleApplyFilter(layerKey)} className="filter-icon-button">
            <i className="fas fa-check"></i>
          </button>
          <button onClick={() => handleClearFilter(layerKey)} className="filter-icon-button">
            <i className="fas fa-times"></i>
          </button>
        </div>
      );
    }
    return null;
  };

  const handleApplyFilter = useCallback(
    async (layerKey) => {
      const filter = layerFilters[layerKey];
      let cqlFilter = '';
  
      // Check if we're in the Forecasting tab
      if (layerKey.startsWith('forecast_')) {
        if (!filter?.period) {
          addLogMessage('Please select a forecast period', 'error');
          return;
        }
  
        // Calculate date range based on selected period
        const startDate = new Date();
        const endDate = new Date();
        
        switch (filter.period) {
          case '10_days':
            endDate.setDate(endDate.getDate() + 10);
            break;
          case '30_days':
            endDate.setDate(endDate.getDate() + 30);
            break;
          case '90_days':
            endDate.setDate(endDate.getDate() + 90);
            break;
          default:
            addLogMessage('Invalid forecast period selected', 'error');
            return;
        }
  
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        cqlFilter = `forecast_date >= '${formattedStartDate}' AND forecast_date <= '${formattedEndDate}'`;
      } else if (layerKey === 'Desert Locust Risk') {
        // Existing Desert Locust Risk logic
        if (!filter?.period) {
          addLogMessage('Please select a period filter for Desert Locust Risk', 'error');
          return;
        }
  
        try {
          const response = await fetch('http://localhost:8080/geoserver/igad/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=igad:rkslevel_view&outputFormat=application%2Fjson');
          const data = await response.json();
  
          if (!data.features || data.features.length === 0) {
            addLogMessage('No data found from WFS service', 'error');
            return;
          }
  
          const latestFeature = data.features.reduce((latest, feature) => {
            const featureDate = new Date(feature.properties.updated_when);
            return (latest === null || featureDate > latest) ? featureDate : latest;
          }, null);
  
          if (!latestFeature) {
            addLogMessage('No valid date found in the data', 'error');
            return;
          }
  
          const endDate = new Date(latestFeature);
          let startDate = new Date(latestFeature);
  
          if (filter.period === '10_days') {
            startDate.setDate(startDate.getDate() - 10);
          } else if (filter.period === 'monthly') {
            startDate.setMonth(startDate.getMonth() - 1);
          } else if (filter.period === '3_months') {
            startDate.setMonth(startDate.getMonth() - 3);
          }
  
          const formattedStartDate = startDate.toISOString().split('T')[0];
          const formattedEndDate = endDate.toISOString().split('T')[0];
          cqlFilter = `updated_when >= '${formattedStartDate}' AND updated_when <= '${formattedEndDate}'`;
        } catch (error) {
          addLogMessage('Error fetching data from WFS service: ' + error.message, 'error');
          return;
        }
      } else {
        // Existing logic for other layers
        if (!filter?.year || !filter?.month || (['Soil Moisture', 'Temperature', 'Precipitation', 'Wind Speed', 'Soil Temperature'].includes(layerKey) && !filter?.dekad)) {
          addLogMessage(`Please select all required fields (Year, Month${layerKey.includes('Dekad') ? ', and Dekad' : ''}) for ${layerKey}`, 'error');
          return;
        } else if (['Soil Moisture', 'Temperature', 'Precipitation', 'Wind Speed', 'Soil Temperature'].includes(layerKey)) {
          const dekadStart = (filter.dekad - 1) * 10 + 1;
          const dekadEnd = filter.dekad === 3 ? 31 : filter.dekad * 10;
          cqlFilter = `updated_wh >= '${filter.year}-${String(filter.month).padStart(2, '0')}-${String(dekadStart).padStart(2, '0')}' AND updated_wh <= '${filter.year}-${String(filter.month).padStart(2, '0')}-${String(dekadEnd).padStart(2, '0')}'`;
        }
      }
  
      // Apply the filter to the layer
      onApplyFilter(layerKey, cqlFilter, layerUrls[layerKey]);
  
      // Ensure the layer is visible after applying the filter
      if (!layersVisibility[layerKey]) {
        toggleLayerVisibility(layerKey);
      }
    },
    [layerFilters, onApplyFilter, layerUrls, layersVisibility, toggleLayerVisibility, addLogMessage]
  );
  
  const handleClearFilter = useCallback(
    (layerKey) => {
      // Clear the filter state
      setLayerFilters((prev) => {
        const newState = { ...prev };
        delete newState[layerKey];
        return newState;
      });

      // Clear any selected options for this layer
      if (layerKey === 'Desert Locust Risk') {
        // Reset period selection
        setLayerFilters(prev => ({
          ...prev,
          [layerKey]: { period: '' }
        }));
      } else {
        // Reset year, month, dekad selections
        setLayerFilters(prev => ({
          ...prev,
          [layerKey]: { year: '', month: '', dekad: '' }
        }));
      }

      // Call the parent's clear filter function
      onClearFilter(layerKey);

      // Keep the layer visible after clearing
      if (!layersVisibility[layerKey]) {
        toggleLayerVisibility(layerKey, true);
      }

      // Log success message
      addLogMessage(`Cleared filter for ${layerKey}`, 'info');
    },
    [onClearFilter, layersVisibility, toggleLayerVisibility, addLogMessage]
  );

  useEffect(() => {
    fetch('http://localhost:8080/geoserver/igad/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=igad:boundary&outputFormat=application/json')
      .then(response => response.json())
      .then(data => {
        const countryNames = [...new Set(data.features.map(feature => feature.properties.name))];
        setCountries(countryNames.sort());
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);
  
  const renderLayerControls = (layerGroups) => {
    return Object.entries(layerGroups).map(([groupName, layers]) => {
      const isPestGroup = ['DesertLocust', 'QueleaBirds', 'FallArmyworms'].includes(groupName);
      
      return (
        <div key={groupName} className="layer-group">
          <h4 className="layer-group-heading">
            <div className="group-toggle-container">
              <i className="fas fa-ellipsis-v" style={{ marginRight: '8px', verticalAlign: 'middle' }}></i>
              {groupName.replace(/([A-Z])/g, ' $1').trim()}
            </div>
          </h4>

          <div className="layer-toggles">
            {layers.map((layer) => {
              const isVisible = layersVisibility[layer.id];
              const isFiltered = !!layerFilters[layer.id];
              const needsFilter = ['Outbreak Probability', 'Breeding Sites', 'Habitat Suitability'].includes(layer.name);
              const isCurrentInfestation = layer.name === 'Current Infestation';

              return (
                <div key={layer.id} className="layer-toggle-container">
                  <div className="layer-toggle">
                    <span>{layer.name}</span>
                    <div
                      className={`toggle-switch ${isVisible ? 'on' : 'off'}`}
                      onClick={() => handleLayerToggle(layer.id)}
                    >
                      <div className="toggle-knob"></div>
                    </div>
                    <button 
                      className="info-button" 
                      onClick={() => onInfoIconClick(layer.id)}
                    >
                      <i className="fas fa-info-circle"></i>
                    </button>
                  </div>
                  
                  {isVisible && (
                    <>
                      {needsFilter && (
                        <div className="filter-options">
                          <select
                            value={layerFilters[layer.id]?.year || ''}
                            onChange={(e) => handleFilterChange(layer.id, 'year', e.target.value)}
                          >
                            <option value="">Select Year</option>
                            {years.map((year) => (
                              <option key={year} value={year.toString()}>{year}</option>
                            ))}
                          </select>
                          <select
                            value={layerFilters[layer.id]?.month || ''}
                            onChange={(e) => handleFilterChange(layer.id, 'month', e.target.value)}
                          >
                            <option value="">Select Month</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <option key={month} value={month}>
                                {new Date(0, month - 1).toLocaleString('en', { month: 'long' })}
                              </option>
                            ))}
                          </select>
                          <button onClick={() => handleApplyFilter(layer.id)} className="filter-icon-button">
                            <i className="fas fa-check"></i>
                          </button>
                          <button onClick={() => handleClearFilter(layer.id)} className="filter-icon-button">
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      )}
                      {isCurrentInfestation && isPestGroup && renderGroupFilter(groupName)}
                    </>
                  )}
                  {isFiltered && isVisible && (
                    <div className="filter-indicator">
                      <i className="fas fa-filter"></i> Filtered
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  
  const layerGroupsForecasting = {
    OutbreakProbability: ['Outbreak Probability'],
    HabitatSuitability: ['Habitat Suitability'],
  };

  useEffect(() => {
    fetch('http://localhost:8080/geoserver/igad/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=igad:boundary&outputFormat=application/json')
      .then(response => response.json())
      .then(data => {
        const countryNames = [...new Set(data.features.map(feature => feature.properties.name))];
        setCountries(countryNames.sort());
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);
  
  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    onCountryFilter(country);
  };

  return (
    <div className="control-panel">
      <Tabs>
        <TabList>
          <Tab>
            <i className="fas fa-database"></i> Monitoring Data
          </Tab>
          <Tab>
            <i className="fas fa-broadcast-tower"></i> Forecast Data
          </Tab>
        </TabList>

        <div className="country-filter-tab">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="country-select"
          >
            <option value="">Filter by Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <TabPanel>{renderLayerControls(layerGroupsMonitoring)}</TabPanel>
        <TabPanel>{renderLayerControls(layerGroupsForecasting)}</TabPanel>
      </Tabs>
    </div>
  );
};

export default ControlPanel;