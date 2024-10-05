// components/CitySelector.js
import React from 'react';

const CitySelector = ({ cities, selectedCity, setSelectedCity, setSelectedStatistic }) => {
  return (
    <div className="city-selector">
      <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
        {cities.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
      </select>
      <select onChange={(e) => setSelectedStatistic(e.target.value)}>
        <option value="NORMPOPDENSITY_ADJ">Population Density Index</option>
      </select>
    </div>
  );
};

export default CitySelector;
