// components/MapComponent.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';

const MapComponent = ({ city, statistic }) => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Fetch GeoJSON data for the selected city
    axios.get(`/censusdata/${city}_pdi.geojson`).then((response) => {
      setGeoData(response.data);
    });
  }, [city]);

  // Color scale based on NORMPOPDENSITY
  const getColor = (d) => {
    return d > 0.8
      ? '#00441b'
      : d > 0.6
      ? '#238b45'
      : d > 0.4
      ? '#41ab5d'
      : d > 0.2
      ? '#74c476'
      : d > 0.1
      ? '#a1d99b'
      : '#c7e9c0';
  };

  // Define styling for each feature
  const style = (feature) => ({
    fillColor: getColor(feature.properties[statistic]),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  });

  // Event handler for mouse hover: highlight feature
  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });
  };

  // Event handler for mouseout: reset style
  const resetHighlight = (e) => {
    const layer = e.target;
    layer.setStyle(style(layer.feature));
  };

  // Function to bind tooltips with custom information
  const onEachFeature = (feature, layer) => {
    // Attach a tooltip to each block group
    layer.bindTooltip(
      `<div>
        <strong>Block Group ID:</strong> ${feature.properties.GEOID}<br/>
        <strong>PDI Score:</strong> ${feature.properties[statistic].toFixed(2)}
      </div>`,
      { sticky: true }
    );

    // Add hover effects
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  };

  return (
    <MapContainer center={[33.7490, -84.3880]} zoom={10} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {geoData && (
        <GeoJSON
          data={geoData}
          style={style}
          onEachFeature={onEachFeature}  // Attach tooltips and event handlers
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
