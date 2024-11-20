import React, { useRef, useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';

const MapComponent = () => {
  const mapRef = useRef();

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new TileLayer({
          source: new TileWMS({
            url: 'http://10.10.1.13:8085/geoserver/pews/wms',
            params: { 'LAYERS': 'pews:band_dl_custom', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    return () => map.setTarget(null);
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default MapComponent;
