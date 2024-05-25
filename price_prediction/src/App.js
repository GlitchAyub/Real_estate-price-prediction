import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [locations, setLocations] = useState([]);
  const [totalSqft, setTotalSqft] = useState('');
  const [bhk, setBhk] = useState('');
  const [bath, setBath] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/get_location_names');
        console.log('API Response:', response.data);
        if (response.data && Array.isArray(response.data.locations)) {
          setLocations(response.data.locations);
        } else {
          console.error('Unexpected response data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }
    fetchLocations();
  }, []);

  async function evaluate() {
    try {
      const formData = new FormData();
      formData.append('total_sqft', parseFloat(totalSqft));
      formData.append('location', selectedLocation);
      formData.append('bhk', parseInt(bhk));
      formData.append('bath', parseInt(bath));

      const response = await fetch('http://127.0.0.1:5000/predict_home_price', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log('Prediction Response:', data);
      setEstimatedPrice(data.estimated_price);
    } catch (error) {
      console.error('Error predicting home price:', error);
    }
  }

  return (
    <div className="container">
      <form action="" className="form">
        <div className="mb-3">
          <label htmlFor="uiSqft" className="form-label">Area Square Feet</label>
          <input
            type="text"
            className="form-control"
            value={totalSqft}
            onChange={(e) => setTotalSqft(e.target.value)}
          />
          <div  className="form-text">Enter Area Square Feet</div>
        </div>

        <h2>Bhk</h2>
        <br />
        <div className="bhk">
          {[1, 2, 3, 4, 5].map(value => (
            <div className="form-check form-check-inline" key={value}>
              <input
                className="form-check-input"
                type="radio"
                name="bedrooms"
                id={`inlineRadio${value}`}
                value={value}
                onChange={(e) => setBhk(e.target.value)}
              />
              <label className="form-check-label" htmlFor={`inlineRadio${value}`}>{value}</label>
            </div>
          ))}
        </div>

        <h2>Bath</h2>
        <br />
        <div className="bath">
          {[1, 2, 3, 4, 5].map(value => (
            <div className="form-check form-check-inline" key={value}>
              <input
                className="form-check-input"
                type="radio"
                name="bathrooms"
                id={`inlineRadioBath${value}`}
                value={value}
                onChange={(e) => setBath(e.target.value)}
              />
              <label className="form-check-label" htmlFor={`inlineRadioBath${value}`}>{value}</label>
            </div>
          ))}
        </div>

        <br />
        <h2>Location</h2>
        <div className="input-group mb-3">
          <label className="input-group-text" htmlFor="inputGroupSelectLocation">Location</label>
          <select
            className="form-select"
            id="inputGroupSelectLocation"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Choose...</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </form>

      <button type="button" className="btn btn-success mt-3" onClick={evaluate}>Estimate Price</button>
      <div className="card mt-3">
        <div className="card-body" id="uiEstimatedPrice">
          {estimatedPrice && <p className='text-danger'>Estimated Price: {estimatedPrice}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
