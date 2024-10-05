// src/App.js
import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import CitySelector from './components/CitySelector';
import './App.css';

const App = () => {
  const [selectedCity, setSelectedCity] = useState('atlanta'); // Default city
  const [selectedStatistic, setSelectedStatistic] = useState('NORMPOPDENSITY_ADJ');

  const cities = ['atlanta', 'new_york', 'los_angeles'];  // List of cities to display

  return (
    <div className="App">
      <h1>City Population Density Visualization</h1>
      <CitySelector
        cities={cities}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        setSelectedStatistic={setSelectedStatistic}
      />
      <MapComponent city={selectedCity} statistic={selectedStatistic} />
    </div>
  );
};

export default App;
