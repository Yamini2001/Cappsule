import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import './SearchScreen.css';

const MedicineSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicineData, setMedicineData] = useState(null);
  const [showBackArrow, setShowBackArrow] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedStrength, setSelectedStrength] = useState(null);
  const [selectedPacking, setSelectedPacking] = useState(null);

  useEffect(() => {
    if (medicineData && medicineData.data && medicineData.data.saltSuggestions.length > 0) {
      const defaultSaltSuggestion = medicineData.data.saltSuggestions[0];
      setSelectedForm(defaultSaltSuggestion.available_forms[0]);
      setSelectedStrength(Object.keys(defaultSaltSuggestion.salt_forms_json.Tablet || {})[0]);
      setSelectedPacking(
        Object.keys(
          defaultSaltSuggestion.salt_forms_json.Tablet[selectedStrength] || {}
        )[0]
      );
    }
  }, [medicineData]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://backend.cappsule.co.in/api/v1/new_search?q=${searchTerm}&pharmacyIds=1,2,3`
      );
      const data = await response.json();
      setMedicineData(data);
      setShowBackArrow(true);
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
    setSearchTerm('');
    setMedicineData(null);
    setShowBackArrow(false);
  };

  const handleFormSelect = (form) => {
    setSelectedForm(form);
    setSelectedStrength(null);
    setSelectedPacking(null);
  };

  const handleStrengthSelect = (strength) => {
    setSelectedStrength(strength);
    setSelectedPacking(null);
  };

  const handlePackingSelect = (packing) => {
    setSelectedPacking(packing);
  };

  return (
    <div className="search-screen">
      <h1>Medicine Search</h1>
      <div className="search-container">
        <div className="search-bar">
          {showBackArrow ? (
            <FaArrowLeft className="back-icon" onClick={handleBack} />
          ) : (
            <FaSearch className="search-icon" />
          )}
          <input
            type="text"
            placeholder="Type your medicine name here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearch}>Search</button>
        </div>
      </div>
      <hr />
      {medicineData ? (
        <div>
          {medicineData.data.saltSuggestions.map((saltSuggestion, index) => {
            const hasForm = selectedForm && saltSuggestion.salt_forms_json[selectedForm];
            const hasStrength = hasForm && selectedStrength && saltSuggestion.salt_forms_json[selectedForm][selectedStrength];
            const hasPacking = hasStrength && selectedPacking && saltSuggestion.salt_forms_json[selectedForm][selectedStrength][selectedPacking];

            return (
              <div key={saltSuggestion.id} className="flex-container">
                <div className="salt-suggestions">
                  <div className="salt-name">Salt {String.fromCharCode(65 + index)}</div>
                  <div>
                    <span className="label">Form:</span>
                    <div className="form-buttons">
                      {saltSuggestion.available_forms.map((form, idx) => (
                        <button
                          key={idx}
                          className={`button-4 ${selectedForm === form ? 'selected' : ''}`}
                          disabled={!saltSuggestion.available_forms.includes(form)}
                          onClick={() => handleFormSelect(form)}
                        >
                          {form}
                        </button>
                      ))}
                    </div>
                  </div>
                  {hasForm && (
                    <div>
                      <span className="label">Strength:</span>
                      <div className="strength-options">
                        {Object.keys(saltSuggestion.salt_forms_json[selectedForm]).map((strength, idx) => (
                          <button
                            key={idx}
                            className={`button-4 ${selectedStrength === strength ? 'selected' : ''}`}
                            disabled={!saltSuggestion.salt_forms_json[selectedForm][strength]}
                            onClick={() => handleStrengthSelect(strength)}
                          >
                            {strength}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {hasStrength && (
                    <div>
                      <span className="label">Packaging:</span>
                      <div className="packing-options">
                        {Object.keys(saltSuggestion.salt_forms_json[selectedForm][selectedStrength]).map((packing, idx) => (
                          <button
                            key={idx}
                            className={`button-4 ${selectedPacking === packing ? 'selected' : ''}`}
                            disabled={!saltSuggestion.salt_forms_json[selectedForm][selectedStrength][packing]}
                            onClick={() => handlePackingSelect(packing)}
                          >
                            {packing}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="para1">
                    {saltSuggestion.most_common.Form} | {saltSuggestion.most_common.Strength} | {saltSuggestion.most_common.Packing}
                  </div>
                  <div className="price">
                    {hasPacking ? (
                      saltSuggestion.salt_forms_json[selectedForm][selectedStrength][selectedPacking].some(price => price.selling_price >= 80) ? (
                        <div>From ₹90</div>
                      ) : (
                        <div>No stores selling this product near you</div>
                      )
                    ) : (
                      <div>From ₹80</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <hr />
        </div>
      ) : (
        <div className="discount-text">
          "Find medicine with amazing discount"
        </div>
      )}
    </div>
  );
};

export default MedicineSearch;
