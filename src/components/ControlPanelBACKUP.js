import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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
  const [groupVisibility, setGroupVisibility] = useState({
    DesertLocust: true,
    QueleaBirds: true,
    FallArmyworms: true
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  // Define the mapping between groups and their layers
  const groupLayerMapping = useMemo(() => ({
    DesertLocust: ['Band Master', 'Swarms', 'Hoppers'],
    QueleaBirds: ['Quelea Birds'],
    FallArmyworms: ['Fall Armyworms']
  }), []);

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
    
    Object.entries(categoryToLayer).forEach(([cat, layerKey]) => {
      const shouldBeVisible = category === cat;
      if (layersVisibility[layerKey] !== shouldBeVisible) {
        toggleLayerVisibility(layerKey, shouldBeVisible);
      }
    });
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
              value={filter.year || ''}
              onChange={(e) => handleFilterChange(groupKey, 'year', e.target.value)}
            >
              <option value="">Select Year</option>
              {Array.from({ length: 2024 - 1965 + 1 }, (_, i) => 2024 - i).map((year) => (
                <option key={year} value={year}>{year}</option>
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
              value={filter.year || ''}
              onChange={(e) => handleFilterChange(groupKey, 'year', e.target.value)}
            >
              <option value="">Select Year</option>
              {Array.from({ length: 2024 - 1965 + 1 }, (_, i) => 2024 - i).map((year) => (
                <option key={year} value={year}>{year}</option>
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
    setLayerFilters((prev) => {
      const newState = { ...prev };
      delete newState[groupKey];
      return newState;
    });
    
    if (groupKey === 'DesertLocust') {
      setSelectedCategory('');
    }
  }, []);
  
  
  // Keep your existing renderFilterControls function for other layers
  const renderFilterControls = (layerKey) => {
    const filter = layerFilters[layerKey] || {};
    const isClimatologyLayer = ['Soil Moisture', 'Temperature', 'Precipitation', 'Wind Speed', 'Soil Temperature'].includes(layerKey);

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
            value={filter.year || ''}
            onChange={(e) => handleFilterChange(layerKey, 'year', e.target.value)}
          >
            <option value="">Select Year</option>
            {Array.from({ length: 2024 - 1965 + 1 }, (_, i) => 2024 - i).map((year) => (
              <option key={year} value={year}>{year}</option>
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

    if (layerKey === 'Desert Locust Risk') {
      if (!filter?.period) {
        addLogMessage('Please select a period filter for Desert Locust Risk', 'error');
        return;
      }

      // Fetch data from the WFS service
      try {
        const response = await fetch('http://localhost:8080/geoserver/igad/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=igad:rkslevel_view&outputFormat=application%2Fjson');
        const data = await response.json();

        if (!data.features || data.features.length === 0) {
          addLogMessage('No data found from WFS service', 'error');
          return;
        }

        // Extract the most recent 'updated_when' date
        const latestFeature = data.features.reduce((latest, feature) => {
          const featureDate = new Date(feature.properties.updated_when);
          return (latest === null || featureDate > latest) ? featureDate : latest;
        }, null);

        if (!latestFeature) {
          addLogMessage('No valid date found in the data', 'error');
          return;
        }

        // Log the latest date found
        console.log('Latest feature date found:', latestFeature.toISOString());

        // Set the endDate to the latest feature date, which remains unchanged
        const endDate = new Date(latestFeature);
        
        // Set startDate based on latestFeature, then adjust for the selected period
        let startDate = new Date(latestFeature);  // Clone latestFeature for modification

        // Adjust startDate based on the selected period
        if (filter.period === '10_days') {
          startDate.setDate(startDate.getDate() - 10);
        } else if (filter.period === 'monthly') {
          startDate.setMonth(startDate.getMonth() - 1);
        } else if (filter.period === '3_months') {
          startDate.setMonth(startDate.getMonth() - 3);
        }

        // Log start and end dates used for filtering
        console.log('Start date for filtering:', startDate.toISOString());
        console.log('End date for filtering:', endDate.toISOString());

        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        cqlFilter = `updated_when >= '${formattedStartDate}' AND updated_when <= '${formattedEndDate}'`;

      } catch (error) {
        addLogMessage('Error fetching data from WFS service: ' + error.message, 'error');
        return;
      }
      } else {
        // For other layer keys
        if (!filter?.year || !filter?.month || (['Soil Moisture', 'Temperature', 'Precipitation', 'Wind Speed', 'Soil Temperature'].includes(layerKey) && !filter?.dekad)) {
          addLogMessage(`Please select all required fields (Year, Month${layerKey.includes('Dekad') ? ', and Dekad' : ''}) for ${layerKey}`, 'error');
          return;        
     
        } else if (['Soil Moisture', 'Temperature', 'Precipitation', 'Wind Speed', 'Soil Temperature'].includes(layerKey)) {
          // Build the date range for the 'Soil Moisture', 'Temperature', etc.
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
      setLayerFilters((prev) => {
        const newState = { ...prev };
        if (layerKey in newState) {
          delete newState[layerKey];
        }
        return newState;
      });
      onClearFilter(layerKey);
    },
    [onClearFilter, setLayerFilters]
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
        const isGroupToggle = ['DesertLocust', 'QueleaBirds', 'FallArmyworms'].includes(groupName);
        const isGroupVisible = isGroupToggle ? groupVisibility[groupName] : layers.some(layer => {
          const layerName = typeof layer === 'string' ? layer : layer.name;
          const layerKey = Object.keys(layerNameMapping).find((key) => layerNameMapping[key] === layerName);
          return layersVisibility[layerKey];
        });
  
        return (
          <div key={groupName} className="layer-group">
            <h4 className="layer-group-heading">
              <div className="group-toggle-container">
                <i className="fas fa-ellipsis-v" style={{ marginRight: '8px', verticalAlign: 'middle' }}></i>
                {groupName.replace(/([A-Z])/g, ' $1').trim()}
                {isGroupToggle && (
                  <>
                    <div
                      className={`toggle-switch ${isGroupVisible ? 'on' : 'off'}`}
                      onClick={() => toggleGroupVisibility(groupName, layers)}
                      style={{ display: 'inline-block', marginLeft: '230px' }}
                    >
                      <div className="toggle-knob"></div>
                    </div>
                    <button 
                      className="info-button" 
                      onClick={() => onInfoIconClick(groupName)}
                      style={{ marginLeft: '8px', fontSize: '24px' }}
                    >
                      <i className="fas fa-info-circle"></i>
                    </button>
                  </>
                )}
              </div>
            </h4>
  
            {/* Only render content if the group is visible or it's not a toggle group */}
            {(!isGroupToggle || isGroupVisible) && (
              <div className="layer-toggles">
                {isGroupToggle && renderGroupFilter(groupName)}
                {layers.map((layer) => {
                  const layerName = typeof layer === 'string' ? layer : layer.name;
                  const layerKey = Object.keys(layerNameMapping).find((key) => layerNameMapping[key] === layerName);
                  const isVisible = layersVisibility[layerKey];
                  const isFiltered = !!layerFilters[layerKey];
  
                  return (
                    <div key={layerKey} className="layer-toggle-container">
                      <div className="layer-toggle">
                        {!isGroupToggle && (
                          <>
                            <span>{layerName}</span>
                            <div
                              className={`toggle-switch ${isVisible ? 'on' : 'off'}`}
                              onClick={() => toggleLayerVisibility(layerKey)}
                            >
                              <div className="toggle-knob"></div>
                            </div>
                            <button className="info-button" onClick={() => onInfoIconClick(layerKey)}>
                              <i className="fas fa-info-circle"></i>
                            </button>
                          </>
                        )}
                        {isGroupToggle && <span>{layerName}</span>}
                      </div>
                      {layersVisibility[layerKey] && renderFilterControls(layerKey)}
                      {isFiltered && isVisible && (
                        <div className="filter-indicator">
                          <i className="fas fa-filter"></i> Filtered
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      });
    };

  const layerGroupsMonitoring = {
    OutbreakProbability: ['Outbreak Probability'],    
    BreedingSites: ['Breeding Sites'],
    HabitatSuitability: ['Habitat Suitability'],
    DesertLocust: [
      { name: 'Bands', icon: 'brown', geoserverName: 'Band Master' },
      { name: 'Swarms', icon: 'blue', geoserverName: 'Swarms' },
      { name: 'Hoppers', icon: 'green', geoserverName: 'Hoppers' },
    ], 
    QueleaBirds: [{ name: 'Quelea Birds', geoserverName: 'Swarms' }],
    FallArmyworms: [{ name: 'Fall Armyworms', geoserverName: 'Hoppers' }],
    ClimatologyData: [
      { name: 'Monthly Temperature Anomaly', geoserverName: 'Temperature' },
      { name: 'Monthly Precipitation (CHIRPS)', geoserverName: 'Precipitation' },
      { name: 'Monthly Soil Moisture Anomaly', geoserverName: 'Soil Moisture' },
      { name: 'Wind Speed', geoserverName: 'Wind Speed' },
      { name: 'Monthly Soil Temperature Anomaly', geoserverName: 'Soil Temperature' },
    ],
    Boundary: ['IGAD Boundary'],
  };
  
  const layerGroupsForecasting = {
    OutbreakProbability: ['Outbreak Probability'],
    BreedingSites: ['Breeding Sites'],
    ClimatologyData: [
      { name: 'Monthly Precipitation (CHIRPS)', geoserverName: 'Precipitation' },
      { name: 'Monthly Soil Moisture Anomaly', geoserverName: 'Soil Moisture' },
      { name: 'Monthly Temperature Anomaly', geoserverName: 'Temperature' },
      { name: 'Wind Speed', geoserverName: 'Wind Speed' },
      { name: 'Monthly Soil Temperature Anomaly', geoserverName: 'Soil Temperature' },
    ],
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
