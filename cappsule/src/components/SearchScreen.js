import { FaSearch, FaArrowLeft } from 'react-icons/fa'; // Importing FaSearch and FaArrowLeft icons from react-icons
import React, { useState, useEffect } from 'react';
import './SearchScreen.css';

const MedicineSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicineData, setMedicineData] = useState(null);
  const [showBackArrow, setShowBackArrow] = useState(false); // State to manage the visibility of back arrow
  const [selectedForm, setSelectedForm] = useState('');
  const [selectedStrength, setSelectedStrength] = useState('');
  const [selectedPacking, setSelectedPacking] = useState('');

  useEffect(() => {
    // Set default selections if available
    if (medicineData && medicineData.data.saltSuggestions.length > 0) {
      const defaultSuggestion = medicineData.data.saltSuggestions[0];
      if (defaultSuggestion.form_strength_packings.length > 0) {
        setSelectedForm(defaultSuggestion.form_strength_packings[0].form);
        setSelectedStrength(defaultSuggestion.form_strength_packings[0].strength);
        setSelectedPacking(defaultSuggestion.form_strength_packings[0].packing);
      }
    }
  }, [medicineData]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://backend.cappsule.co.in/api/v1/new_search?q=${searchTerm}&pharmacyIds=1,2,3`
      );
      const data = await response.json();
      setMedicineData(data);
      setShowBackArrow(true); // Show back arrow after search
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBack = () => {
    setSearchTerm(''); // Clear search term
    setMedicineData(null); // Clear medicine data
    setShowBackArrow(false); // Hide back arrow
  };

  return (
    <div className="search-screen">
      <h1>Medicine Search</h1>
      <div className="search-container">
        <div className="search-bar">
          {/* Conditional rendering based on showBackArrow state */}
          {showBackArrow ? (
            <FaArrowLeft className="back-icon" onClick={handleBack} />
          ) : (
            <FaSearch className="search-icon" />
          )}
          <input
            type="text"
            placeholder="Type medicine name here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearch}>Search</button>
        </div>
      </div>
      <hr /> {/* Horizontal line below the search bar */}
      {medicineData ? (
        // If medicineData is not null, render nothing
        null
      ) : (
        // If medicineData is null, render the text
        <div className="discount-text">
          " Find medicine with amazing discount "
        </div>
      )}
     
     {medicineData?.data?.saltSuggestions && (
  <div>
    {medicineData.data.saltSuggestions.map((saltSuggestion) => (
      <div className="salt-suggestions" key={saltSuggestion.id}>
              <h2>{saltSuggestion.salt_name}</h2>
              <div className="selection-buttons">
                {/* Form Selection */}
                <div className="selection">
                  {/* <h3>Form:</h3> */}
                  {saltSuggestion.form_strength_packings.map((fsp) => (
                    <button
                      key={fsp.form}
                      onClick={() => setSelectedForm(fsp.form)}
                      className={selectedForm === fsp.form ? "selected" : (fsp.pharmacies.length === 0 ? "unavailable" : "")}
                      disabled={fsp.pharmacies.length === 0}
                    >
                      {fsp.form}
                    </button>
                  ))}
                </div>
                {/* Strength Selection */}
                <div className="selection">
                  <h3>Strength:</h3>
                  {saltSuggestion.form_strength_packings
                    .filter((fsp) => fsp.form === selectedForm)
                    .map((fsp) => (
                      <button
                        key={fsp.strength}
                        onClick={() => setSelectedStrength(fsp.strength)}
                        className={selectedStrength === fsp.strength ? "selected" : (fsp.pharmacies.length === 0 ? "unavailable" : "")}
                        disabled={fsp.pharmacies.length === 0}
                      >
                        {fsp.strength}
                      </button>
                    ))}
                </div>
                {/* Packing Selection */}
                <div className="selection">
                  <h3>Packing:</h3>
                  {saltSuggestion.form_strength_packings
                    .filter((fsp) => fsp.form === selectedForm && fsp.strength === selectedStrength)
                    .map((fsp) => (
                      <button
                        key={fsp.packing}
                        onClick={() => setSelectedPacking(fsp.packing)}
                        className={selectedPacking === fsp.packing ? "selected" : (fsp.pharmacies.length === 0 ? "unavailable" : "")}
                        disabled={fsp.pharmacies.length === 0}
                      >
                        {fsp.packing}
                      </button>
                    ))}
                </div>
              </div>
              {/* Display pharmacies */}
              {saltSuggestion.form_strength_packings
                .filter((fsp) => fsp.form === selectedForm && fsp.strength === selectedStrength && fsp.packing === selectedPacking)
                .map((fsp) => (
                  <div key={`${fsp.form}-${fsp.strength}-${fsp.packing}`}>
                    {fsp.pharmacies.length > 0 ? (
                      <ul>
                        {fsp.pharmacies.map((pharmacy) => (
                          <li key={pharmacy.id}>
                            {pharmacy.name}: {pharmacy.price}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No stores selling this product near you</p>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
      <hr/>
    </div>
  );
};

export default MedicineSearch;
